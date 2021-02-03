#!/usr/bin/env bash

declare -a Images=("hive-node" "assist-restapi-node" "vouch-restapi-node" "didcreds-validator-node")
declare -a Containers=("hive-node" "assist-restapi-node" "vouch-restapi-node" "didcreds-validator-node" "hive-mongo" "tuum-mongo" "vouch-redis")

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
}

function cleanup () {
    stop
    for image in ${Images[@]}
    do
        docker image rm -f tuumtech/${image}:latest
    done
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
    echo "Usage: run.sh {start|stop|cleanup}"
    exit 1
esac