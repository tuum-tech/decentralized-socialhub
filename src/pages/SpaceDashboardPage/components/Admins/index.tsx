import React, { useState, useEffect } from 'react';
import {
  IonRow,
  IonCardTitle
} from '@ionic/react';
import styled from 'styled-components';
import {
  CardOverview,
  CardHeaderContent,
  CardContentContainer
} from 'src/components/cards/common';
import { SearchService } from 'src/services/search.service';
import { getItemsFromData } from 'src/utils/script';
import Avatar from 'src/components/Avatar';

const Row = styled(IonRow)`
  display: flex;
  justify-content: flex-start;
  margin-bottom: 20px;
`;
const Details = styled('div')`
  margin-left: 13px;
`;
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
`;

interface IProps {
  profile: any;
}

const Admins: React.FC<IProps> = ({ profile }: IProps) => {
  const owners =
    typeof profile.owner === 'string' ? [profile.owner] : profile.owner;
  const [admins, setAdmins] = useState([]);
  useEffect(() => {
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
  }, [owners]);
  return (
    <CardOverview template={'default'}>
      <CardHeaderContent>
        <IonCardTitle>Admins</IonCardTitle>
      </CardHeaderContent>
      <CardContentContainer>
        {admins.map((admin: any, index) => {
          return (
            <Row key={index}>
              <Avatar did={admin.did} width="50px" />
              <Details>
                <Name>{admin.name}</Name>
                <Did>{admin.did}</Did>
              </Details>
            </Row>
          );
        })}
      </CardContentContainer>
    </CardOverview>
  );
};

export default Admins;
