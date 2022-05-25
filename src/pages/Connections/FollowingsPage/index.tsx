import React from 'react';

import useSession from 'src/hooks/useSession';
import FollowingSearch from './components/FollowingSearch';

interface Props {
  searchQuery: string;
}

const FollowingsPage: React.FC<Props> = ({ searchQuery }: Props) => {
  const { session } = useSession();

  return <FollowingSearch userSession={session} searchQuery={searchQuery} />;
};

export default FollowingsPage;
