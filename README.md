# AmartOnline
AmartOnline is a demo project designed as simple, practical example of __JSON Web Token (JWT)__ based authentication and 
authorization, based on __Auth0__. While Auth0 supports a wide variety of application frameworks, this demonstration project
is using __NodeJS, Express and Mongo__ for it's __microservice__ APIs and __React__ for its single page application (SPA) client.
All projects in this demonstration have dockerfiles configured and there is a docker-compose script to orchestrate
installing and executing all __Docker__ containers required to run this demonstration.

As this is designed to be a demonstration project to be presented, it is not designed to run in production environments,
nor is it an example of production quality work. It is designed to be ran on a presenters laptop where Docker is
installed.

## Setup

1. After cloning this project and creating your Auth0 authorization tenant, you must edit both the **./AmartOnline/amartonline-ui/src/config.js**
and **./AmartOnline/docker-compose.yml** files and add in your Auth0 client ids, domain, audience(s) and client secrets for
the SPA client and APIs in this demonstration.

2. Next, simple go to a terminal window and from the ./AmartOnline folder, execute the following command: **"docker-compose up"**.

## Bulk Insert Inventory

To help quickly load inventory data for a demonstration, there is a "bulk load" endpoint in the Inventory Api. An example
POST to this endpoint might look like this:

```
curl -X POST http://localhost:5000/api/inventory/bulk 
      -H 'content-type: application/json' 
      -H 'authorization: Bearer <ACCESS-TOKEN-GOES-HERE>' 
      -d '{"inventory": [{"itemId":"1", "description":"Star Wars B-Wing Fighter", "price": "23.49", "quantity":"100"}, 
          {"itemId":"2", "description":"Star Wars X-Wing Fighter", "price": "27.99", "quantity":"49"}, 
          {"itemId":"3", "description":"Star Wars Y-Wing Fighter", "price": "25.49", "quantity":"89"}]}'
```
