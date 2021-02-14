/**
 * Page
 */

import React, { useState } from 'react';
import AlphaContent from 'src/components/AlphaContent';
import TextInput from 'src/components/inputs/TextInput';
import AlphaButtonDefault from 'src/components/AlphaContent/alphabutton';
import style from '../style.module.scss';
import { AlphaService } from 'src/services/alpha.service';



const RequestCodePage: React.FC = () => {

  const [email, setEmail] = useState('');

  const [message, setMessage] = useState('');

  const [hasError, setHasError] = useState(false)

  const messageDiv = () => {
    if (message && message !== '') {
      return <div >
        <p className={hasError ? style["message-error"] : style["message"]}>{message}</p>
      </div>
    }
    return <div></div>
  }

  const isEmailValid = () => {
    if (!email || email.length == 0) return false;
    let regexp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    return regexp.test(email);
  }

  const setMessageAction = (error: boolean, newMessage: string) =>{
    setHasError(error);
    setMessage(newMessage)
  }

  

  const continueAction = async () => {

    if (isEmailValid()) {
      let emailResponse = await AlphaService.requestAccess(email);
      if (emailResponse) {
        setMessageAction( false,"Thank you for request, we will send your invite code when is ready" )
      
      } else {
        setMessageAction( true,"We are not able to process your request at moment. Please try again later" )
      }
      
    } else {
      setMessageAction(true, "Your email address is invalid")
    }
  }

  return (
    <AlphaContent>

      <div className={style["alpha-div"]}>
        <span>🤗</span>
        <h1>Invitation request</h1>
        <p>&nbsp;</p>

        <div className={style["div-input"]}>
          <TextInput
            value={email}
            label='Email address'
            onChange={(n) => setEmail(n)}
            placeholder='Please enter your e-mail'
          />
        </div>


        <AlphaButtonDefault onClick={continueAction}>
          Continue
        </AlphaButtonDefault>

        {messageDiv()}

        <p>
          Have invite code? <a href="/Alpha/access">Enter code</a>
        </p>
      </div>
    </AlphaContent>
  );
};

export default RequestCodePage;
