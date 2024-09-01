'use client';

import logger from '@/library/logging/logger';
import {
  Button,
  Container,
  Form,
  FormField,
  Header,
  SpaceBetween,
} from '@cloudscape-design/components';
import React, { useEffect, useState } from 'react';

export default function RelationalDataPage() {
  const [session, setSession] = useState(undefined);

  const createOnClick = async (event) => {
    event.preventDefault();
    logger.info(event.detail);
    try {
      if (session) {
        logger.info('Start create');

        const url = `${process.env.NEXT_PUBLIC_BACKEND_PATH}/foundation_app/cognito-users/`;
        const options = {
          method: 'POST', // *GET, POST, PUT, DELETE, etc.
          cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session.user.idToken}`,
          },
          body: JSON.stringify({
            user_id: session.user.id,
            user_name: session.user.name,
            email: session.user.email,
            plan: session.user.plan,
          }),
        };

        //@ts-ignore
        const response = await fetch(url, options);

        const data = await response.json();

        logger.info(`create successfully: ${JSON.stringify(data)}`);
      }
    } catch (e) {
      if (e instanceof Error) {
        logger.error(e.message);
      } else {
        logger.error('エラー');
      }
    } finally {
      logger.info('create finished');
    }
  };

  useEffect(() => {
    const url = `${process.env.NEXT_PUBLIC_BASE_PATH}/api/session`;
    const options = {
      method: 'GET', // *GET, POST, PUT, DELETE, etc.
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    // @ts-ignore
    fetch(url, options)
      .then((response) => {
        if (response.ok) {
          response
            .json()
            .then((data) => {
              logger.info(`success for session: ${JSON.stringify(data)}`);
              setSession(data);
            })
            .catch((error) => {
              logger.error(`error for session: ${error.message}`);
            });
        } else {
          throw new Error('Network response was not ok.');
        }
      })
      .catch((error) => {
        logger.error(`error for session: ${error.message}`);
      });
  }, []);

  if (session == undefined) {
    return (
      <div>
        <p>セッション情報取得中...</p>
      </div>
    );
  }

  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <Form
        actions={
          <SpaceBetween direction="horizontal" size="xs">
            <Button
              onClick={createOnClick}
              iconName={'add-plus'}
              iconAlt={'新規作成'}
            >
              新規作成
            </Button>
          </SpaceBetween>
        }
        header={<Header variant="h1">Form header</Header>}
      >
        <Container header={<Header variant="h2">Form container header</Header>}>
          <SpaceBetween direction="vertical" size="l">
            <FormField
              label={'Relational Data'}
              description={'Relational Data'}
            ></FormField>
          </SpaceBetween>
        </Container>
      </Form>
    </form>
  );
}
