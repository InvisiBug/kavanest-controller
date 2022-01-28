#!/bin/sh

clear && cd helm && \
helm upgrade kavanest-test-skippy . \
--install \
--namespace kavanest-test \
-f values/test.yaml
