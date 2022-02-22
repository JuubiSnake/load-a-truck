import * as supertest from "supertest";
import { Server } from "../../../rest/v1/server/server";
import { instance, mock, when } from "ts-mockito";
import { StorageClient, StorageError, StorageErrorType } from "../../../storage/interfaces";
import { Result } from "@badrap/result";
import { Weight } from "../../../models/weight";
import { ParcelInterface } from "../../../models/interfaces";
import { ErrorType } from "../../../rest/v1/schemas/error";


describe('GET /rest/v1/parcels', () => {
    it('should list all parcels that have been stored', (done) => {
        let mockedParcel = mock<ParcelInterface>();
        when(mockedParcel.getID()).thenReturn('cool-parcel');
        when(mockedParcel.getWeight()).thenReturn(new Weight(10));
        const mockedParcelInstance = instance(mockedParcel);

        let mockStorage = mock<StorageClient>();
        when(mockStorage.listParcels()).thenReturn(Result.ok([mockedParcelInstance]));
        const mockStorageInstance = instance(mockStorage);
        const restServer = new Server(mockStorageInstance);
    
        supertest.default(restServer.getApp())
            .get('/rest/v1/parcels')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .then(response => {
                expect(response.body).toStrictEqual({ 
                    data: {
                        parcels: 
                        [ 
                            { id: 'cool-parcel', weight: { kg: 10 } } 
                        ]
                     
                }})
                done();
            })
            .catch(error => done(error));
    });
});

describe('GET /rest/v1/parcels', () => {
    it('should return an empty list when no parcels are stored', (done) => {
        let mockStorage = mock<StorageClient>();
        when(mockStorage.listParcels()).thenReturn(Result.ok([]));
        const mockStorageInstance = instance(mockStorage);
        const restServer = new Server(mockStorageInstance);
    
        supertest.default(restServer.getApp())
            .get('/rest/v1/parcels')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .then(response => {
                expect(response.body).toStrictEqual({ 
                    data: {
                        parcels: []
                    } 
                })
                done();
            })
            .catch(error => done(error));
    });
});

describe('GET /rest/v1/parcels/:parcelID', () => {
    it('should return 404 when no parcel can be found', (done) => {
        const parcelID = "cool-parcel";

        let mockStorage = mock<StorageClient>();
        when(mockStorage.getParcel(parcelID)).thenReturn(Result.err(new StorageError(StorageErrorType.NotFound, "not found")));
        const mockStorageInstance = instance(mockStorage);
        const restServer = new Server(mockStorageInstance);
    
        supertest.default(restServer.getApp())
            .get(`/rest/v1/parcels/${parcelID}`)
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

describe('GET /rest/v1/parcels/:parcelID', () => {
    it('should return 200 when parcel can be found', (done) => {
        const parcelID = "cool-parcel";
        let mockedParcel = mock<ParcelInterface>();
        when(mockedParcel.getID()).thenReturn(parcelID);
        when(mockedParcel.getWeight()).thenReturn(new Weight(10));
        const mockedParcelInstance = instance(mockedParcel);

        let mockStorage = mock<StorageClient>();
        when(mockStorage.getParcel(parcelID)).thenReturn(Result.ok(mockedParcelInstance));
        const mockStorageInstance = instance(mockStorage);
        const restServer = new Server(mockStorageInstance);
    
        supertest.default(restServer.getApp())
            .get(`/rest/v1/parcels/${parcelID}`)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .then(response => {
                expect(response.body).toStrictEqual({ 
                    data: {
                        parcel: {
                            id: 'cool-parcel',
                            weight: { kg: 10 }
                        }
                    } 
                })
                done();
            })
            .catch(error => done(error));
    });
});

describe('POST /rest/v1/parcels', () => {
    it('should return 400 when creating parcel with missing info', (done) => {
        let mockStorage = mock<StorageClient>();
        const mockStorageInstance = instance(mockStorage);
        const restServer = new Server(mockStorageInstance);
    
        supertest.default(restServer.getApp())
            .post('/rest/v1/parcels')
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

describe('POST /rest/v1/parcels', () => {
    it('should return 201 when creating a parcel', (done) => {
        const parcelID = "cool-parcel";
        let mockedParcel = mock<ParcelInterface>();
        when(mockedParcel.getID()).thenReturn(parcelID);
        when(mockedParcel.getWeight()).thenReturn(new Weight(10));
        const mockedParcelInstance = instance(mockedParcel);

        let mockStorage = mock<StorageClient>();
        when(mockStorage.addParcels).thenReturn(() => Result.ok([mockedParcelInstance]));
        const mockStorageInstance = instance(mockStorage);
        const restServer = new Server(mockStorageInstance);
    
        supertest.default(restServer.getApp())
            .post('/rest/v1/parcels')
            .set('Accept', 'application/json')
            .send([ { id: 'cool-parcel', weight: { kg: 10 } } ])
            .expect('Content-Type', /json/)
            .expect(201)
            .then(response => {
                expect(response.body).toStrictEqual({ 
                    data: {
                        parcels: [
                            { id: 'cool-parcel', weight: { kg: 10 } }
                        ]
                    }
                })
                done();
            })
            .catch(error => done(error));
    });
});

describe('POST /rest/v1/parcels', () => {
    it('should return 500 when storage handler fails to create parcel', (done) => {
        let mockStorage = mock<StorageClient>();
        when(mockStorage.addParcels).thenReturn(() => Result.err(new StorageError(StorageErrorType.InternalError, "")));
        const mockStorageInstance = instance(mockStorage);
        const restServer = new Server(mockStorageInstance);
    
        supertest.default(restServer.getApp())
            .post('/rest/v1/parcels')
            .set('Accept', 'application/json')
            .send([ { id: 'cool-parcel', weight: { kg: 10 } } ])
            .expect('Content-Type', /json/)
            .expect(500)
            .then(response => {
                expect(response.body).toStrictEqual({ 
                    data: {
                        error: ErrorType.InternalError    
                    }
                })
                done();
            })
            .catch(error => done(error));
    });
});