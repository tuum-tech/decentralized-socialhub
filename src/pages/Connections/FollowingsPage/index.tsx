import React from 'react';

import useSession from 'src/hooks/useSession';
import FollowingSearch from './components/FollowingSearch';

const FollowingsPage: React.FC = () => {
  const { session } = useSession();

  return <FollowingSearch userSession={session} />;
};

export default FollowingsPage;
