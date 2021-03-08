import React from 'react';
import { IonItem, IonList } from '@ionic/react';
import style from './DidCard.module.scss';
import SkeletonAvatar from '../avatars/SkeletonAvatar';

interface Props {
  name?: string;
  did: string;
  avatar?: string;
  indexItem?: number;
  colSize?: string;
}

const DidCard: React.FC<Props> = ({
  name,
  did = '',
  avatar,
  indexItem,
  colSize = '100%',
}) => {
  return (
    <IonList
      className={style['did']}
      style={{ width: colSize, display: 'inline-block' }}
      key={indexItem}
    >
      <IonItem className={style['badge-item']}>
        <div>
          <SkeletonAvatar />
          <img
            src={avatar}
            width='80'
            height='80'
            className={style['clip-avatar-svg']}
          />
        </div>
        <div className={style['card-data']}>
          <span className={style['name-value']}>{name}</span>
          <span className={style['did-value']}>
            {'DID:' + did.replace('did:elastos:', '')}
          </span>
        </div>
        <div className={style['card-link']}>
          <span className={style['card-link-inner']}>+Follow</span>
        </div>
      </IonItem>
    </IonList>
  );
};

export default DidCard;
