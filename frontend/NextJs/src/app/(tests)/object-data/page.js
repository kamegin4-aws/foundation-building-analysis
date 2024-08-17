'use client';

import logger from '@/library/logging/logger';
import { S3Wrapper } from '@/library/repository/infrastructure/s3/s3_client';
import { ObjectData } from '@/library/repository/objectData/repository';
import {
  Button,
  Container,
  FileUpload,
  Form,
  FormField,
  Header,
  SpaceBetween,
} from '@cloudscape-design/components';
import React, { useEffect, useState } from 'react';

export default function FileUploadWrapper() {
  const [value, setValue] = useState([]);
  const [objectData, setObjectData] = useState(undefined);

  const uploadOnClick = async (event) => {
    event.preventDefault();
    logger.info(event.detail);

    try {
      const file = value[0];
      if (objectData) {
        logger.info(
          `input: ${JSON.stringify({
            userId: 'userId',
            metaKey: 'metaKey',
            metaValue: 'metaValue',
            mimeType: 'mimeType',
            fileName: file.name,
            comment: 'comment',
            body: file,
          })}`
        );

        const result = await objectData.upload({
          userId: 'userId',
          metaKey: 'metaKey',
          metaValue: 'metaValue',
          mimeType: 'mimeType',
          fileName: file.name,
          comment: 'comment',
          body: file,
        });

        logger.info(`Image uploaded successfully: ${JSON.stringify(result)}`);
      }
    } catch (e) {
      if (e instanceof Error) {
        logger.error(e.message);
      } else {
        logger.error('エラー');
      }
    } finally {
      logger.info('Image upload finished');
    }
  };

  const multiUploadOnClick = async (event) => {
    event.preventDefault();
    logger.info(event.detail);
    try {
      if (objectData) {
        const file = value[0];
        logger.info(
          `input: ${JSON.stringify({
            userId: 'userId',
            metaKey: 'metaKey',
            metaValue: 'metaValue',
            mimeType: 'mimeType',
            fileName: file.name,
            comment: 'comment',
            body: file,
          })}`
        );
        const result = await objectData.multipartUpload({
          userId: 'userId',
          metaKey: 'metaKey',
          metaValue: 'metaValue',
          mimeType: 'mimeType',
          fileName: file.name,
          comment: 'comment',
          body: file,
        });

        logger.info(`multipartUpload successfully: ${JSON.stringify(result)}`);
      }
    } catch (e) {
      if (e instanceof Error) {
        logger.error(e.message);
      } else {
        logger.error('エラー');
      }
    } finally {
      logger.info('multipartUpload finished');
    }
  };

  const listOnClick = async (event) => {
    event.preventDefault();
    logger.info(event.detail);
    try {
      if (objectData) {
        logger.info(
          `input: ${JSON.stringify({
            userId: 'userId',
            metaKey: 'metaKey',
            limit: 3,
            offset: 1,
            searchValue: 'metaValue',
            orderBy: 'updatedAt',
          })}`
        );
        const result = await objectData.list({
          userId: 'userId',
          metaKey: 'metaKey',
          limit: 3,
          offset: 1,
          searchValue: 'metaValue',
          orderBy: 'updatedAt',
        });

        logger.info(`List successfully: ${JSON.stringify(result)}`);
      }
    } catch (e) {
      if (e instanceof Error) {
        logger.error(e.message);
      } else {
        logger.error('エラー');
      }
    } finally {
      logger.info('List finished');
    }
  };

  const detailOnClick = async (event) => {
    event.preventDefault();
    logger.info(event.detail);
    try {
      if (objectData) {
        const file = value[0];
        logger.info(
          `input: ${JSON.stringify({
            userId: 'userId',
            metaKey: 'metaKey',
            metaValue: 'metaValue',
            mimeType: 'mimeType',
            fileName: file.name,
          })}`
        );
        const result = await objectData.detail({
          userId: 'userId',
          metaKey: 'metaKey',
          metaValue: 'metaValue',
          mimeType: 'mimeType',
          fileName: file.name,
        });

        logger.info(`Detail successfully: ${JSON.stringify(result)}`);
      }
    } catch (e) {
      if (e instanceof Error) {
        logger.error(e.message);
      } else {
        logger.error('エラー');
      }
    } finally {
      logger.info('Detail finished');
    }
  };

  const versionListOnClick = async (event) => {
    event.preventDefault();
    logger.info(event.detail);
    try {
      if (objectData) {
        const file = value[0];
        logger.info(
          `input: ${JSON.stringify({
            userId: 'userId',
            metaKey: 'metaKey',
            metaValue: 'metaValue',
            mimeType: 'mimeType',
            fileName: file.name,
          })}`
        );
        const result = await objectData.listVersions({
          userId: 'userId',
          metaKey: 'metaKey',
          metaValue: 'metaValue',
          mimeType: 'mimeType',
          fileName: file.name,
        });

        logger.info(`Version list successfully: ${JSON.stringify(result)}`);
      }
    } catch (e) {
      if (e instanceof Error) {
        logger.error(e.message);
      } else {
        logger.error('エラー');
      }
    } finally {
      logger.info('Version list finished');
    }
  };

  const commentUpdateOnClick = async (event) => {
    event.preventDefault();
    logger.info(event.detail);

    try {
      if (objectData) {
        const file = value[0];
        logger.info(
          `input: ${JSON.stringify({
            userId: 'userId',
            metaKey: 'metaKey',
            metaValue: 'metaValue',
            mimeType: 'mimeType',
            fileName: file.name,
            comment: 'commentUpdate',
          })}`
        );
        const result = await objectData.commentUpdate({
          userId: 'userId',
          metaKey: 'metaKey',
          metaValue: 'metaValue',
          mimeType: 'mimeType',
          fileName: file.name,
          comment: 'commentUpdate',
        });

        logger.info(`commentUpdate successfully: ${JSON.stringify(result)}`);
      }
    } catch (e) {
      if (e instanceof Error) {
        logger.error(e.message);
      } else {
        logger.error('エラー');
      }
    } finally {
      logger.info('commentUpdate finished');
    }
  };

  const deleteOnClick = async (event) => {
    event.preventDefault();
    logger.info(event.detail);
    try {
      if (objectData) {
        const file = value[0];
        logger.info(
          `input: ${JSON.stringify({
            userId: 'userId',
            metaKey: 'metaKey',
            metaValue: 'metaValue',
            mimeType: 'mimeType',
            fileName: file.name,
          })}`
        );
        const result = await objectData.delete({
          userId: 'userId',
          metaKey: 'metaKey',
          metaValue: 'metaValue',
          mimeType: 'mimeType',
          fileName: file.name,
        });

        logger.info(`Delete successfully: ${JSON.stringify(result)}`);
      }
    } catch (e) {
      if (e instanceof Error) {
        logger.error(e.message);
      } else {
        logger.error('エラー');
      }
    } finally {
      logger.info('Delete finished');
    }
  };

  const permanentlyDeleteOnClick = async (event) => {
    event.preventDefault();
    logger.info(event.detail);

    try {
      if (objectData) {
        const file = value[0];
        logger.info(
          `input: ${JSON.stringify({
            userId: 'userId',
            metaKey: 'metaKey',
            metaValue: 'metaValue',
            mimeType: 'mimeType',
            fileName: file.name,
          })}`
        );
        const result = await objectData.permanentlyDelete({
          userId: 'userId',
          metaKey: 'metaKey',
          metaValue: 'metaValue',
          mimeType: 'mimeType',
          fileName: file.name,
        });

        logger.info(
          `Permanently delete successfully: ${JSON.stringify(result)}`
        );
      }
    } catch (e) {
      if (e instanceof Error) {
        logger.error(e.message);
      } else {
        logger.error('エラー');
      }
    } finally {
      logger.info('Permanently delete finished');
    }
  };

  useEffect(() => {
    const url = `${process.env.NEXT_PUBLIC_BASE_PATH}/api/user/sign-in`;
    const options = {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Key': process.env.NEXT_PUBLIC_USER_API_KEY,
      },
      body: JSON.stringify({
        user_name: process.env.NEXT_PUBLIC_USER_NAME,
        password: process.env.NEXT_PUBLIC_PASSWORD,
      }),
    };

    // @ts-ignore
    fetch(url, options)
      .then((response) => {
        if (response.ok) {
          response
            .json()
            .then((data) => {
              logger.info(`success for login: ${JSON.stringify(data)}`);

              setObjectData(
                new ObjectData({
                  repositoryInstance: new S3Wrapper({
                    idToken: data.id_token,
                  }),
                })
              );
            })
            .catch((error) => {
              logger.error(`error for login: ${error.message}`);
            });
        } else {
          throw new Error('Network response was not ok.');
        }
      })
      .catch((error) => {
        logger.error(`error for login: ${error.message}`);
      });
  }, []);

  if (objectData == undefined) {
    return (
      <div>
        <p>AWS sign-in中...</p>
      </div>
    );
  }

  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <Form
        actions={
          <SpaceBetween direction="horizontal" size="xs">
            <Button
              onClick={uploadOnClick}
              iconName={'upload'}
              iconAlt={'アップロード'}
            >
              アップロード
            </Button>
            <Button
              onClick={multiUploadOnClick}
              iconName={'upload'}
              iconAlt={'マルチパートアップロード'}
            >
              マルチパートアップロード
            </Button>
            <Button
              onClick={listOnClick}
              iconName={'folder'}
              iconAlt={'リスト'}
            >
              リスト
            </Button>
            <Button onClick={detailOnClick} iconName={'file'} iconAlt={'詳細'}>
              詳細
            </Button>
            <Button
              onClick={versionListOnClick}
              iconName={'copy'}
              iconAlt={'バージョンリスト'}
            >
              バージョンリスト
            </Button>
            <Button
              onClick={commentUpdateOnClick}
              iconName={'edit'}
              iconAlt={'コメント更新'}
            >
              コメント更新
            </Button>
            <Button
              onClick={deleteOnClick}
              iconName={'delete-marker'}
              iconAlt={'削除'}
            >
              削除
            </Button>
            <Button
              onClick={permanentlyDeleteOnClick}
              iconName={'remove'}
              iconAlt={'完全削除'}
            >
              完全削除
            </Button>
          </SpaceBetween>
        }
        header={<Header variant="h1">Form header</Header>}
      >
        <Container header={<Header variant="h2">Form container header</Header>}>
          <SpaceBetween direction="vertical" size="l">
            <FormField label={'Image Data'} description={'Image Data'}>
              <FileUpload
                onChange={({ detail }) => {
                  setValue(detail.value);
                }}
                value={value}
                accept={undefined}
                i18nStrings={{
                  uploadButtonText: (e) => (e ? 'Choose files' : 'Choose file'),
                  dropzoneText: (e) =>
                    e ? 'Drop files to upload' : 'Drop file to upload',
                  removeFileAriaLabel: (e) => `Remove file ${e + 1}`,
                  limitShowFewer: 'Show fewer files',
                  limitShowMore: 'Show more files',
                  errorIconAriaLabel: 'Error',
                }}
                multiple
                showFileLastModified
                showFileSize
                showFileThumbnail
                tokenLimit={3}
                constraintText={undefined}
                fileErrors={[]}
                errorText={''}
              />
            </FormField>
          </SpaceBetween>
        </Container>
      </Form>
    </form>
  );
}
