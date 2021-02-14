/**
 * Page
 */

import React, { useState } from 'react';
import AlphaContent from 'src/components/AlphaContent';
import ButtonDefault from 'src/components/ButtonDefault';
import { ButtonLink } from 'src/components/buttons';
import TextInput from 'src/components/inputs/TextInput';
import style from '../style.module.scss';
import logo from '../../../assets/logo/blacklogo.svg';
import AlphaButtonDefault from 'src/components/AlphaContent/alphabutton';



const AccessCodePage: React.FC = () => {

  const [accessCode, setAccessCode] = useState('');
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
          onChange={(n) => setAccessCode(n)}
          placeholder='Please enter your invite code here'
        />

        <AlphaButtonDefault >
          Continue
        </AlphaButtonDefault>
        <p>
          No invite yet? You can still request one! <a href="/Alpha/request">Join the wait list</a>
        </p>
      </div>
    </AlphaContent>
  );
};

export default AccessCodePage;
