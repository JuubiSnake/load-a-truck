import express from "express";
import { Logger } from "tslog";
import { StorageClient } from "../../../storage/interfaces";
import { ParcelHandler } from "../handlers/parcels";
import { VehicleHandler } from "../handlers/vehicles";

const ROOT_PATH = "/rest/v1";
const DEFAULT_PORT = 8000;

export class Server {
    private parcelHandler: ParcelHandler;
    private vehicleHandler: VehicleHandler;

    private app: express.Express;
    private port: number;

    private logger: Logger;

    constructor(storageHandler: StorageClient, port?: number, ) {
        this.parcelHandler = new ParcelHandler(storageHandler);
        this.vehicleHandler = new VehicleHandler(storageHandler);
        this.logger = new Logger();
        this.port = port === undefined ? DEFAULT_PORT : port;
        
        const router = express.Router();
        this.setupVehicleRoutes(router);
        this.setupParcelRoutes(router);

        const app = express();
        app.use(express.json());
        app.use(router);
        this.app = app;
    }

    private setupVehicleRoutes(router: express.Router) {
        router.post(`${ROOT_PATH}/vehicles`, (req, res) => this.vehicleHandler.createVehicles(req, res));
        router.get(`${ROOT_PATH}/vehicles`, (req, res) => this.vehicleHandler.listVehicles(req,res));
        router.delete(`${ROOT_PATH}/vehicles`, (req, res) => this.vehicleHandler.removeAllVehicles(req, res));

        router.get(`${ROOT_PATH}/vehicles/:vehicleID`, (req, res) => this.vehicleHandler.getVehicleByID(req, res));        
        router.put(`${ROOT_PATH}/vehicles/:vehicleID/parcels/load/:parcelID`, (req, res) => this.vehicleHandler.loadParcelsOnVehicle(req, res));
        router.put(`${ROOT_PATH}/vehicles/:vehicleID/parcels/unload/:parcelID`, (req, res) => this.vehicleHandler.unloadParcelsFromVehicle(req, res));
    }

    private setupParcelRoutes(router: express.Router) {
        router.get(`${ROOT_PATH}/parcels`, (req, res) => this.parcelHandler.getParcels(req, res));
        router.delete(`${ROOT_PATH}/parcels`, (req, res) => this.parcelHandler.deleteParcels(req, res));
        router.post(`${ROOT_PATH}/parcels`, (req, res) => this.parcelHandler.createParcels(req, res));
        
        router.get(`${ROOT_PATH}/parcels/:parcelID`, (req, res) => this.parcelHandler.getParcel(req, res));
    }

    public getApp() {
        return this.app;
    }

    public listen() {
        this.app.listen(this.port, () => {
            this.logger.info(`listening on port ${this.port}`);
        });
    }
}