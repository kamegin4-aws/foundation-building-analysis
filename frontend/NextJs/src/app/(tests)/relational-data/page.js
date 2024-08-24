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
  const [user, setUser] = useState(undefined);

  const createOnClick = async (event) => {
    event.preventDefault();
    logger.info(event.detail);
    try {
      if (user) {
        logger.info('Start create');
        const expiresDate = new Date(user.expires);

        const url = `${process.env.NEXT_PUBLIC_BACKEND_PATH}/foundation_app/cognito-users/`;
        const options = {
          method: 'POST', // *GET, POST, PUT, DELETE, etc.
          cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.id_token}`,
          },
          body: JSON.stringify({
            user_id: user.user_id,
            user_name: user.user_name,
            email: user.email,
            plan: user.plan,
            access_token: user.access_token,
            id_token: user.id_token,
            refresh_token: user.refresh_token,
            expires: expiresDate.toISOString(),
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
              setUser(data);
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

  if (user == undefined) {
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
