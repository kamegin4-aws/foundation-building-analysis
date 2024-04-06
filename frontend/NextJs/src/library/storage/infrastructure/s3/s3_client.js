import {
  DeleteObjectCommand,
  GetObjectAttributesCommand,
  GetObjectCommand,
  ListObjectsV2Command,
  ListObjectVersionsCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-providers";
import { IStorageInstance } from "@/library/storage/infrastructure/interface/storage";

export class S3Wrapper extends IStorageInstance {
  #s3Client;
  #cognitoId = process.env.NEXT_PUBLIC_COGNITO_ID;
  #loginData = {
    [this.#cognitoId]: "",
  };

  constructor({ idToken: idToken }) {
    super();
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

  async uploadObject({ body: body, key: key, tagging: tagging = undefined }) {
    try {
      const input = {
        Body: body,
        Bucket: process.env.NEXT_PUBLIC_BUCKET,
        Key: key,
        ServerSideEncryption: "AES256",
        Tagging: tagging,
      };

      // @ts-ignore
      const command = new PutObjectCommand(input);
      const response = await this.#s3Client.send(command);
      return response;
    } catch (e) {
      if (e instanceof Error) {
        throw new Error(`s3 server error: ${e.message}`);
      } else {
        throw new Error("server error: S3");
      }
    }
  }

  async listObjects({
    prefix: prefix = "",
    maxKeys: maxKeys = 1000,
    startAfter: startAfter = undefined,
  }) {
    try {
      const input = {
        Bucket: process.env.NEXT_PUBLIC_BUCKET,
        Prefix: prefix,
        MaxKeys: maxKeys,
        StartAfter: startAfter,
      };

      const command = new ListObjectsV2Command(input);
      const response = await this.#s3Client.send(command);
      return response;
    } catch (e) {
      if (e instanceof Error) {
        throw new Error(`s3 server error: ${e.message}`);
      } else {
        throw new Error("server error: S3");
      }
    }
  }

  async listObjectVersions({ prefix: prefix = "", maxKeys: maxKeys = 1000 }) {
    try {
      const input = {
        Bucket: process.env.NEXT_PUBLIC_BUCKET,
        Prefix: prefix,
        MaxKeys: maxKeys,
      };
      const command = new ListObjectVersionsCommand(input);
      const response = await this.#s3Client.send(command);
      return response;
    } catch (e) {
      if (e instanceof Error) {
        throw new Error(`s3 server error: ${e.message}`);
      } else {
        throw new Error("server error: S3");
      }
    }
  }

  async infoObject({ key: key = "", versionId: versionId = undefined }) {
    try {
      const input = {
        // GetObjectAttributesRequest
        Bucket: process.env.NEXT_PUBLIC_BUCKET,
        Key: key, // required
        VersionId: versionId,
        ObjectAttributes: [
          // ObjectAttributesList // required
          "ETag",
          "Checksum",
          "ObjectParts",
          "StorageClass",
          "ObjectSize",
        ],
      };
      // @ts-ignore
      const command = new GetObjectAttributesCommand(input);
      const response = await this.#s3Client.send(command);
      return response;
    } catch (e) {
      if (e instanceof Error) {
        throw new Error(`s3 server error: ${e.message}`);
      } else {
        throw new Error("server error: S3");
      }
    }
  }

  async downloadObject({ key: key = "", versionId: versionId = undefined }) {
    try {
      const input = {
        Bucket: process.env.NEXT_PUBLIC_BUCKET,
        Key: key,
        VersionId: versionId,
      };
      const command = new GetObjectCommand(input);
      const response = await this.#s3Client.send(command);
      return response;
    } catch (e) {
      if (e instanceof Error) {
        throw new Error(`s3 server error: ${e.message}`);
      } else {
        throw new Error("server error: S3");
      }
    }
  }

  async deleteObject({ key: key = "", versionId: versionId = undefined }) {
    try {
      const input = {
        Bucket: process.env.NEXT_PUBLIC_BUCKET,
        Key: key,
        VersionId: versionId,
      };
      const command = new DeleteObjectCommand(input);
      await this.#s3Client.send(command);
      return true;
    } catch (e) {
      if (e instanceof Error) {
        throw new Error(`s3 server error: ${e.message}`);
      } else {
        throw new Error("server error: S3");
      }
    }
  }
}
