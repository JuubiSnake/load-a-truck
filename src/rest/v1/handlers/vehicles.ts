import { Request, Response } from "express";
import StatusCode from "status-code-enum";
import { Logger } from "tslog";
import { Truck } from "../../../models/truck";
import { Weight } from "../../../models/weight";
import { isVehicleListSchema, VehicleResponse, VehicleSchema, VehiclesResponse } from "../schemas/vehicle";
import { StorageClient, StorageError, StorageErrorType } from "../../../storage/interfaces";
import { ErrorSchema, ErrorType } from "../schemas/error";
import { VehicleError, VehicleType } from "../../../models/interfaces";
import { ResponseSchema } from "../schemas/response";

export class VehicleHandler {
    
    private storageHandler: StorageClient;
    private logger: Logger;

    constructor(storageHandler: StorageClient) {
        this.storageHandler = storageHandler;        
        this.logger = new Logger();
    }

    private handleStorageError(error: StorageError, res: Response<ResponseSchema<ErrorSchema>>) {
        this.logger.error(error.message);
        switch (error.getType()) {
            case StorageErrorType.AlreadyExists:
                return res
                    .status(StatusCode.ClientErrorBadRequest)
                    .json({ data: { error: ErrorType.AlreadyExists } });
            case StorageErrorType.NotFound:
                return res
                    .status(StatusCode.ClientErrorNotFound)
                    .json({ data: { error: ErrorType.NotFound } });
            default:
                return res
                    .status(StatusCode.ServerErrorInternal)
                    .json({ data: { error: ErrorType.InternalError } });
        }
    }

    private handleVehicleError(error: VehicleError, res: Response<ResponseSchema<ErrorSchema>>) {
        this.logger.error(error.message);
        return res
            .status(StatusCode.ClientErrorUnprocessableEntity)
            .json({ data: { error: error.message } });
    }

    createVehicles(req: Request, res: Response<ResponseSchema<VehiclesResponse | ErrorSchema>>) {
        const payload = req.body;
        if (!isVehicleListSchema(payload)) {
            return res
                .status(StatusCode.ClientErrorBadRequest)
                .json({data: {error: ErrorType.DoesNotMatchSchema}});
        }
        const vehicles = payload.map(entry => {
            switch (entry.type) {
                case VehicleType.Truck:
                    return new Truck(entry.id, new Weight(entry.weightCapacity.kg));
            }
        });
        const result = this.storageHandler.addVehicles(vehicles);    
        if (result.isErr) {
            return this.handleStorageError(result.error, res);
        }
        const responsePayload: Array<VehicleSchema> = result.value
            .map(v => {
                return { 
                    id: v.getID(), 
                    weightCapacity: { kg: v.getWeightCapacity().kg }, 
                    type: v.getType() ,
                    loadedParcels: v.getLoadedParcelIDs(),
                    currentWeight: v.getCurrentWeight(),
                }
            });
        return res
            .status(StatusCode.SuccessCreated)
            .json({data: { vehicles: responsePayload }})
    }

    listVehicles(_: Request, res: Response<ResponseSchema<VehiclesResponse | ErrorSchema>>) {
        const result = this.storageHandler.listVehicles();
        if (result.isErr) {
            return this.handleStorageError(result.error, res);
        }
        const responsePayload: Array<VehicleSchema> = result.value
            .map(v => {
                return { 
                    id: v.getID(), 
                    weightCapacity: { kg: v.getWeightCapacity().kg }, 
                    type: v.getType(), 
                    currentWeight: v.getCurrentWeight(),
                    loadedParcels: v.getLoadedParcelIDs(),
                }
            });
        return res
            .status(StatusCode.SuccessOK)
            .json({data: { vehicles: responsePayload}});
    }

    getVehicleByID(req: Request, res: Response<ResponseSchema<VehicleResponse | ErrorSchema>>) {
        const vehicleID = req.params["vehicleID"];
        const result = this.storageHandler.getVehicle(vehicleID);
        if (result.isErr) {
            return this.handleStorageError(result.error, res);
        }
        const responsePayload: VehicleSchema = {
            id: result.value.getID(),
            weightCapacity: { kg: result.value.getWeightCapacity().kg },
            currentWeight: { kg: result.value.getCurrentWeight().kg },
            type: result.value.getType(),
            loadedParcels: result.value.getLoadedParcelIDs(),
        }
        return res
            .status(StatusCode.SuccessOK)
            .json({ data: {vehicle: responsePayload } });
    }

    removeVehicle(req: Request, res: Response<ResponseSchema<VehicleResponse | ErrorSchema>>) {
        const vehicleID = req.params["vehicleID"];
        const result = this.storageHandler.deleteVehicle(vehicleID);
        if (result.isErr) {
            return this.handleStorageError(result.error, res);
        }
        const responsePayload: VehicleSchema = {
            id: result.value.getID(),
            weightCapacity: { kg: result.value.getWeightCapacity().kg },
            currentWeight: { kg: result.value.getCurrentWeight().kg },
            type: result.value.getType(),
            loadedParcels: result.value.getLoadedParcelIDs()
        }
        return res
            .status(StatusCode.SuccessOK)
            .json({ data: {vehicle: responsePayload } });
    }

    removeAllVehicles(_: Request, res: Response<ResponseSchema<VehiclesResponse | ErrorSchema>>) {
        const result = this.storageHandler.deleteVehicles();
        if (result.isErr) {
            return this.handleStorageError(result.error, res);
        }
        const responsePayload: Array<VehicleSchema> = result.value
            .map(v => {
                return { 
                    id: v.getID(), 
                    weightCapacity: { kg: v.getWeightCapacity().kg }, 
                    type: v.getType(), 
                    currentWeight: v.getCurrentWeight(),
                    loadedParcels: v.getLoadedParcelIDs()
                }
            });
        return res
            .status(StatusCode.SuccessOK)
            .json({data: { vehicles: responsePayload}});
    }


    loadParcelsOnVehicle(req: Request, res: Response<ResponseSchema<VehicleResponse | ErrorSchema>>) {
        const vehicleID = req.params["vehicleID"];
        const vehicleResult = this.storageHandler.getVehicle(vehicleID);
        if (vehicleResult.isErr) {
            return this.handleStorageError(vehicleResult.error, res);
        }
        const vehicle = vehicleResult.value;
        const parcelID = req.params["parcelID"];
        const parcelResult = this.storageHandler.getParcel(parcelID);
        if (parcelResult.isErr) {
            return this.handleStorageError(parcelResult.error, res);
        }
        const parcel = parcelResult.value;
        let loadingResult = vehicle.loadParcel(parcel);
        if (loadingResult.isErr) {
            return this.handleVehicleError(loadingResult.error, res);
        }
        const responsePayload: VehicleSchema = {
            id: vehicle.getID(),
            weightCapacity: { kg: vehicle.getWeightCapacity().kg },
            currentWeight: { kg: vehicle.getCurrentWeight().kg },
            type: vehicle.getType(),
            loadedParcels: vehicle.getLoadedParcelIDs()
        }
        return res.status(StatusCode.SuccessOK).json({ data: { vehicle: responsePayload}});
    }

    unloadParcelsFromVehicle(req: Request, res: Response) {
        const vehicleID = req.params["vehicleID"];
        const vehicleResult = this.storageHandler.getVehicle(vehicleID);
        if (vehicleResult.isErr) {
            return this.handleStorageError(vehicleResult.error, res);
        }
        const vehicle = vehicleResult.value;
        const parcelID = req.params["parcelID"];
        const parcelResult = this.storageHandler.getParcel(parcelID);
        if (parcelResult.isErr) {
            return this.handleStorageError(parcelResult.error, res);
        }
        const parcel = parcelResult.value;
        let unloadingResult = vehicle.unloadParcel(parcel);
        if (unloadingResult.isErr) {
            return this.handleVehicleError(unloadingResult.error, res);
        }
        const responsePayload: VehicleSchema = {
            id: vehicle.getID(),
            weightCapacity: { kg: vehicle.getWeightCapacity().kg },
            currentWeight: { kg: vehicle.getCurrentWeight().kg },
            type: vehicle.getType(),
            loadedParcels: vehicle.getLoadedParcelIDs()
        }
        return res.status(StatusCode.SuccessOK).json({ data: { vehicle: responsePayload}});
    }
}