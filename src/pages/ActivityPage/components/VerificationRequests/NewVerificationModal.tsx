import React, { useState } from 'react';
import styled from 'styled-components';
import { IonRow, IonModal } from '@ionic/react';

import CloseIcon from '../../../../assets/icon/close.svg';
import whiteuparrow from '../../../../assets/icon/box-arrow-up-right.svg';
import Avatar from 'src/components/Avatar';

export const RequestModal = styled(IonModal)`
  --border-radius: 16px;
  --width: 807px;
  --height: 557px;
  :host(.modal-card) ion-header ion-toolbar:first-of-type {
    padding: 0px;
  }
`;

const ModalTitle = styled.p`
  font-weight: 600;
  font-size: 28px;
  line-height: 136.02%;
  color: #101225;
`;

const TimeText = styled.p`
  font-size: 14px;
  line-height: 160%;
  color: #425466;
`;

const Container = styled.div`
  padding: 37px 30px 50px;
  position: relative;
  height: 100%;

  display: flex;
  flex-direction: column;
  justify-content: center;

  .closeIcon {
    position: absolute;
    right: 30px;
    top: 37px;
    cursor: pointer;
  }

  .buttons {
    .reject {
      width: 106px;
      height: 36px;
      border-radius: 6px;
      margin-right: 15px;
      margin-top: 20px;

      background: #fff4f4;
      border-radius: 6px;
      font-weight: 600;
      font-size: 12px;
      line-height: 12px;
      color: #ff5a5a;
    }
    .approve {
      background: #4c6fff;
      border-radius: 6px;
      width: 182px;
      height: 36px;
      margin-top: 20px;

      font-weight: 600;
      font-size: 12px;
      line-height: 12px;
      color: #ffffff;
    }
  }
`;

const LeftSide = styled.div`
  margin-top: 20px;
  width: 44%;
  background: #edf2f7;
  display: flex;
  align-items: center;
  text-align: center;
  flex-direction: column;

  padding: 50px 30px;

  .name {
    font-weight: 600;
    font-size: 28px;
    line-height: 136.02%;
    text-align: center;
    color: #27272e;
  }

  .overview {
    font-size: 13px;
    line-height: 129%;
    text-align: center;
    color: #425466;
  }

  .did {
    margin-top: 15px;
    font-size: 13px;
    line-height: 162.02%;
    display: flex;
    align-items: center;
    color: #a0aec0;
  }
`;

const RightSide = styled.div`
  margin-top: 20px;
  width: 56%;
  background: #fafafa;
  padding: 37px 28px;

  .title {
    font-weight: 600;
    font-size: 16px;
    line-height: 25px;
    color: #101225;
  }

  .details {
    border: 1px solid #cbd5e0;
    border-radius: 8px;
    padding: 15px;
    margin-top: 10px;

    .field {
      font-weight: 500;
      font-size: 14px;
      line-height: 25px;
      color: #27272e;
    }
    .value {
      font-weight: 600;
      font-size: 16px;
      line-height: 25px;
      color: #27272e;
    }
  }
`;

const ViewMoreButton = styled.div`
  background: #e2e8f0;
  border-radius: 6px;
  display: flex;
  padding: 9px 10px;
  margin-top: 30px;

  p {
    font-weight: 600;
    font-size: 12px;
    line-height: 12px;
    text-align: center;
    color: #718096;

    margin-bottom: 0;
    margin-right: 10px;
  }

  img {
    width: 13px;
    height: 13px;
  }
`;

interface Props {
  session: ISessionItem;
  targetUser: ISessionItem;
  onClose: () => void;
}

const NewVerificationModal: React.FC<Props> = ({
  session,
  onClose,
  targetUser
}: Props) => {
  const [svID, setSVID] = useState(-1); // svID: selected verification ID

  return (
    <Container>
      <img
        src={CloseIcon}
        alt="close"
        className="closeIcon"
        onClick={onClose}
      />
      <ModalTitle>Verification Request</ModalTitle>
      <TimeText>3 months ago</TimeText>
      <IonRow>
        <LeftSide>
          <Avatar did={targetUser.did} />
          <p className="name">{targetUser.name}</p>
          {/* <p className="name">{targetUser.name}</p> */}
          <p className="did">{targetUser.did}</p>
          <ViewMoreButton>
            <p>View Profile</p>
            <img src={whiteuparrow} alt="open" />
          </ViewMoreButton>
        </LeftSide>
        <RightSide>
          <p className="title">Verification Details</p>
          <div className="details">
            <p className="field">Name</p>
            <p className="value">{targetUser.name}</p>
          </div>
        </RightSide>
      </IonRow>
      <div className="buttons">
        <button className="reject">Reject</button>
        <button className="approve">Approve Verification</button>
      </div>
    </Container>
  );
};

export default NewVerificationModal;
