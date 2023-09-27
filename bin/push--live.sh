#!/bin/sh

REGISTRY_IP=kavanet.io:5000
APP_NAME=kavanest-skippy:live

yarn install && \
yarn build && \
docker build -f ./Dockerfile.kube -t $APP_NAME .
docker tag $APP_NAME $REGISTRY_IP/$APP_NAME && \
docker push $REGISTRY_IP/$APP_NAME && \
rm -r dist
