#!/usr/bin/env bash

if [ -z "$APP_CENTER_CURRENT_PLATFORM" ]
then
    echo "You need define the APP_CENTER_CURRENT_PLATFORM variable in App Center with values android or ios"
    exit
fi

# Create fake yarn lock so appcenter uses Yarn instead of npm install
touch yarn.lock

# Navigate to root directory
cd ../../

# Install root dependencies
yarn install

if [ "$APP_CENTER_CURRENT_PLATFORM" == "ios" ]
then
    # Install pods
    yarn install:pods
fi