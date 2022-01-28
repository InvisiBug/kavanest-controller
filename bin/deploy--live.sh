#!/bin/sh

clear && cd helm && \
helm upgrade kavanest-skippy . \
--install \
--namespace kavanest \
-f values/live.yaml
# --create-namespace
