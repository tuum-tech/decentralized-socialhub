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
- [Vouch RestAPI Backend](https://github.com/tuum-tech/vouch-restapi-backend)
- [DIDcreds Validator Service](https://github.com/tuum-tech/didcreds-validator)

## Usage

Clone the repository and run below command on the root of your project.

- `npm i`
- `cp .env.example .env`
- Update .env file with your own IP
- `npm start`

## ALPHA VERSION


Before execute alpha version, you have to:

```
#Run alpha hive scripts

node ./src/scripts/alpha/alpha.scripts.js

```

To generate alpha invite code:

```
#Add invite emails on ./src/scripts/alpha/emails.json

node ./src/scripts/alpha/generateAccessCodes.js

```



