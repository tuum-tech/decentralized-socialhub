import React, { useEffect } from 'react';
import styled from 'styled-components';
import Avatar from 'src/components/Avatar';

const FollowContainer = styled.div`
  display: flex;
  align-items: center;
`;
const Wrapper = styled.div`
  margin-right: 5px;
  & img {
    border-radius: 50% !important;
  }
`;
interface Props {
  users: any[];
  cb: (count: number) => void;
}
const Follows: React.FC<Props> = ({ users, cb }) => {
  const wSize = [1780, 1600, 1350, 1120];

  useEffect(() => {
    cb(users.length);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [users]);

  return (
    <FollowContainer>
      {users.slice(0, 5).map((did, index) => {
        return (
          <Wrapper
            style={{
              display: window.innerWidth > wSize[3 - index] ? 'block' : 'none'
            }}
            key={index}
          >
            <Avatar did={did} width="50px" />
          </Wrapper>
        );
      })}
    </FollowContainer>
  );
};

export default Follows;
