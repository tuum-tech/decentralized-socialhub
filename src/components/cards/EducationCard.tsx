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
  IonLabel,
  IonModal,
  IonRow,
  IonTextarea,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import styleWidget from '../cards/WidgetCards.module.scss';
import { EducationDTO, EducationItem } from 'src/pages/PublicPage/types';
import styled from 'styled-components';
import { ButtonLink } from '../buttons';
import SmallTextInput from '../inputs/SmallTextInput';
import AlphaContent from '../AlphaContent';
import Button from 'react-bootstrap/esm/Button';
import SkeletonAvatar from '../avatars/SkeletonAvatar';
//import avatar from 'https://media-exp1.licdn.com/dms/image/C4D03AQHJrVWT1os_uQ/profile-displayphoto-shrink_100_100/0/1613330591466?e=1619654400&v=beta&t=oE-BJ4-vYiefNuEYQTaKeVDaJWh8coNOUypjIwHoY2s'
import style from './DidCard.module.scss';
import harvard from '../../assets/logo/Harvard-Logo.png'


interface IEducationProps {
  educationDTO: EducationDTO;
  updateFunc: any;
  mode: string;
}

const Institution = styled.span`
  font-family: 'SF Pro Display';
  font-size: 16px;
  font-weight: 600;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.56;
  letter-spacing: normal;
  text-align: left;
  color: #27272e;
`;


const Program = styled.span`
  font-family: 'SF Pro Display';
  font-size: 14px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.79;
  letter-spacing: normal;
  text-align: left;
  color: #27272e;
`;


const Period = styled.span`
  font-family: 'SF Pro Display';
  font-size: 14px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.71;
  letter-spacing: normal;
  text-align: left;
  color: #27272e;
`;


const Description = styled.span`
  font-family: 'SF Pro Display';
  font - size: 13px;
  font - weight: normal;
  font - stretch: normal;
  font - style: normal;
  line - height: 1.62;
  letter - spacing: normal;
  text - align: left;
  color: rgba(66, 84, 102, 0.57);
`;

const SmallLightButton = styled.button`
height: 27px;
display: inline;
flex-direction: column;
justify-content: center;
align-items: center;
gap: 10px;
padding: 7px 13px;
border-radius: 6px;
background-color: #f3f9ff;
font-family: 'SF Pro Display';
font-size: 14px;
font-weight: 600;
font-stretch: normal;
font-style: normal;
line-height: 1;
letter-spacing: normal;
text-align: left;
color: #4c6fff;

`;

const SmallBlueButton = styled(ButtonLink)`
height: 27px;
display: inline;
flex-direction: column;
justify-content: center;
align-items: center;
gap: 10px;
padding: 7px 13px;
border-radius: 6px;
background-color: #f3f9ff;
font-family: 'SF Pro Display';
font-size: 14px;
font-weight: 600;
font-stretch: normal;
font-style: normal;
line-height: 1;
letter-spacing: normal;
text-align: left;
color: #4c6fff;
`;

const MyModal = styled(IonModal)`
--border-radius: 16px;
--min-height: 200px;
--height: 480px;
--width: 560px;
`;

const ModalFooter = styled(IonFooter)`
padding:12px;

`;


const Divider = styled.hr`
width: 100%;
height: 1px;
text-align: center;
margin-top: 1.5em;
margin-bottom: 1.5em;
background-color: #f7fafc;;
`;



interface EducationItemsProps {
  educationItem: EducationItem;
  handleChange: any;
  updateFunc: any;
  index: number;
  initialStatus?: string;
  removeFunc: any;
}

const EducationItems: React.FC<EducationItemsProps> = ({ educationItem, handleChange, updateFunc, index, removeFunc }) => {



  const [editMode, setEditMode] = useState(educationItem.isEmpty ? 'add' : 'readonly');


  const cancel = () => {
    if (editMode === 'add')
      removeFunc();

    setEditMode("readonly");
  }

  return (
    <>

      <IonGrid>
        <IonRow className="ion-justify-content-between">
          <IonCol size="2">
            <div>
              <SkeletonAvatar />
              <img alt="avatar"
                src={harvard}
                width='80'
                height='80'
                className={style['clip-avatar-svg']}
              />
            </div>
          </IonCol>
          <IonCol size="9">
            <IonGrid>
              <IonRow><Institution>{educationItem.institution}</Institution></IonRow>
              <IonRow><Program>{educationItem.title}</Program></IonRow>
              <IonRow><Period>{educationItem.start} - {educationItem.end}</Period></IonRow>
              <IonRow><Description>{educationItem.description}</Description></IonRow>
            </IonGrid>
          </IonCol>
          <IonCol size="auto">
            <span onClick={() => setEditMode("edit")}>...</span>
          </IonCol>
        </IonRow>
      </IonGrid>
      <MyModal isOpen={editMode === 'add' || editMode === 'edit'} cssClass='my-custom-class'>
        <EducationCardEdit educationItem={educationItem} handleChange={handleChange} index={index} mode={editMode} />
        <ModalFooter className="ion-no-border">
          <IonRow className="ion-justify-content-around">
            <IonCol size="auto" >
              <IonButton fill="outline" onClick={cancel}>Cancel</IonButton>
              <IonButton onClick={() => { updateFunc(index); setEditMode("readonly") }}>
                {
                  editMode === 'add' ? "Add new Education" : "Edit Education"
                }
              </IonButton>
            </IonCol>
          </IonRow>
        </ModalFooter>
      </MyModal>
    </>
  )
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

const EducationCard: React.FC<IEducationProps> = ({ educationDTO, updateFunc, mode }: IEducationProps) => {


  const [currentEducationDTO, setCurrentEducationDTO] = useState(educationDTO);

  const handleChange = (evt: any, index: number) => {

    // console.log("name: " + evt.target.name);
    // console.log("value: " + evt.target.value);
    // console.log("index: " + index);


    // 1. Make a shallow copy of the items
    let items = [...currentEducationDTO.items];

    let item = {
      ...items[index],
      [evt.target.name]: evt.target.value
    }
    // 4. Put it back into our array. N.B. we *are* mutating the array here, but that's why we made a copy first
    items[index] = item;


    // 5. Set the state to our new copy
    setCurrentEducationDTO({ isEnabled: true, items: items });
  }

  const saveChanges = (index: number) => {

    console.log("saving changes");
    updateFunc(currentEducationDTO.items[index]);
  }

  const addItem = () => {

    console.log("adding item");

    // 1. Make a shallow copy of the items
    let items = [...currentEducationDTO.items];

    let item: EducationItem = {
      _id: "",
      description: "",
      institution: "",
      program: "",
      title: "",
      order: "",
      start: "",
      end: "",
      isEmpty: true
    }
    // 4. Put it back into our array. N.B. we *are* mutating the array here, but that's why we made a copy first
    items.push(item);


    // 5. Set the state to our new copy
    setCurrentEducationDTO({ isEnabled: true, items: items });
  }

  const removeItem = () => {
    let items = [...currentEducationDTO.items];

    items.pop()

    setCurrentEducationDTO({ isEnabled: true, items: items });
  }


  const listEducation = currentEducationDTO.items.map((x, i) => {
    return (
      <>
        <EducationItems educationItem={x} handleChange={handleChange} updateFunc={saveChanges} index={i} removeFunc={removeItem} />
        {i < currentEducationDTO.items.length - 1 ? <Divider /> : ""}
      </>
    )


  });

  return (
    <>
      <IonCard className={styleWidget['overview']}>
        <IonCardHeader>
          <IonGrid>
            <IonRow className="ion-justify-content-between">
              <IonCol><IonCardTitle>Education</IonCardTitle></IonCol>
              <IonCol size="auto"><LinkStyleSpan onClick={(e) => addItem()}>+ Add Education</LinkStyleSpan></IonCol>
            </IonRow>
          </IonGrid>
        </IonCardHeader>
        <IonCardContent>
          {
            listEducation
          }
        </IonCardContent>
      </IonCard>

    </>
  );
};
export default EducationCard;



interface EducationItemProps {
  educationItem: EducationItem;
  handleChange: any;
  index: number;
  mode: string;
}


const MyGrid = styled(IonGrid)`
margin: 10px 20px 10px 20px;
height: 100 %;
`;

const MyTextarea = styled(IonTextarea)`
width: 90 %;
margin-top: 8px;
background: #edf2f7;
box-shadow: 0px 1px 2px rgba(50, 50, 71, 0.08),
  0px 0px 1px rgba(50, 50, 71, 0.2);
border-radius: 6px;
font-size: 13px;
font-weight: 500;
font-stretch: normal;
font-style: normal;
line-height: 1.15;
font-family: 'SF Pro Display';
letter-spacing: normal;
text-align: left;
color: #6b829a;
--padding-bottom: 8px;
--padding-top: 9px;
--padding-end: 16px;
--padding-start: 16px;
--placeholder-color: var(--input - muted - placeholder);
`;

const EducationCardEdit: React.FC<EducationItemProps> = ({ educationItem, handleChange, index, mode }: EducationItemProps) => {


  const handleChangeIndex = (evt: any) => {
    handleChange(evt, index);
  }

  return (

    <MyGrid>
      <IonRow>
        <IonCardTitle>{mode === "edit" ? 'Edit Education' : 'Add new Education'}</IonCardTitle>
      </IonRow>
      <IonRow class="ion-justify-content-start">
        <IonCol size="5">
          <SmallTextInput label="Program / Degree" name="program" value={educationItem.program} onChange={handleChangeIndex} />
        </IonCol>
      </IonRow>
      <IonRow class="ion-justify-content-start">
        <IonCol size="8">
          <SmallTextInput label="University / Institution name" name="institution" value={educationItem.institution} onChange={handleChangeIndex} />
        </IonCol>
      </IonRow>
      <IonRow class="ion-justify-content-start">
        <IonCol size="3.5">
          <SmallTextInput label="Duration" name="start" value={educationItem.start} onChange={handleChangeIndex} />
        </IonCol>
        <IonCol size="3.5">
          <SmallTextInput label="&nbsp;" name="end" value={educationItem.end} onChange={handleChangeIndex} />
        </IonCol>
      </IonRow>
      <IonRow class="ion-justify-content-start">
        <IonCol size="8">
          <IonLabel>Description</IonLabel>
          <MyTextarea rows={3} name="description" value={educationItem.description} onIonChange={handleChangeIndex} />
        </IonCol>
      </IonRow>
    </MyGrid>

  )
}

