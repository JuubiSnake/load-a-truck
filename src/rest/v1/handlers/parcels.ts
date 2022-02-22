import { StorageClient, StorageErrorType } from "../../../storage/interfaces";
import { Request, Response } from "express";
import { StatusCode } from 'status-code-enum'
import { Logger } from "tslog";
import { Parcel } from "../../../models/parcel";
import { Weight } from "../../../models/weight";
import { isParcelListSchema, ParcelResponse, ParcelSchema, ParcelsResponse } from "../schemas/parcel";
import { ResponseSchema } from "../schemas/response";
import { ErrorSchema, ErrorType } from "../schemas/error";


export class ParcelHandler {
    private storageHandler: StorageClient;
    private logger: Logger;

    constructor(storageHandler: StorageClient) {
        this.storageHandler = storageHandler;        
        this.logger = new Logger();
    }

    createParcels(req: Request, res: Response<ResponseSchema<ParcelsResponse | ErrorSchema>>) {
        const payload = req.body;
        if (!isParcelListSchema(payload)) {
            return res
                .status(StatusCode.ClientErrorBadRequest)
                .json({data: {error: ErrorType.DoesNotMatchSchema}});
        }
        const parcels = payload.map(entry => new Parcel(entry.id, new Weight(entry.weight.kg)));
        const result = this.storageHandler.addParcels(parcels);    
        if (result.isErr) {
            this.logger.error(result.error.message);
            switch (result.error.getType()) {
                case StorageErrorType.AlreadyExists:
                    return res
                        .status(StatusCode.ClientErrorBadRequest)
                        .json({data: {error: ErrorType.AlreadyExists}});
                default:
                    return res
                        .status(StatusCode.ServerErrorInternal)
                        .json({data: { error: ErrorType.InternalError}});
            }
        }
        const responsePayload: Array<ParcelSchema> = result.value
            .map(p => {
                return { id: p.getID(), weight: { kg: p.getWeight().kg } }
            });
        return res
            .status(StatusCode.SuccessCreated)
            .json({data: {parcels: responsePayload}})
    }

    getParcels(_: Request, res: Response<ResponseSchema<ParcelsResponse | ErrorSchema>>) {
        const result = this.storageHandler.listParcels();
        if (result.isErr) {
            this.logger.error(result.error.message);
            return res
                .status(StatusCode.ServerErrorInternal)
                .json({data: { error: ErrorType.InternalError }});
        }
        const responsePayload: Array<ParcelSchema> = result.value
            .map(p => {
                return { id: p.getID(), weight: { kg: p.getWeight().kg } }
            });
        return res
            .status(StatusCode.SuccessOK)
            .json({data: { parcels: responsePayload}});
    }

    getParcel(req: Request, res: Response<ResponseSchema<ParcelResponse | ErrorSchema>>) {
        const parcelID = req.params["parcelID"];
        const result = this.storageHandler.getParcel(parcelID);
        if (result.isErr) {
            this.logger.error(result.error.message);
            return res
                .status(StatusCode.ClientErrorNotFound)
                .json({data: {error: ErrorType.NotFound}});
        }
        const responsePayload: ParcelSchema = { 
            id: result.value.getID(),
            weight: { kg: result.value.getWeight().kg } 
        };
        return res
            .status(StatusCode.SuccessOK)
            .json({data: {parcel: responsePayload}});
    }

    deleteParcels(_: Request, res: Response<ResponseSchema<ParcelsResponse | ErrorSchema>>) {
        const result = this.storageHandler.deleteParcels();
        if (result.isErr) {
            this.logger.error(result.error.message);
            return res
                .status(StatusCode.ServerErrorInternal)
                .json({data: { error: ErrorType.InternalError }});
        }
        const responsePayload: Array<ParcelSchema> = result.value
            .map(p => {
                return { id: p.getID(), weight: { kg: p.getWeight().kg } }
            });
        return res
            .status(StatusCode.SuccessOK)
            .json({data: {parcels: responsePayload}});
    }
    
    deleteParcel(req: Request, res: Response<ResponseSchema<ParcelResponse | ErrorSchema>>) {
        const parcelID = req.params["parcelID"];
        const result = this.storageHandler.deleteParcel(parcelID);
        if (result.isErr) {
            this.logger.error(result.error.message);
            switch (result.error.getType()) {
                case StorageErrorType.NotFound:
                    return res
                        .status(StatusCode.ClientErrorBadRequest)
                        .json({data: {error: ErrorType.NotFound}});
                default:
                    return res
                        .status(StatusCode.ServerErrorInternal)
                        .json({data: { error: ErrorType.InternalError}});
            }
        }
        const responsePayload: ParcelSchema = { 
            id: result.value.getID(),
            weight: { kg: result.value.getWeight().kg } 
        };
        return res
            .status(StatusCode.SuccessOK)
            .json({data: { parcel: responsePayload }});
    }
}