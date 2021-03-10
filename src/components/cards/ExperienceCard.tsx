import React, { useState } from 'react';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonCheckbox,
  IonCol,
  IonFooter,
  IonGrid,
  IonLabel,
  IonModal,
  IonPopover,
  IonRow,
  IonTextarea,
} from '@ionic/react';
import styleWidget from '../cards/WidgetCards.module.scss';
import { ExperienceItem, ExperienceDTO } from 'src/pages/PublicPage/types';
import styled from 'styled-components';
import SmallTextInput from '../inputs/SmallTextInput';




interface IProps {
  experiences: ExperienceDTO
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
const Divider = styled.hr`
width: 100%;
height: 1px;
text-align: center;
margin-top: 1.5em;
margin-bottom: 1.5em;
background-color: #f7fafc;;
`;

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

const MyModal = styled(IonModal)`
--border-radius: 16px;
--min-height: 200px;
--height: 480px;
--width: 560px;
`;

const TreeDotsButton = styled.div`
writing-mode: vertical-rl;
text-orientation: mixed;
line-height: 0.5;
margin: 1px 3px 2px 7px;
padding: 5px 3px 5px 10px;
border-radius: 22px;
font-weight: bold;
background-color: rgba(221, 221, 221, 0.24);
color: #000;
`;

const PopoverMenuItem = styled.div`
  display: block;
  font-family: 'SF Pro Display';
  padding: 10px 10px 10px 20px;
  font-size: 14px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: -0.07px;
  text-align: left;
  color: #000;
  cursor: pointer;
`;

interface ExperienceItemsProps {
  experienceItem: ExperienceItem;
  handleChange: any;
  updateFunc: any;
  index: number;
  initialStatus?: string;
  removeFunc: any;
  mode: string;
}

const ExperienceItems: React.FC<ExperienceItemsProps> = ({ experienceItem, handleChange, updateFunc, index, removeFunc, mode }) => {

  const [editMode, setEditMode] = useState(experienceItem.isEmpty ? 'add' : 'readonly');
  const [popoverState, setShowPopover] = useState({ showPopover: false, event: undefined });

  const cancel = () => {
    if (editMode === 'add')
      removeFunc();

    setEditMode("readonly");
  }
  const remove = () => {
    removeFunc(index);

  }

  return (
    <>
      <IonGrid>
        <IonRow className="ion-justify-content-between">

          <IonCol size="2">
            image
      </IonCol>
          <IonCol size="9">
            <IonGrid>
              <IonRow><Institution>{experienceItem.institution}</Institution></IonRow>
              <IonRow><Program>{experienceItem.title}</Program></IonRow>
              <IonRow><Period>{experienceItem.start} - {experienceItem.end}</Period></IonRow>
              <IonRow><Description>{experienceItem.description}</Description></IonRow>
            </IonGrid>
          </IonCol>
          {mode === "edit" ?
            <IonCol size="auto">
              <IonPopover
                showBackdrop={false}
                cssClass={styleWidget['popover-class']}
                event={popoverState.event}
                isOpen={popoverState.showPopover}
                onDidDismiss={() => setShowPopover({ showPopover: false, event: undefined })}
              >
                <PopoverMenuItem onClick={(e) => { setShowPopover({ showPopover: false, event: undefined }); setEditMode("edit") }}>Edit</PopoverMenuItem>
                <PopoverMenuItem onClick={() => { setShowPopover({ showPopover: false, event: undefined }); remove(); }}>Remove</PopoverMenuItem>
              </IonPopover>
              <TreeDotsButton onClick={
                (e: any) => {
                  e.persist();
                  setShowPopover({ showPopover: true, event: e })
                }}
              >
                ...
              </TreeDotsButton>

            </IonCol>
            : ""
          }
        </IonRow>
      </IonGrid>
      <MyModal isOpen={editMode === 'add' || editMode === 'edit'} cssClass='my-custom-class'>
        <ExperienceCardEdit experienceItem={experienceItem} handleChange={handleChange} index={index} mode={editMode} />
        <ModalFooter className="ion-no-border">
          <IonRow className="ion-justify-content-around">
            <IonCol size="auto" >
              <IonButton fill="outline" onClick={cancel}>Cancel</IonButton>
              <IonButton onClick={() => { updateFunc(index); setEditMode("readonly") }}>
                {
                  editMode === 'add' ? "Add new Experience" : "Edit Experience"
                }
              </IonButton>
            </IonCol>
          </IonRow>
        </ModalFooter>
      </MyModal>
    </>
  );
}

interface IExperienceProps {
  experienceDTO: ExperienceDTO;
  updateFunc?: any;
  mode: string;
}
const ExperienceCard: React.FC<IExperienceProps> = ({ experienceDTO, updateFunc, mode }: IExperienceProps) => {

  const [currentExperienceDTO, setcurrentExperienceDTO] = useState(experienceDTO);

  const handleChange = (evt: any, index: number) => {
    debugger;
    // console.log("name: " + evt.target.name);
    // console.log("value: " + evt.target.value);
    // console.log("index: " + index);


    // 1. Make a shallow copy of the items
    let items = [...currentExperienceDTO.items];

    let item = {
      ...items[index],
      [evt.target.name]: evt.target.value
    }
    // 4. Put it back into our array. N.B. we *are* mutating the array here, but that's why we made a copy first
    items[index] = item;


    // 5. Set the state to our new copy
    setcurrentExperienceDTO({ isEnabled: true, items: items });
  }

  const saveChanges = (index: number) => {

    console.log("saving changes");
    updateFunc(currentExperienceDTO.items[index]);
  }

  const addItem = () => {

    console.log("adding item");

    // 1. Make a shallow copy of the items
    let items = [...currentExperienceDTO.items];

    let item: ExperienceItem = {
      _id: "",
      description: "",
      isEnabled: true,
      institution: "",
      program: "",
      start: "",
      end: "",
      title: "",
      order: "",
      isEmpty: true
    }
    // 4. Put it back into our array. N.B. we *are* mutating the array here, but that's why we made a copy first
    items.push(item);


    // 5. Set the state to our new copy
    setcurrentExperienceDTO({ isEnabled: true, items: items });
  }

  const removeItem = () => {
    let items = [...currentExperienceDTO.items];

    items.pop()

    setcurrentExperienceDTO({ isEnabled: true, items: items });
  }


  const listExperiences = currentExperienceDTO.items.map((x, i) => {
    return (
      <div key={i}>
        <ExperienceItems experienceItem={x} handleChange={handleChange} updateFunc={saveChanges} index={i} removeFunc={removeItem} mode={mode} />
        {i < currentExperienceDTO.items.length - 1 ? <Divider /> : ""}
      </div>
    )


  });

  return (
    <>
      { experienceDTO.isEnabled === true ?
        <IonCard className={styleWidget['overview']}>
          <IonCardHeader>
            <IonGrid>
              <IonRow className="ion-justify-content-between">
                <IonCol><IonCardTitle>Experience</IonCardTitle></IonCol>
                {mode === "edit" ? <IonCol size="auto"><LinkStyleSpan onClick={(e) => addItem()}>+ Add Experience</LinkStyleSpan></IonCol> : ""}
              </IonRow>
            </IonGrid>
          </IonCardHeader>
          <IonCardContent>
            {
              listExperiences
            }
          </IonCardContent>
        </IonCard>
        : ""}
    </>
  );
};

export default ExperienceCard;


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

const ModalFooter = styled(IonFooter)`
padding:12px;

`;

interface ExperienceItemProps {
  experienceItem: ExperienceItem;
  handleChange: any;
  index: number;
  mode: string;
}


const ExperienceCardEdit: React.FC<ExperienceItemProps> = ({ experienceItem, handleChange, index, mode }: ExperienceItemProps) => {


  const handleChangeIndex = (evt: any) => {
    handleChange(evt, index);
  }

  return (

    <MyGrid>
      <IonRow>
        <IonCardTitle>{mode === "edit" ? 'Edit Experience' : 'Add new Experience'}</IonCardTitle>
      </IonRow>
      <IonRow class="ion-justify-content-start">
        <IonCol size="5">
          <SmallTextInput placeholder="e.g. Blockchain developer" label="Title" name="title" value={experienceItem.title} onChange={handleChangeIndex} />
        </IonCol>
      </IonRow>
      <IonRow class="ion-justify-content-start">
        <IonCol size="8">
          <SmallTextInput placeholder="Google, Elastos Foundation, ..." label="Organization Name" name="institution" value={experienceItem.institution} onChange={handleChangeIndex} />
        </IonCol>
      </IonRow>
      <IonRow class="ion-justify-content-start">
        <IonCol size="4.5">
          <SmallTextInput placeholder="start" label="Duration" name="start" type="date" value={experienceItem.start} onChange={handleChangeIndex} />
        </IonCol>
        <IonCol size="4.5">
          <SmallTextInput placeholder="end" label="&nbsp;" name="end" type="date" value={experienceItem.end} onChange={handleChangeIndex} />

        </IonCol>
        <IonCol size="auto" class="ion-align-self-end">
          <IonCheckbox onIonChange={handleChangeIndex} />
        </IonCol>
      </IonRow>
      <IonRow class="ion-justify-content-start">
        <IonCol size="8">
          <IonLabel>Description</IonLabel>
          <MyTextarea placeholder="..." rows={3} name="description" value={experienceItem.description} onIonChange={handleChangeIndex} />
        </IonCol>
      </IonRow>
    </MyGrid>

  )
}
