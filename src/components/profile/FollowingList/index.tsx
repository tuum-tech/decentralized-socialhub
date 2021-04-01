import React, { useEffect, useState } from 'react';
import {
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonCardTitle,
  IonCardHeader,
  IonCardContent
} from '@ionic/react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

import {
  IFollowingResponse,
  IFollowingItem,
  ProfileService,
  PublicProfileService,
  IFollowerResponse
} from 'src/services/profile.service';
import { DidService } from 'src/services/did.service';
import { alertError } from 'src/utils/notify';
import styleCards from '../../cards/WidgetCards.module.scss';
import style from './style.module.scss';
export interface IDidDocument {
  id: string;
  publicKey?: PublicKeyEntity[] | null;
  verifiableCredential: VerifiableCredentialEntity[];
  expires: string;
}
export interface PublicKeyEntity {
  id: string;
  type: string;
  controller: string;
}
export interface VerifiableCredentialEntity {
  id: string;
  type?: string[] | null;
  issuer: string;
  issuanceDate: string;
  expirationDate: string;
  credentialSubject: CredentialSubject;
}
export interface CredentialSubject {
  id: string;
  name?: string | null;
  email?: string | null;
  avatar?: string | null;
  birthdate?: string | null;
}

export interface AvatarCredential {
  'content-type': string;
  data: string;
}

interface FollowingsWidgetProps {
  contacts: IFollowingResponse;
  resolveUserFunc: any;
  getLinkFunc: any;
}

const TruncatedSpan = styled.span`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;
  font-family: 'SF Pro Display';
  font-size: 14px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.62;
  letter-spacing: normal;
  text-align: left;
  color: #979797;
`;

const Name = styled.span`
  font-family: 'SF Pro Display';
  font-size: 16px;
  font-weight: 600;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.56;
  letter-spacing: normal;
  text-align: left;
  color: #27272e;
`;

const ViewAll = styled.span`
  flex-grow: 0;
  font-family: 'SF Pro Display';
  font-size: 14px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  text-align: right;
  color: #4c6fff;
`;

const FollowingWidget: React.FC<FollowingsWidgetProps> = ({
  contacts,
  resolveUserFunc,
  getLinkFunc
}: FollowingsWidgetProps) => {
  return (
    <IonCard className={styleCards['overview']}>
      <IonCardHeader>
        <IonGrid>
          <IonRow className="ion-justify-content-between">
            <IonCol size="6">
              <IonCardTitle id="education">
                Following ({contacts.get_following.items.length})
              </IonCardTitle>
            </IonCol>
            <IonCol size="auto">
              <ViewAll>View all</ViewAll>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonCardHeader>
      <IonCardContent>
        <IonGrid className={style['following-widget']}>
          {contacts.get_following.items.map((item: IFollowingItem, index) => (
            <IonRow key={index}>
              <IonCol size="*">
                <img
                  className={style['thumbnail']}
                  src={resolveUserFunc(item.did).image}
                  alt="thumbnail"
                />
              </IonCol>
              <IonCol size="7">
                <Link to={getLinkFunc(item.did)}>
                  <IonGrid>
                    <IonRow>
                      <Name>{resolveUserFunc(item.did).name}</Name>
                    </IonRow>
                    <IonRow>
                      <TruncatedSpan>{item.did}</TruncatedSpan>
                    </IonRow>
                  </IonGrid>
                </Link>
              </IonCol>
              {/* <IonCol size='3'>
                    <IonButton size='small' onClick={() => unfollow(item.did)}>
                      Unfollow
                    </IonButton>
                  </IonCol> */}
            </IonRow>
          ))}
        </IonGrid>
      </IonCardContent>
    </IonCard>
  );
};

const FollowingWidgetError: React.FC<any> = (props: any) => {
  return (
    <IonCard className={styleCards['overview']}>
      <IonCardHeader>
        <IonCardTitle id="education">Following</IonCardTitle>
      </IonCardHeader>
      <IonCardContent>The list of followings is not acessible</IonCardContent>
    </IonCard>
  );
};

export interface IError {
  hasError: boolean;
  errorDescription?: string;
}

interface IProps {
  did: string;
}

const FollowingList: React.FC<IProps> = ({ did }: IProps) => {
  const [listContacts, setListContacts] = useState<IFollowingResponse>({
    get_following: { items: [] }
  });
  const [listFollowers, setListFollowers] = useState<IFollowerResponse>({
    get_followers: { items: [] }
  });
  const [didFollow, setDidFollow] = useState('');
  const [didDocuments, setDidDocuments] = useState<IDidDocument[]>([]);
  const [error, setError] = useState<IError>({ hasError: false });

  const follow = async () => {
    let list: any = await ProfileService.addFollowing(didFollow);
    setListContacts(list);
  };

  const reset = async () => {
    let list: any = await ProfileService.resetFollowing();
    setListContacts(list);
  };

  const resolveUserInfo = (did: string): any => {
    let name: string | null = did;
    let avatar: AvatarCredential | null;
    let image: string = '';
    didDocuments.forEach((didDoc: IDidDocument) => {
      if (didDoc === undefined) return;

      if (did === didDoc.id && didDoc.verifiableCredential !== undefined) {
        didDoc.verifiableCredential.forEach(
          (item: VerifiableCredentialEntity) => {
            if (item.credentialSubject.name !== undefined) {
              name = item.credentialSubject.name;
            }
            if (item.credentialSubject.avatar !== undefined) {
              avatar = (item.credentialSubject
                .avatar as unknown) as AvatarCredential;

              let type = avatar['content-type'];
              image = `data: ${type}; base64, ${avatar.data} `;
            }
          }
        );
      }
    });

    return { name: name, image: image };
  };

  const unfollow = async (did: string) => {
    let list: any = await ProfileService.unfollow(did);
    setListContacts(list);
  };

  const getLink = (did: string) => {
    return '/did/' + did;
  };

  const getFollowersCount = (did: string): string => {
    let val: string = '';
    try {
      if (
        listFollowers.get_followers.items !== undefined &&
        listFollowers.get_followers.items.length > 0
      ) {
        listFollowers.get_followers.items.forEach(item => {
          if (item.did === did) {
            val = item.followers.length.toString();
          }
        });
      }
    } catch (e) {}
    return val;
  };

  const getPage = (error: IError) => {
    if (error.hasError) {
      return <FollowingWidgetError></FollowingWidgetError>;
    } else {
      return (
        <FollowingWidget
          contacts={listContacts}
          resolveUserFunc={resolveUserInfo}
          getLinkFunc={getLink}
        />
      );
    }
  };

  const loadData = async (did: string) => {
    let list: IFollowingResponse;
    try {
      list = await PublicProfileService.getFollowings(did);
    } catch (e) {
      console.log('Could not load users that you follow' + e);
      list = { get_following: { items: [] } };
      // setError({ hasError: true, errorDescription: 'Could not load users that you follow' });
      alertError(null, 'Could not load users that you follow');
    }

    let listDids: string[] = [];
    if (
      list &&
      list.get_following &&
      list.get_following.items &&
      list.get_following.items.length > 0
    ) {
      listDids = list.get_following.items.map(p => p.did);

      if (
        listContacts &&
        listContacts.get_following &&
        listContacts.get_following.items &&
        listContacts.get_following.items.length !==
          list.get_following.items.length
      ) {
        setListContacts(list);
      }
    }

    try {
      let followers = await PublicProfileService.getFollowers(listDids);
      setListFollowers(followers as IFollowerResponse);
    } catch (e) {
      console.log('Could not retrieve your followers: ' + e);
      alertError(null, 'Could not retrieve your followers');
    }

    let docs: IDidDocument[] = [];
    await Promise.all(
      listDids.map(async did => {
        let doc = await DidService.getDidDocument(did);
        docs.push(doc);
      })
    );

    setDidDocuments(docs);
  };

  useEffect(() => {
    (async () => {
      if (did !== '') {
        await loadData(did);
      }
    })();
  }, [listContacts, did]);

  return <div>{getPage(error)}</div>;
};

export default FollowingList;
