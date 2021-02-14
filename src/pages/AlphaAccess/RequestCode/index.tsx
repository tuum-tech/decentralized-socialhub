/**
 * Page
 */

import React, { useState } from 'react';
import AlphaContent from 'src/components/AlphaContent';
import TextInput from 'src/components/inputs/TextInput';
import AlphaButtonDefault from 'src/components/AlphaContent/alphabutton';
import style from '../style.module.scss';



const RequestCodePage: React.FC = () => {

  const [email, setEmail] = useState('');
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


        <AlphaButtonDefault >
          Continue
        </AlphaButtonDefault>
        <p>
          Have invite code? <a href="/Alpha/access">Enter code</a>
        </p>
      </div>
    </AlphaContent>
  );
};

export default RequestCodePage;
