import logger from '@/library/logging/logger';
import { Service_Name } from '@/library/repository/constant/repository';
import { IRepository } from '@/library/repository/interface/repository';

export class ObjectData extends IRepository {
  #repositoryInstance;

  constructor({ repositoryInstance }) {
    super();
    this.#repositoryInstance = repositoryInstance;
  }

  async upload({
    userId,
    metaKey,
    metaValue,
    mimeType,
    fileName,
    body,
    comment = undefined,
  }) {
    try {
      const uploadObject = await this.#repositoryInstance.uploadObject({
        body: body,
        key: `userId=${userId}/metaKey=${metaKey}/metaValue=${metaValue}/mimeType=${mimeType}/${fileName}`,
        tagging: comment ? `comment=${comment}` : undefined,
      });

      return this.#repositoryInstance.toEntity({
        serviceName: Service_Name[0],
        response1: uploadObject,
        type: 'upload',
      });
    } catch (e) {
      if (e instanceof Error) {
        throw new Error(`server error: ${e.message}`);
      } else {
        throw new Error('server error');
      }
    }
  }

  async multipartUpload({
    userId,
    metaKey,
    metaValue,
    mimeType,
    fileName,
    body,
    comment = undefined,
  }) {
    try {
      const createMultipartObject =
        await this.#repositoryInstance.createMultipartObject({
          key: `userId=${userId}/metaKey=${metaKey}/metaValue=${metaValue}/mimeType=${mimeType}/${fileName}`,
          tagging: comment ? `comment=${comment}` : undefined,
        });

      const uploadId = createMultipartObject.UploadId;

      // Multipart uploads require a minimum size of 5 MB per part.
      const partSize = 500 * 1024 * 1024;
      const parts = [];

      for (
        let partNumber = 0;
        partNumber < Math.ceil(body.size / partSize);
        partNumber++
      ) {
        const start = partNumber * partSize;
        const end = Math.min(start + partSize, body.size);
        const blob = body.slice(start, end);

        const uploadMultipartObject =
          await this.#repositoryInstance.uploadMultipartObject({
            body: blob,
            key: `userId=${userId}/metaKey=${metaKey}/metaValue=${metaValue}/mimeType=${mimeType}/${fileName}`,
            uploadId: uploadId,
            partNumber: partNumber + 1,
          });
        parts.push({
          ETag: uploadMultipartObject.ETag,
          PartNumber: partNumber + 1,
        });
      }

      const multipartUploadObject =
        await this.#repositoryInstance.multipartUploadObject({
          key: `userId=${userId}/metaKey=${metaKey}/metaValue=${metaValue}/mimeType=${mimeType}/${fileName}`,
          uploadId: uploadId,
          parts: {
            Parts: parts,
          },
        });

      return this.#repositoryInstance.toEntity({
        serviceName: Service_Name[0],
        response1: multipartUploadObject,
        type: 'multiUpload',
      });
    } catch (e) {
      if (e instanceof Error) {
        throw new Error(`server error: ${e.message}`);
      } else {
        throw new Error('server error');
      }
    }
  }

  async list({
    limit = 20,
    offset = 0,
    orderBy = 'updatedAt',
    searchValue = undefined,
    userId = undefined,
    metaKey = undefined,
  }) {
    try {
      let prefix = '';
      if (userId) prefix += `userId=${userId}/`;
      if (metaKey) prefix += `metaKey=${metaKey}/`;

      let listObjects = await this.#repositoryInstance.listObjects({
        prefix: prefix ? prefix : undefined,
        maxKeys: limit,
      });

      let filtered = this.filterObjects({
        objects: listObjects.Contents,
        limit: limit,
        offset: offset,
        search: searchValue,
      });

      while (filtered.offset > 0 && listObjects.IsTruncated) {
        filtered.offset -= limit;
        if (filtered.offset < 0) limit += filtered.offset;

        listObjects = await this.#repositoryInstance.listObjects({
          prefix: listObjects.Prefix,
          maxKeys: limit,
          continuationToken: listObjects.NextContinuationToken,
        });

        //結果を追加
        if (listObjects.Contents) {
          const nextFiltered = this.filterObjects({
            objects: listObjects.Contents,
            limit: limit,
            offset: filtered.offset,
            search: searchValue,
          });
          if (nextFiltered.filteredObjects) {
            filtered.filteredObjects = filtered.filteredObjects.concat(
              nextFiltered.filteredObjects
            );
            filtered.offset = nextFiltered.offset;
          }
        }
      }

      //Offsetを適用
      if (offset > 0) {
        filtered.filteredObjects = filtered.filteredObjects.slice(offset);
      }

      filtered.filteredObjects = this.orderByObjects({
        objects: filtered.filteredObjects,
        orderBy: orderBy,
      });

      listObjects.Contents = filtered.filteredObjects;

      return this.#repositoryInstance.toEntity({
        serviceName: Service_Name[0],
        response1: listObjects,
        type: 'list',
      });
    } catch (e) {
      if (e instanceof Error) {
        throw new Error(`server error: ${e.message}`);
      } else {
        throw new Error('server error');
      }
    }
  }

  filterObjects({ objects, search, limit, offset }) {
    let filteredObjects = [];
    //Searchを適用
    if (search) {
      filteredObjects = objects.filter((obj) => {
        return obj.Key?.includes(search);
      });
    }

    if (filteredObjects) {
      //絞られた分だけ追加検索
      if (limit - filteredObjects.length) {
        offset += limit - filteredObjects.length;
      }
    }

    return {
      filteredObjects: filteredObjects,
      offset: offset,
    };
  }

  orderByObjects({ objects, orderBy }) {
    //OrderByを適用
    if (orderBy) {
      //orderByが-から始まる場合
      if (orderBy.startsWith('-')) {
        orderBy = orderBy.slice(1);
        if (orderBy === 'updatedAt') {
          objects.sort((a, b) => {
            if (a.LastModified && b.LastModified) {
              return -(
                new Date(a.LastModified).getTime() -
                new Date(b.LastModified).getTime()
              );
            } else if (a.LastModified) {
              return -1;
            } else if (b.LastModified) {
              return 1;
            } else {
              return 0;
            }
          });
        } else if (orderBy === 'key') {
          objects.sort((a, b) => {
            if (a.Key && b.Key) {
              return -a.Key.localeCompare(b.Key);
            } else if (a.Key) {
              return -1;
            } else if (b.Key) {
              return 1;
            } else {
              return 0;
            }
          });
        }
      }
      if (orderBy === 'updatedAt') {
        objects.sort((a, b) => {
          if (a.LastModified && b.LastModified) {
            return (
              new Date(a.LastModified).getTime() -
              new Date(b.LastModified).getTime()
            );
          } else if (a.LastModified) {
            return 1;
          } else if (b.LastModified) {
            return -1;
          } else {
            return 0;
          }
        });
      } else if (orderBy === 'key') {
        objects.sort((a, b) => {
          if (a.Key && b.Key) {
            return a.Key.localeCompare(b.Key);
          } else if (a.Key) {
            return 1;
          } else if (b.Key) {
            return -1;
          } else {
            return 0;
          }
        });
      }
    }

    return objects;
  }

  async listVersions({ userId, metaKey, metaValue, mimeType, fileName }) {
    try {
      let listObjectVersions =
        await this.#repositoryInstance.listObjectVersions({
          prefix: `userId=${userId}/metaKey=${metaKey}/metaValue=${metaValue}/mimeType=${mimeType}/${fileName}`,
        });

      let versions = listObjectVersions.Versions;

      while (listObjectVersions.IsTruncated) {
        listObjectVersions = await this.#repositoryInstance.listObjectVersions({
          prefix: `userId=${userId}/metaKey=${metaKey}/metaValue=${metaValue}/mimeType=${mimeType}/${fileName}`,
          keyMarker: listObjectVersions.NextKeyMarker,
          versionIdMarker: listObjectVersions.NextVersionIdMarker,
        });

        //結果を追加
        if (listObjectVersions.Versions) {
          versions = versions.concat(listObjectVersions.Versions);
        }
      }

      listObjectVersions.Versions = versions;

      return this.#repositoryInstance.toEntity({
        serviceName: Service_Name[0],
        response1: listObjectVersions,
        type: 'listVersions',
      });
    } catch (e) {
      if (e instanceof Error) {
        throw new Error(`server error: ${e.message}`);
      } else {
        throw new Error('server error');
      }
    }
  }

  async detail({ userId, metaKey, metaValue, mimeType, fileName, versionId }) {
    try {
      const key = `userId=${userId}/metaKey=${metaKey}/metaValue=${metaValue}/mimeType=${mimeType}/${fileName}`;

      const detailObject = await this.#repositoryInstance.detailObject({
        key: key,
        versionId: versionId,
      });

      const objectTagDetail = await this.#repositoryInstance.objectTagDetail({
        key: key,
        versionId: versionId,
      });

      return this.#repositoryInstance.toEntity({
        serviceName: Service_Name[0],
        response1: detailObject,
        type: 'detail',
        response2: objectTagDetail,
        key: key,
      });
    } catch (e) {
      if (e instanceof Error) {
        throw new Error(`server error: ${e.message}`);
      } else {
        throw new Error('server error');
      }
    }
  }

  async commentUpdate({
    userId,
    metaKey,
    metaValue,
    mimeType,
    fileName,
    versionId,
    comment,
  }) {
    try {
      const tagSet = [
        {
          Key: 'comment',
          Value: comment,
        },
      ];

      const objectTagUpdate = await this.#repositoryInstance.objectTagUpdate({
        key: `userId=${userId}/metaKey=${metaKey}/metaValue=${metaValue}/mimeType=${mimeType}/${fileName}`,
        tagSet: tagSet,
        versionId: versionId,
      });

      return this.#repositoryInstance.toEntity({
        serviceName: Service_Name[0],
        response1: objectTagUpdate,
        type: 'tagUpdate',
      });
    } catch (e) {
      if (e instanceof Error) {
        throw new Error(`server error: ${e.message}`);
      } else {
        throw new Error('server error');
      }
    }
  }

  async delete({ userId, metaKey, metaValue, mimeType, fileName, versionId }) {
    try {
      const deleteObject = await this.#repositoryInstance.deleteObject({
        key: `userId=${userId}/metaKey=${metaKey}/metaValue=${metaValue}/mimeType=${mimeType}/${fileName}`,
        versionId: versionId,
      });

      return this.#repositoryInstance.toEntity({
        serviceName: Service_Name[0],
        response1: deleteObject,
        type: 'delete',
      });
    } catch (e) {
      if (e instanceof Error) {
        throw new Error(`server error: ${e.message}`);
      } else {
        throw new Error('server error');
      }
    }
  }

  async permanentlyDelete({ userId, metaKey, metaValue, mimeType, fileName }) {
    try {
      let listObjectVersions =
        await this.#repositoryInstance.listObjectVersions({
          prefix: `userId=${userId}/metaKey=${metaKey}/metaValue=${metaValue}/mimeType=${mimeType}/${fileName}`,
        });

      let versions = listObjectVersions.Versions;

      while (listObjectVersions.IsTruncated) {
        listObjectVersions = await this.#repositoryInstance.listObjectVersions({
          prefix: `userId=${userId}/metaKey=${metaKey}/metaValue=${metaValue}/mimeType=${mimeType}/${fileName}`,
          keyMarker: listObjectVersions.NextKeyMarker,
          versionIdMarker: listObjectVersions.NextVersionIdMarker,
        });

        //結果を追加
        if (listObjectVersions.Versions) {
          versions = versions.concat(listObjectVersions.Versions);
        }
      }

      let promiseFuncs = [];

      for (let version of versions) {
        promiseFuncs.push(
          this.#repositoryInstance.deleteObject({
            key: version.Key,
            versionId: version.VersionId,
          })
        );
      }

      const response = await Promise.all(promiseFuncs)
        .then((responses) => {
          logger.info(`Success permanentlyDelete`);
          return true;
        })
        .catch((error) => {
          logger.error(`Failed permanentlyDelete: ${error.message}`);
          return false;
        });

      return response;
    } catch (e) {
      if (e instanceof Error) {
        throw new Error(`server error: ${e.message}`);
      } else {
        throw new Error('server error');
      }
    }
  }
}
