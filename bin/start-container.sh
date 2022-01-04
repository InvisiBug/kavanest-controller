#!/bin/sh

# yarn build && docker compose up --build
yarn build && docker compose up -d --build && rm -r dist
