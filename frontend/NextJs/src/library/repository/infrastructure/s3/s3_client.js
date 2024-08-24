import logger from '@/library/logging/logger';
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
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export class S3Wrapper extends IRepositoryInstance {
  #s3Client;
  #cognitoId = process.env.NEXT_PUBLIC_COGNITO_ID;
  #loginData = {
    [this.#cognitoId]: '',
  };

  constructor({ idToken }) {
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

  async uploadObject({ body, key, tagging = undefined }) {
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
        throw new Error('s3 server error');
      }
    }
  }

  async createMultipartObject({ key, tagging = undefined }) {
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
        throw new Error('s3 server error');
      }
    }
  }

  async uploadMultipartObject({ body, key, uploadId, partNumber = 0 }) {
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
        throw new Error('s3 server error');
      }
    }
  }

  async multipartUploadObject({ key, uploadId, parts }) {
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
        throw new Error('s3 server error');
      }
    }
  }

  async listObjects({
    maxKeys = 1000,
    prefix = undefined,
    startAfter = undefined,
    continuationToken = undefined,
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
        throw new Error('s3 server error');
      }
    }
  }

  async listObjectVersions({
    maxKeys = 1000,
    prefix = undefined,
    keyMarker = undefined,
    versionIdMarker = undefined,
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
        throw new Error('s3 server error');
      }
    }
  }

  async detailObject({ key, versionId = undefined }) {
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
        throw new Error('s3 server error');
      }
    }
  }

  async downloadObject({ key, range = 'bytes=0-9', versionId = undefined }) {
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
        throw new Error('s3 server error');
      }
    }
  }

  async signedURL({ key, versionId = undefined, range = undefined }) {
    try {
      const input = {
        Bucket: process.env.NEXT_PUBLIC_BUCKET,
        Key: key,
        VersionId: versionId,
        Range: range,
      };
      const command = new GetObjectCommand(input);

      const url = await getSignedUrl(this.#s3Client, command, {
        expiresIn: 3600,
      });

      return url;
    } catch (e) {
      if (e instanceof Error) {
        throw new Error(`s3 server error: ${e.message}`);
      } else {
        throw new Error('s3 server error');
      }
    }
  }

  async deleteObject({ key, versionId = undefined }) {
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
        throw new Error('s3 server error');
      }
    }
  }

  async objectTagDetail({ key, versionId = undefined }) {
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
        throw new Error('s3 server error');
      }
    }
  }

  async objectTagUpdate({ key, tagSet, versionId = undefined }) {
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
        throw new Error('s3 server error');
      }
    }
  }
}
