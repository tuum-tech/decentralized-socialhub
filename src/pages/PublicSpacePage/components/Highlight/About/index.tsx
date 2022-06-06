import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { IonRow } from '@ionic/react';
import styled from 'styled-components';

import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { makeSelectSession } from 'src/store/users/selectors';
import { setSession } from 'src/store/users/actions';
import { InferMappedProps, SubState } from './types';

import { TuumTechScriptService } from 'src/services/script.service';
import { SpaceCategory, SpaceService } from 'src/services/space.service';
import { StyledButton } from 'src/elements/buttons';
import { SpaceAvatar } from 'src/components/Space/SpaceCard';
import {
  CardOverview,
  CardContentContainer
} from 'src/components/cards/common';
import defaultAvatar from 'src/assets/icon/dp.png';
import icon_shield from 'src/assets/icon/shield.svg';
import style from './About.module.scss';
import { showNotify } from 'src/utils/notify';
import { getDIDString } from 'src/utils/did';

export const HorDOMSpace16 = styled(IonRow)`
  padding: 8px 0px;
`;
export const HorDOMSpace20 = styled(IonRow)`
  padding: 10px 0px;
`;

interface IProps extends InferMappedProps {
  space: any;
  template?: string;
}

const AboutSpace: React.FC<IProps> = ({
  space,
  session,
  template = 'default'
}: IProps) => {
  const [followers, setFollowers] = useState<string[]>(space.followers || []);
  const [owners, setOwners] = useState<any[]>([]);
  const following = useMemo(() => followers.includes(session.did), [
    followers,
    session.did
  ]);
  const isExpandable = (space.description || '').length > 250;
  const [isExpanded, setIsExpanded] = useState(!isExpandable);
  const ownerDids =
    space.category === SpaceCategory.Personal
      ? space.owner
        ? [space.owner]
        : []
      : space.owner || [];
  const isOwner = ownerDids.includes(session.did);
  const isLoggedIn = window.localStorage.getItem('isLoggedIn');
  const auth = () => {
    if (!isLoggedIn) {
      showNotify('You should login', 'warning');
      return false;
    }
    return true;
  };

  useEffect(() => {
    (async () => {
      const owners: any[] = await TuumTechScriptService.searchUserWithDIDs(
        ownerDids
      );
      let ownersDids: string[] = [];
      owners.forEach(owner => {
        ownersDids.push(owner.did);
      });
      ownerDids.forEach((did: string) => {
        let shortenedDid = did.replace('did:elastos:', '');
        shortenedDid = `${shortenedDid.substring(
          0,
          4
        )}...${shortenedDid.substring(shortenedDid.length - 4)}`;
        if (!ownersDids.includes(did)) {
          owners.push({
            link: false,
            name: shortenedDid,
            did: shortenedDid
          });
        }
      });
      setOwners(owners.filter(owner => owner && owner.name));
    })();
  }, [ownerDids, space]);

  const onFollow = async () => {
    if (!auth()) return;
    await SpaceService.follow(session, space);
    setFollowers([...new Set([...followers, session.did])]);
  };
  const onUnfollow = async () => {
    if (!auth()) return;
    await SpaceService.unfollow(session, space);
    setFollowers([
      ...new Set(
        followers.filter((follower: string) => follower !== session.did)
      )
    ]);
  };
  return (
    <CardOverview template={template}>
      <CardContentContainer>
        <IonRow>
          <SpaceAvatar>
            <img src={space.avatar || defaultAvatar} height={79} alt="avatar" />
          </SpaceAvatar>
        </IonRow>
        <HorDOMSpace20 />
        <IonRow>
          <div className={style['name']}>
            <h1>
              {space.name}
              <img src={icon_shield} alt={space.name} />
            </h1>
            <h2>
              {/* <DidSnippetSvg /> DID:iYio2....LzNf &nbsp;&nbsp;&nbsp;by{' '} */}
              {owners && owners.length > 0 ? 'by ' : ''}
              {owners.map((owner, index) => {
                return (
                  <span key={index}>
                    {owner.link !== false ? (
                      <Link
                        to={getDIDString('/did/' + owner.did)}
                        target={'blank'}
                      >
                        <span>{owner.name}</span>
                      </Link>
                    ) : (
                      <span>{owner.name}</span>
                    )}
                    {`${
                      index >= owners.length - 2
                        ? index === owners.length - 2
                          ? ' and '
                          : ''
                        : ', '
                    }`}
                  </span>
                );
              })}
            </h2>
          </div>
        </IonRow>
        <IonRow>
          <span>{space.meta?.network}</span>
        </IonRow>
        <HorDOMSpace16 />
        <IonRow>
          <span className={isExpanded ? style['expanded'] : style['collapsed']}>
            {space.description}
          </span>
        </IonRow>
        {isExpandable && (
          <>
            <HorDOMSpace16 />
            <IonRow>
              <span
                className={style['btn-expand']}
                onClick={() => {
                  setIsExpanded(!isExpanded);
                }}
              >
                {isExpanded ? '- Collapse' : '+ Expand'}
              </span>
            </IonRow>
          </>
        )}
        <HorDOMSpace20 />
        <IonRow>
          {!isOwner && (
            <StyledButton
              width={'94px'}
              height={'43px'}
              bgColor={
                'linear-gradient(145.76deg, #995AFF 14.97%, #DC59BF 87.23%)'
              }
              className={'mr-3'}
              disabled={isOwner}
              onClick={following ? onUnfollow : onFollow}
            >
              {following ? `Unfollow` : `Follow`}
            </StyledButton>
          )}
          {/* <StyledButton
            width={'94px'}
            height={'43px'}
            bgColor={
              'linear-gradient(252.79deg, rgba(144, 75, 255, 0.084) -20.69%, rgba(190, 52, 160, 0.092) 151.16%);'
            }
            color={'#995AFF'}
            onClick={() => {}}
          >
            Share
          </StyledButton> */}
        </IonRow>
      </CardContentContainer>
    </CardOverview>
  );
};

export const mapStateToProps = createStructuredSelector<SubState, SubState>({
  session: makeSelectSession()
});

export function mapDispatchToProps(dispatch: any) {
  return {
    eProps: {
      setSession: (props: { session: ISessionItem }) =>
        dispatch(setSession(props))
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(AboutSpace);
