#!/bin/sh

REGISTRY_IP=192.168.1.61:5000

yarn install && \
yarn build && \
docker build -f ./Dockerfile.kube -t kavanest-skippy . && \
docker tag kavanest-skippy:live $REGISTRY_IP/kavanest-skippy:live && \
docker push $REGISTRY_IP/kavanest-skippy && \
rm -r dist
