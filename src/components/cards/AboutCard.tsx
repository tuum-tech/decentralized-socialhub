import React, { useState } from 'react';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonCol,
  IonFooter,
  IonGrid,
  IonModal,
  IonRow,
  IonTextarea,
} from '@ionic/react';
import styleWidget from '../cards/WidgetCards.module.scss';
import { BasicDTO } from 'src/pages/PublicPage/types';
import styled from 'styled-components';

interface BasicInfo {
  adress: string,
  name: string

}

const LinkStyleSpan = styled.span`
  font-family: 'SF Pro Display';
  font-size: 14px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: -0.07px;
  text-align: left;
  color: #4c6fff;`
  ;



const MyModal = styled(IonModal)`
--border-radius: 16px;
--min-height: 200px;
--height: 480px;
--width: 560px;
`;

const ModalFooter = styled(IonFooter)`
padding:12px;

`;
interface IProps {
  basicDTO: BasicDTO,
  mode: string,
  updateFunc?: any
}

const AboutCard: React.FC<IProps> = ({ basicDTO, mode, updateFunc }: IProps) => {

  const [isEditing, setIsEditing] = useState(false);
  const [about, setAbout] = useState(basicDTO.about);

  const edit = () => {
    setIsEditing(true);
  }

  const update = () => {
    const newBasicDTO = { ...basicDTO };
    newBasicDTO.about = about;
    updateFunc(about)
  }


  return (
    <>
      <IonCard className={styleWidget['overview']}>
        <IonCardHeader>
          <IonGrid>
            <IonRow className="ion-justify-content-between">
              <IonCol><IonCardTitle>About</IonCardTitle></IonCol>
              {mode === "edit" ? <IonCol size="auto"><LinkStyleSpan onClick={edit}>+ Edit</LinkStyleSpan></IonCol> : ""}
            </IonRow>
          </IonGrid>
        </IonCardHeader>
        <IonCardContent>
          {about}
        </IonCardContent>
      </IonCard >
      <MyModal isOpen={isEditing} cssClass='my-custom-class'>
        <IonTextarea value={about} onChange={(evt: any) => setAbout(evt.target.value)}></IonTextarea>
        <ModalFooter className="ion-no-border">
          <IonRow className="ion-justify-content-around">
            <IonCol size="auto" >
              <IonButton fill="outline" onClick={() => setIsEditing(false)}>Cancel</IonButton>
              <IonButton onClick={() => { update(); setIsEditing(false) }}>
                Edit
              </IonButton>
            </IonCol>
          </IonRow>
        </ModalFooter>
      </MyModal>
    </>
  );
};

export default AboutCard;
