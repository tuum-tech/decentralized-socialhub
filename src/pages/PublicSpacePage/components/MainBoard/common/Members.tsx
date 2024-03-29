import React, { useEffect, useState, useMemo } from 'react';
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
import { SpaceCategory } from 'src/services/space.service';
interface IProps {
  template?: string;
  space: any;
}

const Members: React.FC<IProps> = ({ space, template = 'default' }: IProps) => {
  const isNFTSpace = useMemo(() => space.category === SpaceCategory.NFT, [
    space.category
  ]);
  const [showViewAllModal, setShowViewAllModal] = useState(false);
  const [firstIV, setFirstIV] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState(0);

  const membersForNFTSpace = async () => {
    const { data }: any = await getNFTCollectionOwners(space.guid, 0, 4);
    if (!data) return [];
    const { totalCount, owners } = data;
    setTotalCount(totalCount || 0);
    const members = await getOwners(
      owners || [],
      space.meta?.network || 'Elastos Smart Contract Chain'
    );
    return members;
  };
  const membersForNonNFTSpace = async () => {
    return [];
  };

  useEffect(() => {
    (async () => {
      if (space.guid) {
        setFirstIV(
          isNFTSpace
            ? await membersForNFTSpace()
            : await membersForNonNFTSpace()
        );
      }
    })();
  }, [space.guid, isNFTSpace]);

  return (
    <>
      <CardOverview template={template}>
        <CardHeaderContent>
          <IonRow className="ion-justify-content-between ion-no-padding">
            <IonCol className="ion-no-padding">
              <IonCardTitle>
                Members ({isNFTSpace ? totalCount : 'Coming soon'})
              </IonCardTitle>
            </IonCol>
            <IonCol size="auto" className="ion-no-padding">
              <LinkStyleSpan
                style={{ opacity: totalCount && isNFTSpace ? 1 : 0.5 }}
                onClick={() => {
                  totalCount && isNFTSpace && setShowViewAllModal(true);
                }}
              >
                View all
              </LinkStyleSpan>
            </IonCol>
          </IonRow>
        </CardHeaderContent>
        <CardContentContainer>
          {totalCount > 0
            ? firstIV.map((member: any, index: number) => {
                const isProfileUser = typeof member === 'object';
                if (!member) return <></>;
                return (
                  <IonRow className={style['row']} key={index}>
                    <div className={style['avatar']}>
                      {isProfileUser ? (
                        <Avatar did={member.did} width="40px" />
                      ) : (
                        <img src={nft_item_icon} alt={member.name} />
                      )}
                      <img src={welcome_badge} alt="welcome badge" />
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
              })
            : `No members yet`}
        </CardContentContainer>
      </CardOverview>
      <ViewAllMember
        space={space}
        isOpen={showViewAllModal}
        onClose={() => {
          setShowViewAllModal(false);
        }}
      />
    </>
  );
};

export default Members;
