import React, { useEffect, useState } from 'react';

import {
  IFollowingResponse,
  PublicProfileService
} from 'src/services/profile.service';

import FollowingWidget from './FollowingWidget';
interface IDidDocument {
  id: string;
  publicKey?: PublicKeyEntity[] | null;
  verifiableCredential: VerifiableCredentialEntity[];
  expires: string;
}
interface PublicKeyEntity {
  id: string;
  type: string;
  controller: string;
}
interface VerifiableCredentialEntity {
  id: string;
  type?: string[] | null;
  issuer: string;
  issuanceDate: string;
  expirationDate: string;
  credentialSubject: CredentialSubject;
}
interface CredentialSubject {
  id: string;
  name?: string | null;
  email?: string | null;
  avatar?: string | null;
  birthdate?: string | null;
}

interface AvatarCredential {
  'content-type': string;
  data: string;
}

interface IProps {
  did: string;
}

const FollowingList: React.FC<IProps> = ({ did }: IProps) => {
  const [listContacts, setListContacts] = useState<IFollowingResponse>({
    get_following: { items: [] }
  });

  const [didDocuments, setDidDocuments] = useState<IDidDocument[]>([]);

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

  const getLink = (did: string) => {
    return '/did/' + did;
  };

  const loadData = async (did: string) => {
    let list: IFollowingResponse = await PublicProfileService.getFollowings(
      did
    );
    if (
      list &&
      list.get_following &&
      list.get_following.items &&
      list.get_following.items.length > 0
    ) {
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
  };

  useEffect(() => {
    (async () => {
      if (did !== '') {
        await loadData(did);
      }
    })();
  }, [listContacts, did]);

  return (
    <FollowingWidget
      contacts={listContacts}
      resolveUserFunc={resolveUserInfo}
      getLinkFunc={getLink}
    />
  );
};

export default FollowingList;
