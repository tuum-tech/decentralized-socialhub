import React, { useState, useEffect } from 'react';
import { IonRow, IonCol } from '@ionic/react';
import styled from 'styled-components';
import { SearchService } from 'src/services/search.service';
import { getItemsFromData } from 'src/utils/script';
import Avatar from 'src/components/Avatar';
import Card from 'src/elements-v2/Card';

const Name = styled('h1')`
  font-size: 16px !important;
  font-weight: 600;
  line-height: 25px;
  color: #27272e;
`;
const Did = styled('p')`
  font-size: 14px;
  font-weight: 500;
  line-height: 25px;
  color: #a0aec0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

interface IProps {
  profile: any;
}

const Admins: React.FC<IProps> = ({ profile }: IProps) => {
  const [admins, setAdmins] = useState([]);

  useEffect(() => {
    const owners =
      typeof profile.owner === 'string' ? [profile.owner] : profile.owner;

    (async () => {
      let searchServiceLocal: SearchService = await SearchService.getSearchServiceAppOnlyInstance();
      let response: any = await searchServiceLocal.getUsersByDIDs(
        owners,
        200,
        0
      );
      const users = getItemsFromData(response, 'get_users_by_dids');
      setAdmins(users);
    })();
  }, [profile.owner]);

  return (
    <Card title="Admins">
      {admins.map((admin: any, index) => {
        return (
          <IonRow key={index} className="mb-3">
            <IonCol size="auto">
              <Avatar did={admin.did} width="50px" />
            </IonCol>
            <IonCol
              style={{ width: 50, marginLeft: 12 }}
              className="ion-no-padding"
            >
              <Name>{admin.name}</Name>
              <Did>{admin.did}</Did>
            </IonCol>
          </IonRow>
        );
      })}
    </Card>
  );
};

export default Admins;
