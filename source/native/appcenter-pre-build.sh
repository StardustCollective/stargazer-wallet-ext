#!/usr/bin/env bash
#
# For Android/iOS apps, update the contents of the appcenter-config.json/ AppCenter-Config.plist file.
# this is useful when having muliple variations for the app, and need to track each variation independently using dedicated app token which is provided by the ms app center.
#
# DECLARE THE APP_CENTER_TRACKING_JSON ENVIRONMENT VARIABLE IN APP CENTER BUILD CONFIGURATION, SET
# TO THE CONTENTS OF YOUR appcenter-config.json FILE

if [ -z "$APP_CENTER_TRACKING_JSON" ]
then
    echo "You need define the APP_CENTER_TRACKING_JSON variable in App Center"
    exit
fi

if [ -z "$APP_CENTER_CURRENT_PLATFORM" ]
then
    echo "You need define the APP_CENTER_CURRENT_PLATFORM variable in App Center with values android or ios"
    exit
fi

if [ -z "$SENTRY_DATA" ]
then
    echo "You need define the SENTRY_DATA variable in App Center"
    exit
fi

# This is the path to the appcenter-config.json file

if [ "$APP_CENTER_CURRENT_PLATFORM" == "android" ]
then
    CONFIG_FILE="appcenter-config.json"
    APP_CENTER_TRACKING_JSON_FILE=$APPCENTER_SOURCE_DIRECTORY/source/native/android/app/src/main/assets/$CONFIG_FILE
else
    #iOS
    CONFIG_FILE="AppCenter-Config.plist"
    APP_NAME="Stargazer"
    APP_CENTER_TRACKING_JSON_FILE=$APPCENTER_SOURCE_DIRECTORY/source/native/ios/$APP_NAME/$CONFIG_FILE
fi


echo "Updating $CONFIG_FILE"

echo "$APP_CENTER_TRACKING_JSON" > $APP_CENTER_TRACKING_JSON_FILE
sed -i -e 's/\\"/'\"'/g' $APP_CENTER_TRACKING_JSON_FILE

echo "File content:"
cat $APP_CENTER_TRACKING_JSON_FILE


# Creates and adds content to the sentry.properties file

# Navigate to the ios/android root folder
cd $APPCENTER_SOURCE_DIRECTORY/source/native/$APP_CENTER_CURRENT_PLATFORM
# Creates a sentry.properties file
touch sentry.properties
# Generates path to sentry.properties file
SENTRY_PROPERTIES_PATH=$APPCENTER_SOURCE_DIRECTORY/source/native/$APP_CENTER_CURRENT_PLATFORM/sentry.properties
echo "Updating sentry.properties"
# Adds content to the file
echo "$SENTRY_DATA" > $SENTRY_PROPERTIES_PATH
# sed -i -e 's/\\"/'\"'/g' $SENTRY_PROPERTIES_PATH

echo "File content:"
cat $SENTRY_DATA