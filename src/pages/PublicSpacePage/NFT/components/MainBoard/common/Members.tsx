import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { IonRow, IonCol, IonCardTitle } from '@ionic/react';
import {
  CardOverview,
  CardHeaderContent,
  CardContentContainer
} from 'src/components/cards/common';
import { LinkStyleSpan } from '../common';
import Avatar from 'src/components/Avatar';
import ViewAllMember from './Modal/ViewAllMember';
import nft_item_icon from 'src/assets/space/nft_item.jpg';
import welcome_badge from 'src/assets/space/welcome_badge.svg';
import style from './style.module.scss';
import { getNFTCollectionOwners } from '../../../fetchapi';
import { shortenAddress } from 'src/utils/web3';
import { getDIDString } from 'src/utils/did';
import { getOwners } from 'src/utils/nftcollection';
interface IProps {
  template?: string;
  space: any;
}

const Members: React.FC<IProps> = ({ space, template = 'default' }: IProps) => {
  const [showViewAllModal, setShowViewAllModal] = useState(false);
  const [firstIV, setFirstIV] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  useEffect(() => {
    (async () => {
      if (space && space.guid) {
        const { data }: any = await getNFTCollectionOwners(space.guid, 0, 4);
        const { totalCount, owners } = data;
        setTotalCount(totalCount);
        const members = await getOwners(
          owners.map((owner: string) => ({ owner })),
          space.meta.network || 'Elastos Smart Contract Chain'
        );
        setFirstIV(members);
      }
    })();
  }, [space]);
  return (
    <>
      <CardOverview template={template}>
        <CardHeaderContent>
          <IonRow className="ion-justify-content-between ion-no-padding">
            <IonCol className="ion-no-padding">
              <IonCardTitle>Members ({totalCount})</IonCardTitle>
            </IonCol>
            <IonCol size="auto" className="ion-no-padding">
              <LinkStyleSpan
                onClick={() => {
                  setShowViewAllModal(true);
                }}
              >
                View all
              </LinkStyleSpan>
            </IonCol>
          </IonRow>
        </CardHeaderContent>
        <CardContentContainer>
          {firstIV.map((member: any, index: number) => {
            const isProfileUser = typeof member === 'object';
            return (
              <IonRow className={style['row']} key={index}>
                <div className={style['avatar']}>
                  {isProfileUser ? (
                    <Avatar did={member.did} width="40px" />
                  ) : (
                    <img src={nft_item_icon} />
                  )}
                  <img src={welcome_badge} />
                </div>
                {isProfileUser ? (
                  <Link
                    to={getDIDString('/did/' + member.did)}
                    target={'blank'}
                  >
                    <span className={style['name']}>{member.name}</span>
                  </Link>
                ) : (
                  <span className={style['name']}>
                    {shortenAddress(member)}
                  </span>
                )}
              </IonRow>
            );
          })}
        </CardContentContainer>
      </CardOverview>
      {showViewAllModal && (
        <ViewAllMember
          space={space}
          onClose={() => {
            setShowViewAllModal(false);
          }}
        />
      )}
    </>
  );
};

export default Members;
