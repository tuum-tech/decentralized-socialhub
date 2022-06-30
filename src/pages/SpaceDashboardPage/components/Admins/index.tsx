import React, { useEffect, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IonRow, IonCol } from '@ionic/react';
import styled from 'styled-components';
import Avatar from 'src/components/Avatar';
import Card from 'src/elements-v2/Card';
import { getUsersByDid as getUsersByDidAction } from 'src/store/users/actions';
import { selectAllUsers } from 'src/store/users/selectors';

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
  const dispatch = useDispatch();
  const owners = useMemo(
    () => (typeof profile.owner === 'string' ? [profile.owner] : profile.owner),
    [profile.owner]
  );
  const users = useSelector(selectAllUsers);
  const admins = useMemo(
    () => users.filter(user => owners.includes(user.did)),
    [owners, users]
  );

  const getUsersByDid = useCallback(
    (ids, limit, offset) => {
      dispatch(getUsersByDidAction(ids, limit, offset));
    },
    [dispatch]
  );

  useEffect(() => {
    getUsersByDid(owners, 200, 0);
  }, [getUsersByDid, owners]);

  return (
    <Card template="default" title="Admins">
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
