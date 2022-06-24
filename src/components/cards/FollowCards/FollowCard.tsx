import React from 'react';
import { IonGrid, IonRow, IonCol } from '@ionic/react';
import { Link } from 'react-router-dom';
import ReactTooltip from 'react-tooltip';

import Card from 'src/elements-v2/Card';
import Avatar from '../../Avatar';
import { LinkStyleSpan } from '../common';
import style from './style.module.scss';

interface FollowCardProps {
  users: ISessionItem[];
  getLinkFunc: any;
  viewAllClicked: () => void;
  template: string;
  title: string;
}

const FollowCard: React.FC<FollowCardProps> = ({
  users,
  getLinkFunc,
  viewAllClicked,
  template,
  title
}: FollowCardProps) => {
  return (
    <Card
      template={template}
      title={title}
      action={
        <IonCol size="auto" className="ion-no-padding">
          <LinkStyleSpan onClick={viewAllClicked}>View All</LinkStyleSpan>
        </IonCol>
      }
    >
      <IonGrid className={style['following-widget']}>
        <IonRow style={{ paddingLeft: '-5px', paddingRight: '-5px' }}>
          {users.map((user: any, index) => (
            <IonCol
              key={user.did}
              size="2"
              style={{ paddingLeft: '2.5px', paddingRight: '2.5px' }}
            >
              <Link
                to={getLinkFunc(user.did)}
                data-for={user.did}
                data-tip={`name: ${user.name} <br/> did: ${user.did}`}
                data-iscapture="true"
              >
                <Avatar did={user.did} width="50px" />
              </Link>
              <ReactTooltip id={user.did} multiline={true} />
            </IonCol>
          ))}
        </IonRow>
      </IonGrid>
    </Card>
  );
};

export default FollowCard;
