/**
 * Page
 */

import React, { useState } from 'react';
import AlphaContent from 'src/components/AlphaContent';
import TextInput from 'src/components/inputs/TextInput';
import style from '../style.module.scss';
import logo from '../../../assets/logo/blacklogo.svg';
import AlphaButtonDefault from 'src/components/AlphaContent/alphabutton';
import { useHistory } from 'react-router';



const AccessCodePage: React.FC = () => {
  const history = useHistory();
  const [accessCode, setAccessCode] = useState('');

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

  const isAccessCodeValid = async () : Promise<boolean> => {
    if (!accessCode || accessCode.length === 0) return false

    return true
  }

  const setMessageAction = (error: boolean, newMessage: string) =>{
    setHasError(error);
    setMessage(newMessage)
  }

  

  const continueAction = async () => {

    if (await isAccessCodeValid()) {
      history.replace('/create/profile?invitecode=' + accessCode);
      window.location.reload();
      
    } else {
      setMessageAction(true, "Invalid invite code")
    }
  }

  return (
    <AlphaContent>
      
      <div className={style["alpha-div"]}>
        <img className={style["logo"]} src={logo} />
        <h1>Welcome to Profile</h1>
        <p>
          We are invitation only at the moment. <br />
          Have a code? Enter it below to join Profile
        </p>

        <TextInput
          value={accessCode}
          label=''
          onChange={(n) => setAccessCode(n.toUpperCase())}
          placeholder='Please enter your invite code here'
        />

        <AlphaButtonDefault onClick={continueAction}>
          Continue
        </AlphaButtonDefault>

        {messageDiv()} 

        <p>
          No invite yet? You can still request one! <a href="/Alpha/request">Join the wait list</a>
        </p>
      </div>
    </AlphaContent>
  );
};

export default AccessCodePage;
