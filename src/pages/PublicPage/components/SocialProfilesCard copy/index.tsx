import React, { useState, useEffect } from 'react';

import SocialProfilesCard from 'src/components/cards/SocialProfilesCard';

interface Props {
  didDocument: any;
  sessionItem: ISessionItem;
}

interface VerifiedCredential {
  value: string;
  isVerified: boolean;
}

const SocialProfiles: React.FC<Props> = ({ didDocument, sessionItem }) => {
  const [embededSocialProfiles, setEmbededSocialedProfiles] = useState<
    string[]
  >([]);

  const getVerifiedCredential = (
    id: string
  ): VerifiedCredential | undefined => {
    if (
      !didDocument ||
      !didDocument['id'] ||
      !didDocument['verifiableCredential']
    )
      return;
    let vcs: any[] = didDocument['verifiableCredential'].map((vc: any) => {
      if (`${vc['id']}`.endsWith(`#${id.toLowerCase()}`)) {
        let types: string[] = vc['type'];
        return {
          value: vc['credentialSubject'][id.toLowerCase()],
          isVerified: !types.includes('SelfProclaimedCredential')
        };
      }
    });
    vcs = vcs.filter(item => {
      return item !== undefined;
    });
    if (vcs && vcs.length > 0) return vcs[0];
    return;
  };

  useEffect(() => {
    const ids = ['linkedin', 'twitter', 'facebook', 'google'];
    const embededSocialProfiles = [];
    for (let i = 0; i < ids.length; i++) {
      if (getVerifiedCredential(ids[i])) {
        embededSocialProfiles.push(ids[i]);
      }
    }
    setEmbededSocialedProfiles(embededSocialProfiles);
  }, []);

  if (embededSocialProfiles.length > 0) {
    return (
      <SocialProfilesCard
        diddocument={didDocument}
        showManageButton={false}
        sessionItem={sessionItem}
      />
    );
  }
  return <></>;
};

export default SocialProfiles;
