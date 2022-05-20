#!/usr/bin/env bash

declare -a Images=("hive-node:v2.5.1" "assist-restapi-node:latest")
declare -a Containers=("hive-node" "assist-restapi-node" "restapi-mongo" "matrix-synapse-node" "synapse-postgres")

function stop () {
    for container in ${Containers[@]}
    do
        container_id=$(docker container ls -a | grep ${container} | awk '{print $1}')
        if [ -n "$container_id" ]
        then
            docker container rm -f ${container_id}
        fi
    done
}

function start () {
    stop
    docker-compose -f docker/docker-compose.yml up --remove-orphans --force-recreate -d 
    sudo mkdir -p ${HOME}/.profile-data/matrix-synapse-data && sudo chown -R 991:991 ${HOME}/.profile-data/matrix-synapse-data/
    docker container exec -it matrix-synapse-node register_new_matrix_user http://localhost:8008 -u profile -p password  -a -c /data/homeserver.yaml > /dev/null 2>&1
}

function cleanup () {
    stop
    for image in ${Images[@]}
    do
        docker image rm -f tuumtech/${image}
    done
    sudo rm -rf ${HOME}/.profile-data
}

case "$1" in
    start)
        start
        ;;
    stop)
        stop
        ;;
    cleanup)
        cleanup
        ;;
    *)
    echo "Usage: setup.sh {start|stop|cleanup}"
    exit 1
esac
