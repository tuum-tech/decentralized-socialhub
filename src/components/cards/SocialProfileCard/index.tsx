import React from 'react';

import useSession from 'src/hooks/useSession';
import SocialCard from './SocialCard';

interface Props {
  targetUser?: ISessionItem;
  setSession: (props: { session: ISessionItem }) => void;
  mode?: string;
  openModal?: boolean;
}

const SocialProfiles: React.FC<Props> = (props: Props) => {
  const { session } = useSession();
  const user = props.targetUser ? props.targetUser : session;

  return (
    <SocialCard
      sessionItem={user}
      setSession={props.setSession}
      mode={props.mode}
      openModal={props.openModal}
    />
  );
};

export default SocialProfiles;
