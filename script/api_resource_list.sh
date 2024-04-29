#!/bin/bash

### AWS CLI, jq が必要です

API_ID=$1

if [ -z "$API_ID" ]; then
  echo "エラー: 引数が必要です。"
  exit 1
fi

aws apigateway get-resources --rest-api-id $API_ID | jq '.items[].id'
