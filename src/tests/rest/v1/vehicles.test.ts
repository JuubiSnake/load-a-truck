import { Result } from "@badrap/result";
import * as supertest from "supertest";
import { instance, mock, when } from "ts-mockito";
import { ParcelInterface, VehicleError, VehicleInterface, VehicleType } from "../../../models/interfaces";
import { Weight } from "../../../models/weight";
import { ErrorType } from "../../../rest/v1/schemas/error";
import { Server } from "../../../rest/v1/server/server";
import { StorageClient, StorageError, StorageErrorType } from "../../../storage/interfaces";

describe('GET /rest/v1/vehicles', () => {
    it('should return an empty list when no vehicles have been stored', (done) => {
        let mockStorage = mock<StorageClient>();
        when(mockStorage.listVehicles()).thenReturn(Result.ok([]));
        const mockStorageInstance = instance(mockStorage);
        const restServer = new Server(mockStorageInstance);
    
        supertest.default(restServer.getApp())
            .get('/rest/v1/vehicles')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .then(response => {
                expect(response.body).toStrictEqual({ 
                    data: { 
                        vehicles: []
                }})
                done();
            })
            .catch(error => done(error));
    });

    it('should list all vehicles that have been stored', (done) => {
        let mockedVehicle = mock<VehicleInterface>();
        when(mockedVehicle.getID()).thenReturn('cool-vehicle');
        when(mockedVehicle.getWeightCapacity()).thenReturn(new Weight(10));
        when(mockedVehicle.getLoadedParcelIDs()).thenReturn([]);
        when(mockedVehicle.getType()).thenReturn(VehicleType.Truck);
        when(mockedVehicle.getCurrentWeight()).thenReturn(new Weight(10));

        const mockedVehicleInstance = instance(mockedVehicle);

        let mockStorage = mock<StorageClient>();
        when(mockStorage.listVehicles()).thenReturn(Result.ok([mockedVehicleInstance]));
        const mockStorageInstance = instance(mockStorage);
        const restServer = new Server(mockStorageInstance);
    
        supertest.default(restServer.getApp())
            .get('/rest/v1/vehicles')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .then(response => {
                expect(response.body).toStrictEqual({ 
                    data: { 
                        vehicles: [ { 
                            id: 'cool-vehicle', 
                            currentWeight: { kg: 10 },
                            loadedParcels: [],
                            type: 'truck',
                            weightCapacity: { kg: 10 },
                        } ]
                }})
                done();
            })
            .catch(error => done(error));
    });
});

describe('POST /rest/v1/vehicles', () => {
    it('should return 400 when creating vehicle with missing info', (done) => {

        let mockStorage = mock<StorageClient>();
        const mockStorageInstance = instance(mockStorage);
        const restServer = new Server(mockStorageInstance);
    
        supertest.default(restServer.getApp())
            .post('/rest/v1/vehicles')
            .set('Accept', 'application/json')
            .send({})
            .expect('Content-Type', /json/)
            .expect(400)
            .then(response => {
                expect(response.body).toStrictEqual({ 
                    data: {
                        error: ErrorType.DoesNotMatchSchema
                    } 
                })
                done();
            })
            .catch(error => done(error));
    });
});

describe('POST /rest/v1/vehicles', () => {
    it('should return 201 when creating a vehicle', (done) => {
        let mockedVehicle = mock<VehicleInterface>();
        when(mockedVehicle.getID()).thenReturn('cool-vehicle');
        when(mockedVehicle.getWeightCapacity()).thenReturn(new Weight(10));
        when(mockedVehicle.getLoadedParcelIDs()).thenReturn([]);
        when(mockedVehicle.getType()).thenReturn(VehicleType.Truck);
        when(mockedVehicle.getCurrentWeight()).thenReturn(Weight.Empty());

        const mockedVehicleInstance = instance(mockedVehicle);

        let mockStorage = mock<StorageClient>();
        when(mockStorage.addVehicles).thenReturn(() => Result.ok([mockedVehicleInstance]));
        const mockStorageInstance = instance(mockStorage);
        const restServer = new Server(mockStorageInstance);
    
        supertest.default(restServer.getApp())
            .post('/rest/v1/vehicles')
            .set('Accept', 'application/json')
            .send([ { id: 'cool-vehicle', weightCapacity: { kg: 10 }, type: 'truck' } ])
            .expect('Content-Type', /json/)
            .expect(201)
            .then(response => {
                expect(response.body).toStrictEqual({ 
                    data: {
                        vehicles: [{ 
                            id: 'cool-vehicle', 
                            weightCapacity: { kg: 10 },
                            type: 'truck',
                            loadedParcels: [],
                            currentWeight: { kg: 0 },
                        }]
                    }
                })
                done();
            })
            .catch(error => done(error));
    });

    it('should return 400 when creating a duplicate vehicle', (done) => {
        let mockStorage = mock<StorageClient>();
        when(mockStorage.addVehicles).thenReturn(() => Result.err(new StorageError(StorageErrorType.AlreadyExists, "")));
        const mockStorageInstance = instance(mockStorage);
        const restServer = new Server(mockStorageInstance);
    
        supertest.default(restServer.getApp())
            .post('/rest/v1/vehicles')
            .set('Accept', 'application/json')
            .send([ { id: 'cool-vehicle', weightCapacity: { kg: 10 }, type: 'truck' } ])
            .expect('Content-Type', /json/)
            .expect(400)
            .then(response => {
                expect(response.body).toStrictEqual({ 
                    data: { error: ErrorType.AlreadyExists }
                })
                done();
            })
            .catch(error => done(error));
    });
});

describe('GET /rest/v1/vehicles/:vehicleID', () => {
    it('should return 200 when requesting a vehicle that is stored', (done) => {
        let mockedVehicle = mock<VehicleInterface>();
        when(mockedVehicle.getID()).thenReturn('cool-vehicle');
        when(mockedVehicle.getWeightCapacity()).thenReturn(new Weight(10));
        when(mockedVehicle.getLoadedParcelIDs()).thenReturn([]);
        when(mockedVehicle.getType()).thenReturn(VehicleType.Truck);
        when(mockedVehicle.getCurrentWeight()).thenReturn(Weight.Empty());

        const mockedVehicleInstance = instance(mockedVehicle);

        let mockStorage = mock<StorageClient>();
        when(mockStorage.getVehicle('cool-vehicle')).thenReturn(Result.ok(mockedVehicleInstance));
        const mockStorageInstance = instance(mockStorage);
        const restServer = new Server(mockStorageInstance);
    
        supertest.default(restServer.getApp())
            .get('/rest/v1/vehicles/cool-vehicle')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .then(response => {
                expect(response.body).toStrictEqual({ 
                    data: {
                        vehicle: { 
                            id: 'cool-vehicle', 
                            weightCapacity: { kg: 10 },
                            type: 'truck',
                            loadedParcels: [],
                            currentWeight: { kg: 0 },
                        }
                    }
                })
                done();
            })
            .catch(error => done(error));
    });

    it('should return 404 when requesting a vehicle that isnt stored', (done) => {
        let mockStorage = mock<StorageClient>();
        when(mockStorage.getVehicle('cool-vehicle')).thenReturn(Result.err(new StorageError(StorageErrorType.NotFound, "")));
        const mockStorageInstance = instance(mockStorage);
        const restServer = new Server(mockStorageInstance);
    
        supertest.default(restServer.getApp())
            .get('/rest/v1/vehicles/cool-vehicle')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(404)
            .then(response => {
                expect(response.body).toStrictEqual({ 
                    data: {
                        error: ErrorType.NotFound
                    }
                })
                done();
            })
            .catch(error => done(error));
    });
});

describe('PUT /rest/v1/vehicles/:vehicleID/parcels/load/:parcelID', () => {
    it('should return 200 when loading a vehicle with enough capacity', (done) => {     
        let mockedVehicle = mock<VehicleInterface>();
        when(mockedVehicle.getID()).thenReturn('cool-vehicle');
        when(mockedVehicle.getWeightCapacity()).thenReturn(new Weight(100));
        when(mockedVehicle.getLoadedParcelIDs()).thenReturn(['cool-parcel']);
        when(mockedVehicle.getType()).thenReturn(VehicleType.Truck);
        when(mockedVehicle.getCurrentWeight()).thenReturn(new Weight(10));
        when(mockedVehicle.loadParcel).thenReturn(() => Result.ok(true));
        const mockedVehicleInstance = instance(mockedVehicle);

        const parcelID = "cool-parcel";
        let mockedParcel = mock<ParcelInterface>();
        when(mockedParcel.getID()).thenReturn(parcelID);
        when(mockedParcel.getWeight()).thenReturn(new Weight(10));
        const mockedParcelInstance = instance(mockedParcel);

        let mockStorage = mock<StorageClient>();
        when(mockStorage.getVehicle('cool-vehicle')).thenReturn(Result.ok(mockedVehicleInstance));
        when(mockStorage.getParcel('cool-parcel')).thenReturn(Result.ok(mockedParcelInstance));
        const mockStorageInstance = instance(mockStorage);
        const restServer = new Server(mockStorageInstance);
    
        supertest.default(restServer.getApp())
            .put('/rest/v1/vehicles/cool-vehicle/parcels/load/cool-parcel')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .then(response => {
                expect(response.body).toStrictEqual({ 
                    data: {
                        vehicle: { 
                            id: 'cool-vehicle', 
                            weightCapacity: { kg: 100 },
                            type: 'truck',
                            loadedParcels: [ 'cool-parcel' ],
                            currentWeight: { kg: 10 },
                        }
                    }
                })
                done();
            })
            .catch(error => done(error));
    });

    it('should return 422 when unable to store a parcel', (done) => {
        let mockedVehicle = mock<VehicleInterface>();
        when(mockedVehicle.getID()).thenReturn('cool-vehicle');
        when(mockedVehicle.getWeightCapacity()).thenReturn(Weight.Empty());
        when(mockedVehicle.getLoadedParcelIDs()).thenReturn(['cool-parcel']);
        when(mockedVehicle.getType()).thenReturn(VehicleType.Truck);
        when(mockedVehicle.getCurrentWeight()).thenReturn(Weight.Empty());
        when(mockedVehicle.loadParcel).thenReturn(() => Result.err(new VehicleError('unable to load')));
        const mockedVehicleInstance = instance(mockedVehicle);

        const parcelID = "cool-parcel";
        let mockedParcel = mock<ParcelInterface>();
        when(mockedParcel.getID()).thenReturn(parcelID);
        when(mockedParcel.getWeight()).thenReturn(new Weight(10));
        const mockedParcelInstance = instance(mockedParcel);

        let mockStorage = mock<StorageClient>();
        when(mockStorage.getVehicle('cool-vehicle')).thenReturn(Result.ok(mockedVehicleInstance));
        when(mockStorage.getParcel('cool-parcel')).thenReturn(Result.ok(mockedParcelInstance));
        const mockStorageInstance = instance(mockStorage);
        const restServer = new Server(mockStorageInstance);
    
        supertest.default(restServer.getApp())
            .put('/rest/v1/vehicles/cool-vehicle/parcels/load/cool-parcel')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(422)
            .then(response => {
                console.log(response);
                expect(response.body).toStrictEqual({ 
                    data: {
                        error: 'unable to load'
                    }
                })
                done();
            })
            .catch(error => done(error));
    });
});

describe('PUT /rest/v1/vehicles/:vehicleID/parcels/unload/:parcelID', () => {
    it('should return 200 when unloading a vehicle', (done) => {     
        let mockedVehicle = mock<VehicleInterface>();
        when(mockedVehicle.getID()).thenReturn('cool-vehicle');
        when(mockedVehicle.getWeightCapacity()).thenReturn(new Weight(100));
        when(mockedVehicle.getLoadedParcelIDs()).thenReturn([]);
        when(mockedVehicle.getType()).thenReturn(VehicleType.Truck);
        when(mockedVehicle.getCurrentWeight()).thenReturn(new Weight(10));
        when(mockedVehicle.unloadParcel).thenReturn(() => Result.ok(true));
        const mockedVehicleInstance = instance(mockedVehicle);

        const parcelID = "cool-parcel";
        let mockedParcel = mock<ParcelInterface>();
        when(mockedParcel.getID()).thenReturn(parcelID);
        when(mockedParcel.getWeight()).thenReturn(new Weight(10));
        const mockedParcelInstance = instance(mockedParcel);

        let mockStorage = mock<StorageClient>();
        when(mockStorage.getVehicle('cool-vehicle')).thenReturn(Result.ok(mockedVehicleInstance));
        when(mockStorage.getParcel('cool-parcel')).thenReturn(Result.ok(mockedParcelInstance));
        const mockStorageInstance = instance(mockStorage);
        const restServer = new Server(mockStorageInstance);
    
        supertest.default(restServer.getApp())
            .put('/rest/v1/vehicles/cool-vehicle/parcels/unload/cool-parcel')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .then(response => {
                expect(response.body).toStrictEqual({ 
                    data: {
                        vehicle: { 
                            id: 'cool-vehicle', 
                            weightCapacity: { kg: 100 },
                            type: 'truck',
                            loadedParcels: [ ],
                            currentWeight: { kg: 10 },
                        }
                    }
                })
                done();
            })
            .catch(error => done(error));
    });

    it('should return 422 when unable to store a parcel', (done) => {
        let mockedVehicle = mock<VehicleInterface>();
        when(mockedVehicle.getID()).thenReturn('cool-vehicle');
        when(mockedVehicle.getWeightCapacity()).thenReturn(Weight.Empty());
        when(mockedVehicle.getLoadedParcelIDs()).thenReturn(['cool-parcel']);
        when(mockedVehicle.getType()).thenReturn(VehicleType.Truck);
        when(mockedVehicle.getCurrentWeight()).thenReturn(Weight.Empty());
        when(mockedVehicle.unloadParcel).thenReturn(() => Result.err(new VehicleError('unable to unload')));
        const mockedVehicleInstance = instance(mockedVehicle);

        const parcelID = "cool-parcel";
        let mockedParcel = mock<ParcelInterface>();
        when(mockedParcel.getID()).thenReturn(parcelID);
        when(mockedParcel.getWeight()).thenReturn(new Weight(10));
        const mockedParcelInstance = instance(mockedParcel);

        let mockStorage = mock<StorageClient>();
        when(mockStorage.getVehicle('cool-vehicle')).thenReturn(Result.ok(mockedVehicleInstance));
        when(mockStorage.getParcel('cool-parcel')).thenReturn(Result.ok(mockedParcelInstance));
        const mockStorageInstance = instance(mockStorage);
        const restServer = new Server(mockStorageInstance);
    
        supertest.default(restServer.getApp())
            .put('/rest/v1/vehicles/cool-vehicle/parcels/unload/cool-parcel')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(422)
            .then(response => {
                expect(response.body).toStrictEqual({ 
                    data: {
                        error: 'unable to unload'
                    }
                })
                done();
            })
            .catch(error => done(error));
    });
});

