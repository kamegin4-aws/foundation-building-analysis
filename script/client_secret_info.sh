#!/bin/bash
### AWS CLI, jq が必要です

USER_POOL_ID=$1
CLIENT_ID=$2

if [ -z "$USER_POOL_ID" ]; then
  echo "エラー: 引数が必要です。"
  exit 1
fi
if [ -z "$CLIENT_ID" ]; then
  echo "エラー: 引数が必要です。"
  exit 1
fi

aws cognito-idp describe-user-pool-client --user-pool-id $USER_POOL_ID --client-id $CLIENT_ID | jq '.UserPoolClient.ClientSecret'
