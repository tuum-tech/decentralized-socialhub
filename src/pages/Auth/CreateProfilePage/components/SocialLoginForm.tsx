import React from 'react';

import { SocialButton } from 'src/elements/buttons';
import TwitterApi from 'src/shared-base/api/twitter-api';
import {
  requestGoogleLogin,
  requestLinkedinLogin,
  requestFacebookLogin
} from '../fetchapi';

import style from '../style.module.scss';

interface Props {}

const SocialLoginForm: React.FC<Props> = () => {
  const sociallogin = async (socialType: string) => {
    if (socialType === 'twitter') {
      type MyType = { meta: string; data: { request_token: string } };
      // gets the linkedin auth endpoint
      const response = (await TwitterApi.GetRequestToken()) as MyType;

      // redirects
      window.location.replace(
        `https://api.twitter.com/oauth/authorize?oauth_token=${response.data.request_token}`
      );
      return;
    }

    type MyType = { meta: string; data: string };
    let url: MyType = {} as MyType;

    if (socialType === 'google') {
      // gets the linkedin auth endpoint
      url = (await requestGoogleLogin()) as MyType;
    } else if (socialType === 'facebook') {
      // gets the linkedin auth endpoint
      url = (await requestFacebookLogin()) as MyType;
    } else if (socialType === 'linkedin') {
      // gets the linkedin auth endpoint
      url = (await requestLinkedinLogin()) as MyType;
    }

    if (url) {
      window.location.href = url.data; // redirects
    }
  };

  return (
    <div className={style['social-btn-group']}>
      <SocialButton
        type="linkedin"
        onClick={async () => await sociallogin('linkedin')}
      />
      <SocialButton
        type="google"
        onClick={async () => await sociallogin('google')}
      />
      <SocialButton
        type="twitter"
        onClick={async () => await sociallogin('twitter')}
      />
      <SocialButton
        type="facebook"
        onClick={async () => await sociallogin('facebook')}
      />
    </div>
  );
};

export default SocialLoginForm;
