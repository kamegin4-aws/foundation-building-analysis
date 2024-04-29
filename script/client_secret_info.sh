#!/bin/bash
### AWS CLI, jq が必要です

User_Poo_ID=$1
CLIENT_ID=$2

if [ -z "$User_Poo_ID" ]; then
  echo "エラー: 引数が必要です。"
  exit 1
fi
if [ -z "$CLIENT_ID" ]; then
  echo "エラー: 引数が必要です。"
  exit 1
fi

aws cognito-idp describe-user-pool-client --user-pool-id $User_Poo_ID --client-id $CLIENT_ID | jq '.UserPoolClient.ClientSecret'
