import React, { useEffect, useState } from 'react';
import { IonList, IonLabel, IonItem } from '@ionic/react';
import styled from 'styled-components';
import { TabsContainer } from 'src/components/profile/ProfileComponent/PublicProfileTabs';
import GradientText from 'src/elements-v2/buttons/GradientText';
import Home from './Home';
import Collection from './Collection';
import Community from './Community';
import Chat from './Chat';
import Members from './Members';
import icon_lock_gray from 'src/assets/space/lock_gray.svg';
import icon_lock_color from 'src/assets/space/lock_color.svg';
import { SpaceCategory } from 'src/services/space.service';

const TabLabel = styled(GradientText)`
  font-family: 'SF Pro Display';
  margin-top: 0px !important;
  margin-bottom: 0px !important;
  margin-left: 10px;
  font-size: 15px;
  display: flex;
  align-items: center;
`;
interface IProps {
  space: any;
  session: ISessionItem;
  renderSignal: any;
}

const MainBoard: React.FC<IProps> = ({
  space,
  session,
  renderSignal
}: IProps) => {
  const [active, setActive] = useState('home');
  const isNFTSpace = space?.category === SpaceCategory.NFT;
  useEffect(() => {
    setActive(renderSignal.tab);
  }, [renderSignal]);
  return (
    <TabsContainer template="default">
      <IonList>
        <IonItem
          className={(active === 'home' ? 'tab-active' : '') + ' tab-item'}
          onClick={() => setActive('home')}
        >
          {active === 'home' ? (
            <TabLabel>Home</TabLabel>
          ) : (
            <IonLabel className="tab-label">Home</IonLabel>
          )}
        </IonItem>
        <IonItem
          className={(active === 'chat' ? 'tab-active' : '') + ' tab-item'}
          onClick={() => setActive('chat')}
        >
          {active === 'chat' ? (
            <TabLabel>
              Chat
              <img src={icon_lock_color} alt="icon_lock_color" />
            </TabLabel>
          ) : (
            <IonLabel className="tab-label">
              Chat
              <img src={icon_lock_gray} alt="icon_lock_gray" />
            </IonLabel>
          )}
        </IonItem>
        {isNFTSpace && (
          <IonItem
            className={
              (active === 'collection' ? 'tab-active' : '') + ' tab-item'
            }
            onClick={() => setActive('collection')}
          >
            {active === 'collection' ? (
              <TabLabel>NFT Collection</TabLabel>
            ) : (
              <IonLabel className="tab-label">NFT Collection</IonLabel>
            )}
          </IonItem>
        )}
        {/* <IonItem
          className={(active === 'community' ? 'tab-active' : '') + ' tab-item'}
          onClick={() => setActive('community')}
        >
          {active === 'community' ? (
            <TabLabel>
              Community
              <img src={icon_lock_color} alt="icon_lock_color" />
            </TabLabel>
          ) : (
            <IonLabel className="tab-label">
              Community
              <img src={icon_lock_gray} alt="icon_lock_gray" />
            </IonLabel>
          )}
        </IonItem> */}
        <IonItem
          className={(active === 'members' ? 'tab-active' : '') + ' tab-item'}
          onClick={() => setActive('members')}
        >
          {active === 'members' ? (
            <TabLabel>
              Member Access
              <img src={icon_lock_color} alt="icon_lock_color" />
            </TabLabel>
          ) : (
            <IonLabel className="tab-label">
              Member Access
              <img src={icon_lock_gray} alt="icon_lock_gray" />
            </IonLabel>
          )}
        </IonItem>
      </IonList>

      {active === 'home' && <Home space={space} session={session} />}
      {/* {active === 'chat' && <Chat />} */}
      {isNFTSpace && active === 'collection' && <Collection space={space} />}
      {/* {active === 'community' && <Community space={space} />} */}
      {/* {active === 'members' && <Members space={space} />} */}
    </TabsContainer>
  );
};

export default MainBoard;
