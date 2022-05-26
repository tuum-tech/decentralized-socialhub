import React from 'react';

import useSession from 'src/hooks/useSession';
import FollowersSearch from './components/FollowersSearch';

interface Props {
  searchQuery: string;
}

const MutualFollowersPage: React.FC<Props> = ({ searchQuery }: Props) => {
  const { session } = useSession();

  return <FollowersSearch userSession={session} searchQuery={searchQuery} />;
};

export default MutualFollowersPage;
