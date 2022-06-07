import React, { useState } from 'react';
import { IonCard, IonCardContent, IonRow, IonText } from '@ionic/react';
import { useBreakpoint } from 'styled-breakpoints/react-styled';
import { down } from 'styled-breakpoints';

import style from './RequestCommunity.module.scss';
import RequestCommunityForm from './RequestCommunityForm';
import { showNotify } from 'src/utils/notify';
import { DefaultButton } from 'src/elements-v2/buttons';
import Modal from 'src/elements-v2/Modal';
import useSession from 'src/hooks/useSession';

const RequestCommunity: React.FC = () => {
  const { session } = useSession();
  const isSmDown = useBreakpoint(down('sm'));
  const [isModalOpen, setIsModalOpen] = useState(false);

  const sendRequest = (request: any) => {
    (async () => {
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
        showNotify(
          'Error sending email. Please try again another time',
          'error'
        );
      }
    })();
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
              <DefaultButton
                variant="contained"
                btnColor="primary-gradient"
                onClick={() => {
                  setIsModalOpen(true);
                }}
              >
                Request Community Space
              </DefaultButton>
            </div>
          </IonRow>
        </IonCardContent>
      </IonCard>
      <Modal
        title="Request for Community Space"
        okText="Send Request"
        onClose={() => {
          setIsModalOpen(false);
        }}
        isOpen={isModalOpen}
        titleStyle={{ fontSize: isSmDown ? 22 : 28 }}
        noButton
        autoWidth
      >
        <RequestCommunityForm
          onClose={() => {
            setIsModalOpen(false);
          }}
          sendRequest={sendRequest}
        />
      </Modal>
    </>
  );
};

export default RequestCommunity;
