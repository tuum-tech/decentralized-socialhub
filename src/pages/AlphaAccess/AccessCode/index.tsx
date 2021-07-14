/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable no-useless-escape */
/**
 * Page
 */
import { useHistory } from 'react-router';
import React, { useState, useEffect } from 'react';
import AlphaContent from 'src/elements/AlphaContent';
import TextInput from 'src/elements/inputs/TextInput';
import style from '../style.module.scss';
import AlphaButtonDefault from 'src/elements/AlphaContent/alphabutton';
import { AlphaService } from 'src/services/alpha.service';

import logo from '../../../assets/logo/blacklogo.svg';

const AccessCodePage: React.FC = () => {
  const history = useHistory();
  const [accessCode, setAccessCode] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [hasError, setHasError] = useState(false);
  const [page, setPage] = useState(1);

  useEffect(() => {
    (async () => {
      const alreadyHaveCode = await AlphaService.isLocalCodeValid();
      if (alreadyHaveCode) {
        history.push({ pathname: '/create-profile' });
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const messageDiv = () => {
    if (message && message !== '') {
      return (
        <div>
          <p className={hasError ? style['message-error'] : style['message']}>
            {message}
          </p>
        </div>
      );
    }
    return <div></div>;
  };

  const isAccessCodeValid = async (): Promise<boolean> => {
    if (!accessCode || accessCode.length === 0) return false;
    let response = await AlphaService.isCodeValid(accessCode);
    return response;
  };

  const setErrorMessage = (newMessage: string) => {
    setHasError(true);
    setMessage(newMessage);
  };

  const isEmailValid = () => {
    if (!email || email.length === 0) return false;
    let regexp = new RegExp(
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
    return regexp.test(email);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isEmailValid()) {
      let emailResponse = await AlphaService.requestAccess(email);
      if (emailResponse) {
        changePage(3);
      } else {
        setErrorMessage(
          'We are not able to process your request at moment. Please try again later'
        );
      }
    } else {
      setErrorMessage('Your email address is invalid');
    }
  };

  const continueAction = async () => {
    if (await isAccessCodeValid()) {
      AlphaService.addInviteCodeToLocal(accessCode);
      history.push('/create-profile');
    } else {
      setErrorMessage('Invalid invite code');
    }
  };

  const goToTwitter = async () => {
    window.location.href = `${process.env.REACT_APP_PROFILE_TWITTER}`;
  };

  const changePage = (newPage: number) => {
    setEmail('');
    setAccessCode('');
    setErrorMessage('');
    setPage(newPage);
  };

  const page1 = () => {
    return (
      <div className={style['alpha-div']}>
        <img alt="profile logo" className={style['logo']} src={logo} />
        <h1>Welcome to Profile</h1>
        <p>
          We are invitation only at the moment. <br />
          Have a code? Enter it below to join Profile
        </p>

        <TextInput
          value={accessCode}
          label=""
          onChange={n => setAccessCode(n.toUpperCase())}
          placeholder="Please enter your invite code here"
        />

        <AlphaButtonDefault onClick={continueAction}>
          Continue
        </AlphaButtonDefault>

        {messageDiv()}

        <p>
          No invite yet? You can still request one!{' '}
          <a
            href="#"
            onClick={event => {
              event.preventDefault();
              changePage(2);
            }}
          >
            Join the wait list
          </a>
        </p>
      </div>
    );
  };

  const page2 = () => {
    return (
      <div className={style['alpha-div']}>
        <span role="img" aria-label="smile">
          🤗
        </span>
        <h1>Invitation request</h1>
        <p>&nbsp;</p>

        <form className={style['div-input']} onSubmit={handleSubmit}>
          <TextInput
            value={email}
            label="Email address"
            onChange={n => setEmail(n)}
            placeholder="Please enter your e-mail"
          />

          <AlphaButtonDefault type="submit">Continue</AlphaButtonDefault>
        </form>
        {messageDiv()}

        <p>
          Have invite code?{' '}
          <a
            href="#"
            onClick={event => {
              event.preventDefault();
              changePage(1);
            }}
          >
            Enter code
          </a>
        </p>
      </div>
    );
  };

  const page3 = () => {
    return (
      <div className={style['alpha-div']}>
        <span role="img" aria-label="smile">
          🤗
        </span>
        <h1>All Set!</h1>
        <p>
          We’ve reserved your spot and will email you a code as soon as your
          account is ready!
          <br />
          <br />
          To learn more about Profile you can join our Twitter. Thank You!
        </p>

        <AlphaButtonDefault onClick={goToTwitter}>
          Profile Twitter
        </AlphaButtonDefault>

        <p>Note: You may close this window.</p>
      </div>
    );
  };

  const showPage = () => {
    if (page === 2) return page2();
    if (page === 3) return page3();

    return page1();
  };

  return <AlphaContent>{showPage()}</AlphaContent>;
};

export default AccessCodePage;
