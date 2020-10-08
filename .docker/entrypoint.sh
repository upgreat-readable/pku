#!/bin/bash
set -e

if [[ ! -z "$1" ]]; then
    echo ${*}
    exec  ${*}
else
    exec node -v
fi