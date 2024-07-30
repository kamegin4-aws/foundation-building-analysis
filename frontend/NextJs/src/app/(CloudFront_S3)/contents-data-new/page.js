'use client';
import AlertWrapper from '@/ui/Cloudscape/alert';
import ButtonWrapper from '@/ui/Cloudscape/button';
import ContainerWrapper from '@/ui/Cloudscape/container';
import ContentLayoutWrapper from '@/ui/Cloudscape/content_layout';
import FormWrapper from '@/ui/Cloudscape/form';
import HeaderWrapper from '@/ui/Cloudscape/header';
import { S3Context } from '@/ui/components/provider/s3_provider';
import Image from 'next/image';
import { useContext, useEffect, useState } from 'react';

import { ContentsDataUploadValidation } from '@/library/validation/cloudfront_s3/upload';
import { ZodWrapper } from '@/library/validation/infrastructure/zod/zod_client';
import FileUploadWrapper from '@/ui/Cloudscape/file_upload';
import TextContentWrapper from '@/ui/Cloudscape/text_content';
import BreadcrumbProvider from '@/ui/components/provider/bread_crumb';
import { CognitoContext } from '@/ui/components/provider/cognito_provider';
import FlashBarProvider from '@/ui/components/provider/flash_bar';

import TopNavigationProvider from '@/ui/components/provider/top_menu';

export default function NewPage() {
  //Alert
  const [alertDisplay, setAlertDisplay] = useState(false);
  const [alertType, setAlertType] = useState('');
  const [alertHeader, setAlertHeader] = useState('');
  const [alertMessage, setAlertMessage] = useState('');

  //Form
  const [files, setFiles] = useState([]);
  const [uploadButtonLoading, setUploadButtonLoading] = useState(false);
  const [uploadButtonLoadingText, setUploadButtonLoadingText] = useState('');
  const [fileErrors, setFileErrors] = useState([]);
  const [errorText, setErrorText] = useState('');

  //S3Context
  const { contentsClient } = useContext(S3Context);

  //CognitoContext
  const { userAttributes } = useContext(CognitoContext);

  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      setUploadButtonLoading(true);
      setUploadButtonLoadingText('保存中...');

      const uploadValidation = new ContentsDataUploadValidation({
        validationInstance: new ZodWrapper(),
      });

      let filesMeta = [];
      for (let file of files) {
        filesMeta.push({
          name: file.name,
          size: file.size,
          mimeType: file.type,
        });
      }

      const formObject = { filesMeta: filesMeta };

      const uploadValidationResult = uploadValidation.execute({
        formData: formObject,
      });
      setFileErrors([]);
      setErrorText('');
      setAlertDisplay(false);

      if (uploadValidationResult == true) {
        console.log('Validation: true');

        let promiseFunctions = [];
        for (let file of files) {
          promiseFunctions.push(
            contentsClient.upload({
              body: await file.arrayBuffer(),
              userName: userAttributes.userName,
              fileName: file.name,
              keyValueArray: [{ key: 'mimeType', value: file.type }],
            })
          );
        }

        Promise.all(promiseFunctions)
          .then((uploadResults) => {
            console.log('uploadResults', uploadResults);

            setAlertDisplay(true);
            setAlertType('success');
            setAlertHeader('保存しました。');
            setAlertMessage('');
          })
          .catch((error) => {
            setAlertDisplay(true);
            setAlertType('error');
            setAlertHeader('保存に失敗しました。');
            setAlertMessage(error);
          });
      } else {
        console.log('Validation: false: ', uploadValidationResult);
        const validationResultObject = uploadValidationResult;
        if (validationResultObject[0].index == '-1') {
          setErrorText(validationResultObject[0].message);
        } else {
          let fileErrors = new Array(uploadValidationResult.length).fill('');
          for (let validation of validationResultObject) {
            fileErrors[Number(validation.index)] = validation.message;
          }

          setFileErrors(fileErrors);
        }

        return false;
      }
    } catch (e) {
      if (e instanceof Error) {
        console.log(e.message);
        setAlertDisplay(true);
        setAlertType('error');
        setAlertHeader('エラーが発生しました。');
        setAlertMessage(e.message);
      } else {
        setAlertDisplay(true);
        setAlertType('error');
        setAlertHeader('エラーが発生しました。');
        setAlertMessage('Client Error');
      }
    } finally {
      setUploadButtonLoading(false);
    }
  };

  const clearOnClick = (event) => {
    event.preventDefault();
    console.log(event.detail);
    setFiles([]);
    setFileErrors([]);
    setErrorText('');
  };

  useEffect(() => {}, []);

  return (
    <>
      <FlashBarProvider />
      <BreadcrumbProvider />
      <TopNavigationProvider />
      <ContentLayoutWrapper
        header={<HeaderWrapper title={'Contents Data New'} />}
        content={
          <ContainerWrapper
            header={
              <HeaderWrapper
                title={'Contents Data Form'}
                alert={
                  alertDisplay ? (
                    <AlertWrapper
                      type={alertType}
                      header={alertHeader}
                      message={alertMessage}
                      parentAlertDisplay={setAlertDisplay}
                    />
                  ) : undefined
                }
              />
            }
            media={{
              content: (
                <Image src={`/s3.svg`} alt="rds" width={500} height={500} />
              ),
              position: 'side',
              width: '25%',
            }}
            content={
              <FormWrapper
                id={'contents_data_form'}
                onSubmit={onSubmit}
                actions={
                  <>
                    <ButtonWrapper
                      variant={'normal'}
                      iconName={'refresh'}
                      iconAlt={'クリア'}
                      name={'クリア'}
                      onClick={clearOnClick}
                    />
                    <ButtonWrapper
                      formAction={'submit'}
                      iconName={'upload'}
                      iconAlt={'アップロード'}
                      name={'アップロード'}
                      loading={uploadButtonLoading}
                      loadingText={uploadButtonLoadingText}
                    />
                  </>
                }
                container={
                  <>
                    <FileUploadWrapper
                      label={'コンテンツのアップロード'}
                      description={'ファイルをアップロードできます。'}
                      value={files}
                      accept={
                        'audio/*,image/*,text/*,video/*,application/msword,application/json,application/pdf,application/vnd.ms-powerpoint,application/zip,application/vnd.ms-excel'
                      }
                      parentSetValue={setFiles}
                      constraintText={
                        <TextContentWrapper
                          contents={
                            <ul style={{ color: 'gray' }}>
                              <li>ファイル名が必要。</li>
                              <li>1つのファイルサイズは500MBまで。</li>
                              <li>1度にアップロードできるのは100ファイル。</li>
                              <li>全部で5GB未満。</li>
                              <li>以下がアップロード可能</li>
                              <li>{`音声, 画像, テキスト(txt,csv), 動画, JSON, PDF, Word, Excel, PowerPoint, ZIP`}</li>
                            </ul>
                          }
                        />
                      }
                      fileErrors={fileErrors}
                      errorText={errorText}
                    />
                  </>
                }
              />
            }
          />
        }
      />
    </>
  );
}
