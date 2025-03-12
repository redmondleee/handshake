#!/usr/bin/env bash

# http://kvz.io/blog/2013/11/21/bash-best-practices/
set -o errexit
set -o pipefail
set -o nounset
# set -o xtrace

cd api
smithy build
cd build/smithy/source/typescript-client-codegen
yarn
yarn build
cd -
cd ..

cd app
yarn
yarn lint

cd ..

cd service
yarn
cd ..

cd infrastructure
npm install
cdk bootstrap
npm run build
cdk synth --output=dist
cd ..

cd service
yarn build
cd ..
