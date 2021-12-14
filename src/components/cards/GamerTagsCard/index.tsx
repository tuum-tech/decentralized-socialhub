import React, { useState, useEffect } from 'react';
import {
  IonButton,
  IonCardTitle,
  IonCol,
  IonGrid,
  IonRow,
  IonItem
} from '@ionic/react';
import { Guid } from 'guid-typescript';
import styled from 'styled-components';

import {
  CardOverview,
  LinkStyleSpan,
  MyModal,
  MODE,
  CardHeaderContent,
  CardContentContainer
} from '../common';

import ProgressBar from 'src/elements/ProgressBar';
import { getThemeData } from 'src/utils/template';

import warcraftIcon from 'src/assets/icon/warcraft.jpg';
import supermarioIcon from 'src/assets/icon/supermario.png';
import candyIcon from 'src/assets/icon/candy.jpeg';
import legendsIcon from 'src/assets/icon/legends.jpeg';
import shieldIcon from 'src/assets/icon/shield.svg';

const icons = {
  warcraft: warcraftIcon,
  supermario: supermarioIcon,
  candy: candyIcon,
  legends: legendsIcon
};

export const Content = styled.div`
  padding: 0px;
  display: inline-grid;
  grid-template-columns: 50% 50%;
`;

export const TagItem = styled(IonItem)<ThemeProps>`
  --inner-padding-bottom: 0;
  --inner-padding-end: 0;
  --inner-padding-start: 0;
  --inner-padding-top: 0;
  --background: transparent !important;

  display: flex;
  justify-content: flex-start;
  border: 0px;
  --inner-border-width: 0;
  padding: 0px !important;

  font-family: 'SF Pro Display';
  font-size: 14px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  text-align: left;
  color: #7a7a9d;

  a {
    color: ${({ template }: ThemeProps) =>
      getThemeData(template, 'card', 'cardTitle1')};
  }

  .left {
    position: relative;
    & > img {
      border-radius: 50%;
    }
  }

  .right {
    margin-left: 10px;
  }

  .gamer-tag-network {
    color: ${({ template }: ThemeProps) =>
      getThemeData(template, 'card', 'cardTitle2')};
    font-size: 16px;
    font-weight: 600;
  }

  .gamer-tag-id {
    color: ${({ template }: ThemeProps) =>
      getThemeData(template, 'card', 'cardTitle3')};
    font-size: 13px;
    font-weight: 400;
  }

  .gamer-tag-badge {
    position: absolute;
    top: 0px;
    right: 0px;
  }
`;
export const GameCard = styled.div`
  background: #ffffff;
  margin: 8px;

  box-shadow: 0px 0px 1px rgba(12, 26, 75, 0.24),
    0px 3px 8px -1px rgba(50, 50, 71, 0.05);
  border-radius: 16px;

  display: flex;
  padding: 30px 20px;
  align-items: center;
  justify-content: space-between;

  .left {
    .title {
      font-weight: bold;
      font-size: 18px;
      line-height: 21px;
      display: flex;
      align-items: center;
      letter-spacing: -0.005em;
      color: #101225;
      margin-bottom: 3px;
    }

    .text {
      font-weight: normal;
      font-size: 14px;
      line-height: 23px;
      font-feature-settings: 'salt' on;
      color: #425466;
      margin-bottom: 11px;
    }

    button {
      background: #edf2f7;
      border-radius: 8px;
      padding: 5px;
      min-width: 100px;

      font-weight: normal;
      font-size: 13px;
      line-height: 162.02%;

      font-feature-settings: 'salt' on;
      color: #4c6fff;
    }
  }
  .right {
    img {
      display: block;
    }
  }
  img {
    border-radius: 50%;
  }
`;
interface IGamerTagProps {
  gamerTagDTO: GamerTagDTO;
  updateFunc?: any;
  isEditable?: boolean;
  isPublicPage?: boolean;
  template?: string;
  userSession: ISessionItem;
  openModal?: boolean;
}

export const defaultGamerTagItem: GamerTagItem = {
  guid: Guid.create(),
  isEmpty: true,
  game: '',
  character: '',
  order: '',
  verifiers: []
};

const GamerTagsCard: React.FC<IGamerTagProps> = ({
  gamerTagDTO,
  updateFunc,
  isEditable = false,
  isPublicPage = false,
  template = 'default',
  userSession,
  openModal = false
}: IGamerTagProps) => {
  const [currentGamerTagDTO, setCurrentGamerTagDTO] = useState(gamerTagDTO);
  const [gamerTagVerifiedPercent, setGamerTagVerifiedPercent] = useState(0);

  useEffect(() => {
    setCurrentGamerTagDTO(gamerTagDTO);
  }, [gamerTagDTO]);

  let noOfVerifiedEduCred = 0;

  for (let i = 0; i < gamerTagDTO.items.length; i++) {
    noOfVerifiedEduCred += (gamerTagDTO.items[i].verifiers || []).length;
  }

  useEffect(() => {
    setGamerTagVerifiedPercent(
      (noOfVerifiedEduCred * 100) / gamerTagDTO.items.length
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentGamerTagDTO, noOfVerifiedEduCred]);

  const [editedItem, setEditedItem] = useState(defaultGamerTagItem);
  const [isEditing, setIsEditing] = useState(openModal);
  const [mode, setMode] = useState<MODE>(MODE.NONE);

  useEffect(() => {
    if (mode !== MODE.NONE) {
      setIsEditing(true);
    }
  }, [mode]);

  const saveChanges = (item: GamerTagItem) => {
    let items = [...currentGamerTagDTO.items];

    let itemToUpdate = items.find(x => x.guid === item.guid);

    if (itemToUpdate === undefined) {
      items.push(item);
    } else {
      let index = items.indexOf(itemToUpdate);
      items[index] = item;
    }

    // 4. Put it back into our array. N.B. we *are* mutating the array here, but that's why we made a copy first

    // 5. Set the state to our new copy
    setCurrentGamerTagDTO({ isEnabled: true, items: items });
    updateFunc(item);
    setIsEditing(false);
  };

  const cancel = () => {
    setMode(MODE.NONE);
    setIsEditing(false);
  };

  const manageItem = () => {
    setMode(MODE.ADD);
    // workaround: defaultGamerTagItem will always have the guid generated when the component is created.
    // We must be generated another guid here or else we will edit the last gamerTag item created.
  };

  if (
    !currentGamerTagDTO.isEnabled ||
    (!isEditable && currentGamerTagDTO.items.length === 0)
  ) {
    return <></>;
  }

  const games = ['warcraft', 'supermario', 'candy', 'legends'];

  return (
    <>
      {gamerTagDTO.isEnabled === true ? (
        <>
          <CardOverview template={template}>
            <CardHeaderContent>
              <IonGrid className="ion-no-padding">
                <IonRow className="ion-justify-content-between ion-no-padding">
                  <IonCol className="ion-no-padding">
                    <IonCardTitle>
                      Gamer Tags
                      {!isEditable && !isPublicPage && (
                        <div
                          style={{
                            width: '10em',
                            float: 'right',
                            fontSize: '0.8em'
                          }}
                        >
                          <ProgressBar
                            value={gamerTagVerifiedPercent}
                            text={'verified'}
                          />
                          <div
                            style={{ float: 'right', fontSize: '0.8em' }}
                          >{`${gamerTagVerifiedPercent}% ${'verified'}`}</div>
                        </div>
                      )}
                    </IonCardTitle>
                  </IonCol>
                  {isEditable ? (
                    <IonCol size="auto" className="ion-no-padding">
                      <LinkStyleSpan onClick={e => manageItem()}>
                        Manage Tags
                      </LinkStyleSpan>
                    </IonCol>
                  ) : (
                    ''
                  )}
                </IonRow>
              </IonGrid>
            </CardHeaderContent>
            <CardContentContainer>
              <IonGrid>
                <IonRow>
                  {currentGamerTagDTO.items.sort(
                    (a: any, b: any) =>
                      new Date(b.start).getTime() - new Date(a.start).getTime()
                  ) &&
                    currentGamerTagDTO.items.map((x, i) => {
                      return (
                        <IonCol size="6">
                          <TagItem template={template}>
                            <div className="left">
                              <img
                                alt="icon"
                                src={(icons as any)[x.game]}
                                height={50}
                              />
                              <img
                                alt="shield icon"
                                src={shieldIcon}
                                className="gamer-tag-badge"
                                height={15}
                              />
                            </div>
                            <div className="right">
                              <p className="gamer-tag-network">{x.game}</p>

                              <span className="gamer-tag-id">
                                {x.character}
                              </span>
                            </div>
                          </TagItem>
                        </IonCol>
                      );
                    })}
                </IonRow>
              </IonGrid>
            </CardContentContainer>
          </CardOverview>
          <MyModal
            onDidDismiss={() => {
              setMode(MODE.NONE);
              setIsEditing(false);
            }}
            isOpen={isEditing}
            cssClass="my-custom-class"
          >
            <div style={{ padding: '15px' }}>
              <IonCardTitle>Manage game tags</IonCardTitle>
              <Content>
                {games.map(t => (
                  <GameCard key={t}>
                    <div className="left">
                      <p className="title">{t}</p>
                      <p className="text">{'aaaa'}</p>
                      <button onClick={() => {}}>+Add</button>
                    </div>
                    <div className="right">
                      <img src={(icons as any)[t]} alt={t} />
                    </div>
                  </GameCard>
                ))}
              </Content>
            </div>
          </MyModal>
        </>
      ) : (
        ''
      )}
    </>
  );
};

export default GamerTagsCard;
