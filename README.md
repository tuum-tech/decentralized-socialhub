# Profile

## Dependencies

- [Install Docker Engine](https://docs.docker.com/engine/install/ubuntu/#installation-methods)
- [Install docker-compose](https://docs.docker.com/compose/install/)
- Install node & npm

Run the following command to ensure all the dependencies are installed and background services are started:

```
# Change to your own SMTP server info on docker/assist-restapi.env and docker/didcreds-validator.env
# Change from 'localhost' to your own IP on docker/didcreds-validator.env
./setup.sh start
```

If you want to clean everything and get latest docker images next time, do:

```
./setup.sh clean
```

The following dependent services are now started:

- [Hive Vault](https://github.com/elastos/Elastos.NET.Hive.Node)
- [Assist RestAPI Backend](https://github.com/tuum-tech/assist-restapi-backend)
- Mongodb container on localhost:37018

## Profile API Service

You need to run Profile API service before you can start Profile app

- [Profile API Service](https://github.com/tuum-tech/profile-api-service)

## Prep the backend
- `yarn`
- `cp .env.example .env`
- `node src/scripts/appvault.scripts.js`
- `node src/scripts/spaces.script.js`
- 
## Run the app
- `npm start`
- Your app should be running at localhost:3000

## Deploy to production
