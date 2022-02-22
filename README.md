# Load-a-truck

A Typescript RESTful HTTP service that allows you to load/unload parcels onto a truck.

## Endpoints

The following endpoints are available:

### PARCELS

#### POST /rest/v1/parcels

This endpoint creates parcels:

```shell
$ curl localhost:8000/rest/v1/parcels -d '[{"id": "world", "weight": {"kg": 100}}]'
{
    "data": {
        "parcels": [
            {"id":"world","weight":{"kg":100}}
        ]
    }
}  
```

#### GET /rest/v1/parcels

This endpoint lists all stored parcels:

```shell 
$ curl localhost:8000/rest/v1/parcels
{
    "data": {
        "parcels": [
            {"id":"world","weight":{"kg":100}}
        ]
    }
}% 
```

#### GET /rest/v1/parcels/:parcelID

This endpoint gets a single parcel:

```shell 
$ curl localhost:8000/rest/v1/parcels
{
    "data": {
        "parcel": {"id":"world","weight":{"kg":100}}
    }
}% 
```

#### DELETE /rest/v1/parcels

This endpoint deletes all stored parcels:

```shell 
$ curl -XDELETE localhost:8000/rest/v1/parcels
{
    "data": {
        "parcels": [
            {"id":"world","weight":{"kg":100}}
        ]
    }
}% 
```

### VEHICLES

#### POST /rest/v1/vehicles

This endpoint creates vehicles:

```shell 
curl localhost:8000/rest/v1/vehicles -d '[{"id": "hello", "weightCapacity": {"kg": 100}, "type": "truck"}]'
{
    "data": {
        "vehicles": [
            {"id":"hello","weightCapacity":{"kg":100},"type":"truck","loadedParcels":[],"currentWeight":{"kg":0}}
        ]
    }
}   
```

#### GET /rest/v1/vehicles

This endpoint lists vehicles:

```shell
$ curl localhost:8000/rest/v1/vehicles
{
    "data": {
        "vehicles": [
            {"id":"hello","weightCapacity":{"kg":100},"type":"truck","currentWeight":{"kg":0},"loadedParcels":[]}
        ]
    }
}      
```

#### GET /rest/v1/vehicles/:vehicleID

This endpoint gets a single vehicle:

```shell
$ curl localhost:8000/rest/v1/vehicles/hello
{
    "data": {
        "vehicle": {"id":"hello","weightCapacity":{"kg":100},"currentWeight":{"kg":0},"type":"truck","loadedParcels":[]}
    }
}
```

#### PUT /rest/v1/vehicles/:vehicleID/parcels/load/:parcelID

This endpoint loads parcels onto a vehicle

```shell
$ curl -XPUT localhost:8000/rest/v1/vehicles/hello/parcels/load/world
{
    "data": {
        "vehicle": {"id":"hello","weightCapacity":{"kg":100},"currentWeight":{"kg":100},"type":"truck","loadedParcels":["world"]}
    }
} 
```

#### PUT /rest/v1/vehicles/:vehicleID/parcels/unload/:parcelID

This endpoint unloads parcels from a vehicle

```shell
curl -XPUT localhost:8000/rest/v1/vehicles/hello/parcels/unload/world
{
    "data": {
        "vehicle":{"id":"hello","weightCapacity":{"kg":100},"currentWeight":{"kg":0},"type":"truck","loadedParcels":[]}
    }
}   
```

#### DELETE /rest/v1/vehicles/:vehicleID

This endpoint deletes all vehicles

```shell
curl -XDELETE localhost:8000/rest/v1/vehicles                     
{
    "data": {
        "vehicles":[{"id":"hello","weightCapacity":{"kg":100},"type":"truck","currentWeight":{"kg":0},"loadedParcels":[]}]
    }
}
```

## Development

In order to use this service you will need the following:

- NVM

Once installed, then run the following commands:

```shell
# this will install the correct node version
nvm install

# this will use your downloaded instance of node 
nvm use

# this will install all required packages
npm i
```

You can then spin up a hot-reloadable instance of the service by running:

```shell
node run develop
```

## Tests

In order to run the available tests, run the following

```shell
npm run test
```