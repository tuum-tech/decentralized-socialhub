import React from 'react';
import { useHistory } from 'react-router-dom';
import { useIonPopover } from '@ionic/react';
import styled from 'styled-components';
import { up } from 'styled-breakpoints';
import styles from './style.module.scss';
import Logo from 'src/elements/Logo';
import Avatar from 'src/components/Avatar';
import Icon from 'src/elements-v2/icons';
import { RequestStatus } from 'src/services/assist.service';
import PopoverMenu from './PopoverMenu';

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: ${styles['main-dark-gradient']};
  ${up('sm')} {
    display: none;
  }
`;

const AvatarContainer = styled.div`
  width: 90px;
  height: 60px;
  margin-right: 10px;
  background: rgba(255, 255, 255, 0.17);
  border-radius: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

interface IProps {
  sessionItem: ISessionItem;
  publishStatus: RequestStatus;
}

const HeaderMobile = ({ sessionItem, publishStatus }: IProps) => {
  const history = useHistory();
  const [present, dismiss] = useIonPopover(PopoverMenu, {
    onHide: () => dismiss(),
    sessionItem,
    publishStatus,
    backdropDismiss: true,
    history
  });

  return (
    <Container>
      <Logo />
      <AvatarContainer
        onClick={e =>
          present({
            event: e.nativeEvent
          })
        }
      >
        {sessionItem.did && (
          <Avatar
            did={sessionItem.did}
            didPublished={
              sessionItem.isDIDPublished && sessionItem.onBoardingCompleted
            }
            width="50px"
          />
        )}
        <Icon name="chevron-down-outline" color="medium" />
      </AvatarContainer>
    </Container>
  );
};

export default HeaderMobile;
