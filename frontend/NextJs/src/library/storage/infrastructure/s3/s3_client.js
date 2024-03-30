/*
import { S3Client } from "@aws-sdk/client-s3";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-providers";

export class S3Wrapper {
  #s3Client;
  #cognitoId = process.env.NEXT_PUBLIC_COGNITO_ID;
  #loginData = {
    [this.#cognitoId]: "",
  };

  constructor(idToken) {
    this.#loginData[this.#cognitoId] = idToken;

    this.#s3Client = new S3Client({
      region: process.env.NEXT_PUBLIC_REGION,
      credentials: fromCognitoIdentityPool({
        clientConfig: { region: process.env.NEXT_PUBLIC_REGION }, // Configure the underlying CognitoIdentityClient.
        identityPoolId: process.env.NEXT_PUBLIC_IDENTITY_POOL_ID,
        logins: this.#loginData,
      }),
    });
  }

  async uploadFile(file, folder) {
    const fileKey = `${folder}/${file.name}`;
    const params = {
      Bucket: "XXXXXXXXXXXXXX",
      Key: fileKey,
      Body: file,
    };
    await this.s3Client.putObject(params);
    return fileKey;
  }

  async deleteFile(fileKey) {
    const params = {
      Bucket: "XXXXXXXXXXXXXX",
      Key: fileKey,
    };
    await this.s3Client.deleteObject(params);
  }

  async getFile(fileKey) {
    const params = {};
  }
}
*/
