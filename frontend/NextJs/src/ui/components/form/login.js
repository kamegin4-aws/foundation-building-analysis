'use client';

import ButtonWrapper from '@/ui/Cloudscape/button';
import FormWrapper from '@/ui/Cloudscape/form';
import FormFieldWrapper from '@/ui/Cloudscape/form_field';
import InputWrapper from '@/ui/Cloudscape/input';
import { useState } from 'react';

import { UserNameLogin } from '@/library/api/cognito/login';
import { LoginValidation } from '@/library/validation/cognito/login';
import { ZodWrapper } from '@/library/validation/infrastructure/zod/zod_client';
import TextContentWrapper from '@/ui/Cloudscape/text_content';
import React from 'react';

export default function LoginForm(props) {
  //Form
  const [userNameInputValue, setUserNameInputValue] = useState('');
  const [userNameErrorText, setUserNameErrorText] = useState('');
  const [passwordInputValue, setPasswordInputValue] = useState('');
  const [passwordErrorText, setPasswordErrorText] = useState('');
  const [loginButtonLoading, setLoginButtonLoading] = useState(false);
  const [loginButtonLoadingText, setLoginButtonLoadingText] = useState('');

  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      setLoginButtonLoading(true);
      setLoginButtonLoadingText('ログイン中...');

      const loginValidation = new LoginValidation(new ZodWrapper());
      const userNameLogin = new UserNameLogin();

      const formData = new FormData();
      formData.append('user_name', userNameInputValue);
      formData.append('password', passwordInputValue);

      const validationResult = loginValidation.execute(formData);
      setUserNameErrorText('');
      setPasswordErrorText('');
      props.parentSetAlertDisplay(false);

      if (validationResult == true) {
        console.log('loginValidation: true');
        const apiResponse = await userNameLogin.execute(formData);

        if (apiResponse.ok) {
          const apiResponseObject = await apiResponse.json();
          console.log('apiResponseObject', apiResponseObject);
          props.parentSetAlertDisplay(true);
          props.parentSetAlertType('success');
          props.parentSetAlertHeader('ログインしました。');
          props.parentSetAlertMessage('');
          //setCognitoTokens(apiResponseObject);
          //setAlertMessage(JSON.stringify(apiResponseObject));
        } else {
          props.parentSetAlertDisplay(true);
          props.parentSetAlertType('error');
          props.parentSetAlertHeader('ログインに失敗しました。');
          props.parentSetAlertMessage(await apiResponse.json());
        }
      } else {
        console.log('loginValidation: false: ', validationResult);
        const validationResultObject = validationResult;
        for (let validation of validationResultObject) {
          if (validation['index'] == 'userName')
            setUserNameErrorText(validation['message']);
          else if (validation['index'] == 'password')
            setPasswordErrorText(validation['message']);
        }

        return false;
      }
    } catch (e) {
      if (e instanceof Error) {
        console.log(e.message);
        props.parentSetAlertDisplay(true);
        props.parentSetAlertType('error');
        props.parentSetAlertHeader('エラーが発生しました。');
        props.parentSetAlertMessage(e.message);
      } else {
        props.parentSetAlertDisplay(true);
        props.parentSetAlertType('error');
        props.parentSetAlertHeader('エラーが発生しました。');
        props.parentSetAlertMessage('Client Error');
      }
    } finally {
      setLoginButtonLoading(false);
    }
  };

  const clearOnClick = (event) => {
    event.preventDefault();
    console.log(event.detail);
    setUserNameInputValue('');
    setPasswordInputValue('');
    setUserNameErrorText('');
    setPasswordErrorText('');
  };

  return (
    <FormWrapper
      id={'login_form'}
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
            iconName={'user-profile-active'}
            iconAlt={'ログイン'}
            name={'ログイン'}
            loading={loginButtonLoading}
            loadingText={loginButtonLoadingText}
          />
        </>
      }
      container={
        <>
          <FormFieldWrapper
            label={'ユーザー名'}
            description={'ユーザー名を入力してください。(例)太郎'}
            formField={
              <InputWrapper
                value={userNameInputValue}
                parentSetValue={setUserNameInputValue}
              />
            }
            errorText={userNameErrorText}
          />
          <FormFieldWrapper
            label={'パスワード'}
            description={
              <TextContentWrapper
                contents={
                  <ul style={{ color: 'gray' }}>
                    <li>パスワードを入力してください。</li>
                    <li>パスワードの最小文字数:8 文字。</li>
                    <li>少なくとも 1 つの数字を含む。</li>
                    <li>{`少なくとも 1 つの特殊文字を含む(^ $ * . [ ] { } ( ) ? - " ! @ # % & / \ , > < ' : ; | _ ~ \` + =)。`}</li>
                    <li>少なくとも 1 つの大文字を含む。</li>
                    <li>少なくとも 1 つの小文字を含む。</li>
                  </ul>
                }
              />
            }
            formField={
              <InputWrapper
                type={'password'}
                value={passwordInputValue}
                parentSetValue={setPasswordInputValue}
              />
            }
            errorText={passwordErrorText}
          />
        </>
      }
    />
  );
}
