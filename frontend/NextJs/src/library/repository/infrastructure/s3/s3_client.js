import { IRepositoryInstance } from '@/library/repository/infrastructure/interface/repository';
import {
  CompleteMultipartUploadCommand,
  CreateMultipartUploadCommand,
  DeleteObjectCommand,
  GetObjectAttributesCommand,
  GetObjectCommand,
  GetObjectTaggingCommand,
  ListObjectsV2Command,
  ListObjectVersionsCommand,
  PutObjectCommand,
  PutObjectTaggingCommand,
  S3Client,
  UploadPartCommand,
} from '@aws-sdk/client-s3';
import { fromCognitoIdentityPool } from '@aws-sdk/credential-providers';
import log4js from 'log4js';

const logger = log4js.getLogger();
logger.level = 'info';

export class S3Wrapper extends IRepositoryInstance {
  #s3Client;
  #cognitoId = process.env.NEXT_PUBLIC_COGNITO_ID;
  #loginData = {
    [this.#cognitoId]: '',
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
        ServerSideEncryption: 'AES256',
        Tagging: tagging,
      };

      // @ts-ignore
      const command = new PutObjectCommand(input);
      const response = await this.#s3Client.send(command);
      logger.info(`s3 upload success: ${JSON.stringify(response)}`);

      return response;
    } catch (e) {
      if (e instanceof Error) {
        throw new Error(`s3 server error: ${e.message}`);
      } else {
        throw new Error('server error: S3');
      }
    }
  }

  async createMultipartObject({ key: key, tagging: tagging = undefined }) {
    try {
      const input = {
        Bucket: process.env.NEXT_PUBLIC_BUCKET,
        Key: key,
        Tagging: tagging,
      };

      const command = new CreateMultipartUploadCommand(input);
      const response = await this.#s3Client.send(command);
      logger.info(`s3 CreateMultipart success: ${JSON.stringify(response)}`);

      return response;
    } catch (e) {
      if (e instanceof Error) {
        throw new Error(`s3 server error: ${e.message}`);
      } else {
        throw new Error('server error: S3');
      }
    }
  }

  async uploadMultipartObject({
    body: body,
    key: key,
    uploadId: uploadId,
    partNumber: partNumber = 0,
  }) {
    try {
      const input = {
        Body: body,
        Bucket: process.env.NEXT_PUBLIC_BUCKET,
        Key: key,
        UploadId: uploadId,
        PartNumber: partNumber,
      };

      const command = new UploadPartCommand(input);
      const response = await this.#s3Client.send(command);
      logger.info(`s3 uploadMultipart success: ${JSON.stringify(response)}`);

      return response;
    } catch (e) {
      if (e instanceof Error) {
        throw new Error(`s3 server error: ${e.message}`);
      } else {
        throw new Error('server error: S3');
      }
    }
  }

  async multipartUploadObject({ key: key, uploadId: uploadId, parts: parts }) {
    try {
      const input = {
        Bucket: process.env.NEXT_PUBLIC_BUCKET,
        Key: key,
        MultipartUpload: parts,
        UploadId: uploadId,
      };

      const command = new CompleteMultipartUploadCommand(input);
      const response = await this.#s3Client.send(command);
      logger.info(`s3 multipartUpload success: ${JSON.stringify(response)}`);

      return response;
    } catch (e) {
      if (e instanceof Error) {
        throw new Error(`s3 server error: ${e.message}`);
      } else {
        throw new Error('server error: S3');
      }
    }
  }

  async listObjects({
    prefix: prefix = undefined,
    maxKeys: maxKeys = 1000,
    startAfter: startAfter = undefined,
    continuationToken: continuationToken = undefined,
  }) {
    try {
      const input = {
        Bucket: process.env.NEXT_PUBLIC_BUCKET,
        Prefix: prefix,
        MaxKeys: maxKeys,
        StartAfter: startAfter,
        ContinuationToken: continuationToken,
      };

      const command = new ListObjectsV2Command(input);
      const response = await this.#s3Client.send(command);
      logger.info(`s3 ListObjects success: ${JSON.stringify(response)}`);

      return response;
    } catch (e) {
      if (e instanceof Error) {
        throw new Error(`s3 server error: ${e.message}`);
      } else {
        throw new Error('server error: S3');
      }
    }
  }

  async listObjectVersions({
    prefix: prefix = undefined,
    maxKeys: maxKeys = 1000,
    keyMarker: keyMarker = undefined,
    versionIdMarker: versionIdMarker = undefined,
  }) {
    try {
      const input = {
        Bucket: process.env.NEXT_PUBLIC_BUCKET,
        Prefix: prefix,
        MaxKeys: maxKeys,
        KeyMarker: keyMarker,
        VersionIdMarker: versionIdMarker,
      };
      const command = new ListObjectVersionsCommand(input);
      const response = await this.#s3Client.send(command);
      logger.info(`s3 listObjectVersions success: ${JSON.stringify(response)}`);

      return response;
    } catch (e) {
      if (e instanceof Error) {
        throw new Error(`s3 server error: ${e.message}`);
      } else {
        throw new Error('server error: S3');
      }
    }
  }

  async detailObject({ key: key, versionId: versionId = undefined }) {
    try {
      const input = {
        // GetObjectAttributesRequest
        Bucket: process.env.NEXT_PUBLIC_BUCKET,
        Key: key, // required
        VersionId: versionId,
        ObjectAttributes: [
          // ObjectAttributesList // required
          'ETag',
          'Checksum',
          'ObjectParts',
          'StorageClass',
          'ObjectSize',
        ],
      };

      // @ts-ignore
      const command = new GetObjectAttributesCommand(input);
      const response = await this.#s3Client.send(command);
      logger.info(`s3 detailObject success: ${JSON.stringify(response)}`);

      return response;
    } catch (e) {
      if (e instanceof Error) {
        throw new Error(`s3 server error: ${e.message}`);
      } else {
        throw new Error('server error: S3');
      }
    }
  }

  async downloadObject({
    key: key,
    range: range = 'bytes=0-9',
    versionId: versionId = undefined,
  }) {
    try {
      const input = {
        Bucket: process.env.NEXT_PUBLIC_BUCKET,
        Key: key,
        Range: range,
        VersionId: versionId,
      };
      const command = new GetObjectCommand(input);
      const response = await this.#s3Client.send(command);
      logger.info(`s3 downloadObject success: ${JSON.stringify(response)}`);

      return response;
    } catch (e) {
      if (e instanceof Error) {
        throw new Error(`s3 server error: ${e.message}`);
      } else {
        throw new Error('server error: S3');
      }
    }
  }

  async deleteObject({ key: key, versionId: versionId = undefined }) {
    try {
      const input = {
        Bucket: process.env.NEXT_PUBLIC_BUCKET,
        Key: key,
        VersionId: versionId,
      };
      const command = new DeleteObjectCommand(input);
      const response = await this.#s3Client.send(command);
      logger.info(`s3 deleteObject success: ${JSON.stringify(response)}`);

      return response;
    } catch (e) {
      if (e instanceof Error) {
        throw new Error(`s3 server error: ${e.message}`);
      } else {
        throw new Error('server error: S3');
      }
    }
  }

  async objectTagDetail({ key: key, versionId: versionId = undefined }) {
    try {
      const input = {
        Bucket: process.env.NEXT_PUBLIC_BUCKET,
        Key: key,
        VersionId: versionId,
      };
      const command = new GetObjectTaggingCommand(input);
      const response = await this.#s3Client.send(command);
      logger.info(`s3 objectTagDetail success: ${JSON.stringify(response)}`);

      return response;
    } catch (e) {
      if (e instanceof Error) {
        throw new Error(`s3 server error: ${e.message}`);
      } else {
        throw new Error('server error: S3');
      }
    }
  }

  async objectTagUpdate({
    key: key,
    tagSet: tagSet,
    versionId: versionId = undefined,
  }) {
    try {
      const input = {
        Bucket: process.env.NEXT_PUBLIC_BUCKET,
        Key: key,
        VersionId: versionId,
        Tagging: {
          TagSet: tagSet,
        },
      };
      const command = new PutObjectTaggingCommand(input);
      const response = await this.#s3Client.send(command);
      logger.info(`s3 objectTagUpdate success: ${JSON.stringify(response)}`);

      return response;
    } catch (e) {
      if (e instanceof Error) {
        throw new Error(`s3 server error: ${e.message}`);
      } else {
        throw new Error('server error: S3');
      }
    }
  }
}
