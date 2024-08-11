'use client';

import Loading from '@/app/loading';
import AlertWrapper from '@/ui/Cloudscape/alert';
import BoxWrapper from '@/ui/Cloudscape/box';
import ButtonWrapper from '@/ui/Cloudscape/button';
import ColumnLayoutWrapper from '@/ui/Cloudscape/column_layout';
import ContainerWrapper from '@/ui/Cloudscape/container';
import ContentLayoutWrapper from '@/ui/Cloudscape/content_layout';
import HeaderWrapper from '@/ui/Cloudscape/header';
import IconWrapper from '@/ui/Cloudscape/icon';
import SpaceBetweenWrapper from '@/ui/Cloudscape/space_between';
import BreadcrumbProvider from '@/ui/components/provider/bread_crumb';
import { CognitoContext } from '@/ui/components/provider/cognito_provider';
import FlashBarProvider from '@/ui/components/provider/flash_bar';
import TopNavigationProvider from '@/ui/components/provider/top_menu';
import log4js from 'log4js';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useContext, useEffect, useState } from 'react';

const logger = log4js.getLogger();
logger.level = 'debug';

export default function UserInfoPage() {
  const router = useRouter();

  //CognitoContext
  const { userAttributes } = useContext(CognitoContext);

  //Alert
  const [alertDisplay, setAlertDisplay] = useState(false);
  const [alertType, setAlertType] = useState();
  const [alertHeader, setAlertHeader] = useState();
  const [alertMessage, setAlertMessage] = useState();

  //Contents
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');

  const deleteOnClick = (event) => {
    event.preventDefault();
  };

  useEffect(() => {
    if (userAttributes) {
      logger.debug('userAttributes', userAttributes);

      setUserName(userAttributes.userName);
      setEmail(userAttributes.email);
    }
  }, [userAttributes]);

  if (!userAttributes) return <Loading />;

  return (
    <>
      <FlashBarProvider />
      <BreadcrumbProvider />
      <TopNavigationProvider />
      <ContentLayoutWrapper
        disableOverlap={true}
        header={
          <HeaderWrapper
            title={'User Info'}
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
            actions={
              <>
                <ButtonWrapper
                  variant={'normal'}
                  iconName={'remove'}
                  iconAlt={'削除'}
                  name={'削除'}
                  onClick={deleteOnClick}
                />
                <ButtonWrapper
                  variant={'link'}
                  iconName={'edit'}
                  iconAlt={'編集'}
                  name={'編集'}
                  href={'#'}
                />
              </>
            }
          />
        }
        content={
          <ContainerWrapper
            variant={'embedded'}
            media={{
              content: (
                <Image
                  src={`/cognito.svg`}
                  alt="cognito"
                  width={500}
                  height={500}
                />
              ),
              position: 'side',
              width: '25%',
            }}
            content={
              <ColumnLayoutWrapper
                columnNumber={2}
                borders={'vertical'}
                content={
                  <>
                    <BoxWrapper
                      variant={'div'}
                      content={
                        <SpaceBetweenWrapper
                          size={'xs'}
                          direction={'horizontal'}
                          contents={
                            <>
                              ユーザー名
                              <IconWrapper name={'user-profile'} />
                            </>
                          }
                        />
                      }
                    />
                    <BoxWrapper variant={'div'} content={userName} />
                    <BoxWrapper
                      variant={'div'}
                      content={
                        <SpaceBetweenWrapper
                          size={'xs'}
                          direction={'horizontal'}
                          contents={
                            <>
                              Eメール
                              <IconWrapper name={'envelope'} />
                            </>
                          }
                        />
                      }
                    />
                    <BoxWrapper variant={'div'} content={email} />
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
