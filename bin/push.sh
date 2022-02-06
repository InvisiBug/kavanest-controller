#!/bin/sh

REGISTRY_IP=192.168.1.61:5000

yarn install && \
yarn build && \
docker build -f ./Dockerfile.kube -t kavanest-skippy . && \
docker tag kavanest-skippy $REGISTRY_IP/kavanest-skippy && \
docker push $REGISTRY_IP/kavanest-skippy && \
rm -r dist
