import { IonCol, IonRow } from '@ionic/react';
import styled from 'styled-components';
import { down } from 'styled-breakpoints';

export const UserRow = styled(IonRow)`
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0px 3px 8px -1px rgba(50, 50, 71, 0.05);
  filter: drop-shadow(0px 0px 1px rgba(12, 26, 75, 0.24));
  margin-top: 30px;
  align-items: center;
  padding: 14px;
`;

export const InfoCol = styled(IonCol)`
  display: flex;
  align-items: center;
  padding: 0;

  .left {
    display: block;
    margin-right: 20px;
  }

  .right {
    display: block;
    flex-grow: 1;
    .top {
      font-size: 16px;
      line-height: 162.02%;
      color: #425466;
    }

    .bottom {
      font-weight: normal;
      font-size: 13px;
      line-height: 162.02%;
      color: #425466;
    }
  }
`;

export const ActionCol = styled(IonCol)`
  display: flex;
  padding: 0;

  ${down('sm')} {
    width: 100%;
    padding-left: 70px;
    padding-top: 13px;
  }
`;

export const getStatusColor = (status: string) => {
  let statusColor = '#2FD5DD';
  if (status === 'requested' || status === 'pending') {
    statusColor = '#FF5A5A';
  } else if (status === 'rejected') {
    statusColor = '#FF9840';
  }
  return statusColor;
};
