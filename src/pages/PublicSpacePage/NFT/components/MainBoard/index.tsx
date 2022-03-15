import React, { useState } from 'react';
import { IonList, IonLabel, IonItem } from '@ionic/react';
import { TabsContainer } from 'src/components/profile/ProfileComponent/PublicProfileTabs';
import Home from './Home';
import Collection from './Collection';
import Community from './Community';
import Chat from './Chat';
import Members from './Members';

interface IProps {}

const MainBoard: React.FC<IProps> = ({}: IProps) => {
  const [active, setActive] = useState('home');
  return (
    <TabsContainer template="default">
      <IonList>
        <IonItem
          className={(active === 'home' ? 'tab-active' : '') + ' tab-item'}
          onClick={() => setActive('home')}
        >
          <IonLabel className="tab-label">Home</IonLabel>
        </IonItem>
        <IonItem
          className={(active === 'chat' ? 'tab-active' : '') + ' tab-item'}
          onClick={() => setActive('chat')}
        >
          <IonLabel className="tab-label">Chat</IonLabel>
        </IonItem>
        <IonItem
          className={(active === 'collection' ? 'tab-active' : '') + ' tab-item'}
          onClick={() => setActive('collection')}
        >
          <IonLabel className="tab-label">NFT Collection</IonLabel>
        </IonItem>
        <IonItem
          className={(active === 'community' ? 'tab-active' : '') + ' tab-item'}
          onClick={() => setActive('community')}
        >
          <IonLabel className="tab-label">Community</IonLabel>
        </IonItem>
        <IonItem
          className={(active === 'members' ? 'tab-active' : '') + ' tab-item'}
          onClick={() => setActive('members')}
        >
          <IonLabel className="tab-label">Members Access</IonLabel>
        </IonItem>
      </IonList>

      {active === 'home' && <Home />}
      {active === 'chat' && <Chat />}
      {active === 'collection' && <Collection />}
      {active === 'community' && <Community />}
      {active === 'members' && <Members />}
    </TabsContainer>
  );
};

export default MainBoard;
