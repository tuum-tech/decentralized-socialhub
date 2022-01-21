import React from 'react';
import { IonCard, IonCardContent, IonRow, IonImg, IonText } from '@ionic/react';
import style from './CreateSpace.module.scss';
import { StyledButton } from 'src/elements/buttons';
import Spaces from 'src/assets/icon/spaces.svg';

interface Props {
  session: ISessionItem;
  openForm: () => void;
}

const CreateSpace: React.FC<Props> = ({ session, openForm }: Props) => {
  return (
    <>
      <IonCard className={style['create-space-card']}>
        <IonCardContent className={style['card-content']}>
          <IonRow>
            <IonImg src={Spaces}></IonImg>
          </IonRow>
          <IonRow>
            <IonText>
              <h3>Your Community Pages</h3>
            </IonText>
          </IonRow>
          <IonRow>
            <IonText>
              <h4>You don't have any pages yet</h4>
            </IonText>
          </IonRow>
          <IonRow>
            <StyledButton width="200px" height="40px" onClick={openForm}>
              Create your First Space
            </StyledButton>
          </IonRow>
        </IonCardContent>
      </IonCard>
    </>
  );
};

export default CreateSpace;
