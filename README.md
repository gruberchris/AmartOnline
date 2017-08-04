# AmartOnline
AmartOnline is a demo project designed as simple, practical example of JSON Web Token (JWT) based authentication and 
authorization, based on Auth0. While Auth0 supports a wide variety of application frameworks, this demonstration project
is using NodeJS, Express and Mongo for it's microservice APIs and React for its single page application (SPA) client.
All projects in this demonstration have dockerfiles configured and there is a docker-compose script to orchestrate
installing and executing all docker containers required to run this demonstration.

As this is designed to be a demonstration project to be presented, it is not designed to run in production environments,
nor is it an example of production quality work. It is designed to be ran on a presenters laptop where Docker is
installed.

## Setup

1. After cloning this project and creating your Auth0 authorization tenant, you must edit both the **./AmartOnline/amartonline-ui/src/config.js**
and **./AmartOnline/docker-compose.yml** files and add in your Auth0 client ids, domain, audience(s) and client secrets for
the SPA client and APIs in this demonstration.

2. Next, simple go to a terminal window and from the ./AmartOnline folder, execute the following command: **"docker-compose up"**.
