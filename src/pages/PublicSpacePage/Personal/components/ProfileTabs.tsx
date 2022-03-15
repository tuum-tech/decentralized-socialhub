import React, { useState } from 'react';
import { IonList, IonLabel, IonItem } from '@ionic/react';

import { TabsContainer } from 'src/components/profile/ProfileComponent/PublicProfileTabs'

interface IProps {
  scrollToPosition: any;
  template: string;
}

const ProfileTabs: React.FC<IProps> = ({
  scrollToPosition,
  template
}: IProps) => {
  const [active, setActive] = useState('about');

  return (
    <TabsContainer template={template}>
      <IonList className="tab-list">
        <IonItem
          className={(active === 'about' ? 'tab-active' : '') + ' tab-item'}
          onClick={() => {
            setActive('about');
            scrollToPosition('about');
          }}
        >
          <IonLabel className="tab-label">About</IonLabel>
        </IonItem>
      </IonList>
    </TabsContainer>
  );
};

export default ProfileTabs;
