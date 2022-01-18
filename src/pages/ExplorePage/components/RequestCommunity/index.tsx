import React, { useEffect, useState } from 'react';
import {
  IonCard,
  IonCardContent,
  IonRow,
  IonText,
  IonModal
} from '@ionic/react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { makeSelectSession } from 'src/store/users/selectors';
import { setSession } from 'src/store/users/actions';
import { InferMappedProps, SubState } from './types';
import style from './RequestCommunity.module.scss';
import { StyledButton } from 'src/elements/buttons';
import RequestCommunityForm from './RequestCommunityForm';
import { showNotify } from 'src/utils/notify';
const CustomModal = styled(IonModal)`
  --height: 540px;
  --width: 450px;
  --min-height: 400px;
  --border-radius: 16px;
`;
const RequestCommunity: React.FC<InferMappedProps> = ({ session }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const sendRequest = async (request: any) => {
    const userinfo = {
      name: session.name,
      did: session.did,
      email: session.loginCred?.email
    };
    const bodyContact = {
      subject: `[Community Space Request] - ${request['Space Category']}`,
      userinfo: userinfo,
      description: JSON.stringify(request)
    };
    console.log(bodyContact);
    const emailresponse: Response = await fetch(
      `${process.env.REACT_APP_PROFILE_API_SERVICE_URL}/v1/support_router/send_email`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${process.env.REACT_APP_PROFILE_API_SERVICE_KEY}`
        },
        body: JSON.stringify(bodyContact)
      }
    );

    if (emailresponse.status === 200) {
      setIsModalOpen(false);
      showNotify('Email sent successfully', 'success');
    } else {
      showNotify('Error sending email. Please try again another time', 'error');
    }
  };
  return (
    <>
      <IonCard className={style['request-community-card']}>
        <IonCardContent className={style['card-content']}>
          <IonRow>
            <div>
              <IonText>
                <h3>Want to request a community space?</h3>
              </IonText>
              <IonText>
                <h4>
                  Give us some suggestions for innovative content, such as NFT
                  collections, Defi,<br></br>gaming, and more
                </h4>
              </IonText>
            </div>
            <div>
              <StyledButton
                width="200px"
                height="40px"
                onClick={() => {
                  setIsModalOpen(true);
                }}
              >
                Request Community Space
              </StyledButton>
            </div>
          </IonRow>
        </IonCardContent>
      </IonCard>
      <CustomModal
        onDidDismiss={() => {
          setIsModalOpen(false);
        }}
        isOpen={isModalOpen}
        cssClass="my-custom-class"
      >
        <RequestCommunityForm
          onClose={() => {
            setIsModalOpen(false);
          }}
          sendRequest={sendRequest}
        />
      </CustomModal>
    </>
  );
};

export const mapStateToProps = createStructuredSelector<SubState, SubState>({
  session: makeSelectSession()
});

export function mapDispatchToProps(dispatch: any) {
  return {
    eProps: {
      setSession: (props: { session: ISessionItem }) =>
        dispatch(setSession(props))
    }
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RequestCommunity);
