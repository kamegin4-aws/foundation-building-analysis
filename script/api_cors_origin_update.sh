#!/bin/bash
### AWS CLIが必要です

API_ID=$1
RESOURCE_ID=$2
DOMEIN=$3
LOCAL_DOMEIN=${4:-'localhost'}
STATUS_CODE=${5:-200}

if [ -z "$API_ID" ]; then
  echo "エラー: 引数が必要です。"
  exit 1
fi
if [ -z "$RESOURCE_ID" ]; then
  echo "エラー: 引数が必要です。"
  exit 1
fi
if [ -z "$DOMEIN" ]; then
  echo "エラー: 引数が必要です。"
  exit 1
fi

aws apigateway update-integration-response --rest-api-id $API_ID --resource-id $RESOURCE_ID --http-method OPTIONS --status-code $STATUS_CODE --patch-operations op=replace,path=/responseParameters/method.response.header.Access-Control-Allow-Origin,value="'\'https://$DOMEIN\',\'http://$LOCAL_DOMEIN\''"
