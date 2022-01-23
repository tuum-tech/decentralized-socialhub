import React from 'react';

import CreateSpace from './CreateSpace';
interface Props {
  session: ISessionItem;
}
const MySpaces: React.FC<Props> = ({ session }: Props) => {
  return <CreateSpace />;
};

export default MySpaces;
