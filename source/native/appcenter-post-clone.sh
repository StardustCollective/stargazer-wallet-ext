#!/usr/bin/env bash

# Create fake yarn lock so appcenter uses Yarn instead of npm install
touch yarn.lock

# Navigate to root directory
cd ../../

# Install root dependencies
yarn install

# Install pods
yarn install:pods