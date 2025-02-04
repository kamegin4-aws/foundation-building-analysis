#!/bin/bash
### AWS CLIが必要です

API_ID=$1
RESOURCE_ID=$2
HOST_DOMAIN=$3
APP_DOMAIN=$4
STATUS_CODE=${5:-200}

if [ -z "$API_ID" ]; then
  echo "エラー: 引数が必要です。"
  exit 1
fi
if [ -z "$RESOURCE_ID" ]; then
  echo "エラー: 引数が必要です。"
  exit 1
fi
if [ -z "$HOST_DOMAIN" ]; then
  echo "エラー: 引数が必要です。"
  exit 1
fi
if [ -z "$APP_DOMAIN" ]; then
  echo "エラー: 引数が必要です。"
  exit 1
fi

aws apigateway update-integration-response --rest-api-id $API_ID --resource-id $RESOURCE_ID --http-method OPTIONS --status-code $STATUS_CODE --patch-operations op=replace,path=/responseParameters/method.response.header.Access-Control-Allow-Origin,value="'\'https://$HOST_DOMAIN\',\'http://$APP_DOMAIN\''"
