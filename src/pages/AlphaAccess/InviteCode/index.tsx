/**
 * Page
 */

import React, { useState } from 'react';
import AlphaContent from 'src/components/AlphaContent';
import TextInput from 'src/components/inputs/TextInput';
import AlphaButtonDefault from 'src/components/AlphaContent/alphabutton';
import style from '../style.module.scss';
import { AlphaService } from 'src/services/alpha.service';
import { useHistory } from 'react-router';


const InviteCodePage: React.FC = () => {
    const history = useHistory();
    let continueAction = () =>{
       window.location.href = `${process.env.REACT_APP_PROFILE_LANDING_PAGE}`;
    }

    return (
        <AlphaContent>

            <div className={style["alpha-div"]}>
                <span>🤗</span>
                <h1>All Set!</h1>
                <p>
                    We’ve reserved your spot and will email you a code as soon as your account is ready! 
                    <br /><br />
                    To learn more about Profile you can read below. Thank you!
                </p>

                


                <AlphaButtonDefault onClick={continueAction}>
                    About Profile
        </AlphaButtonDefault>

                

                <p>
                Note: You may close this window.
                </p>
            </div>
        </AlphaContent>
    );
};

export default InviteCodePage;
