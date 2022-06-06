import React, { useState } from 'react';
import styled from 'styled-components';
import Follows from 'src/components/cards/ProfileBriefCard/Follows';
import ViewAllFollower from 'src/pages/PublicSpacePage/components/MainBoard/common/Modal/ViewAllFollower';
import { CardOverview } from 'src/components/cards/common';
import Icon from 'src/elements-v2/icons';

interface Props {
  title: string;
  space: any;
  exploreAll: () => void;
}

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 10px;
`;

const Prefix = styled.div`
  display: flex;
  flex-direction: column;
  width: 125px;
  color: black;
  & h1 {
    font-style: normal;
    font-weight: 600;
    font-size: 28px;
    line-height: 136.02%;
  }
  & h3 {
    font-style: normal;
    font-weight: 600;
    font-size: 16px;
    line-height: 25px;
  }
`;

const Body = styled.div`
  display: flex;
  align-items: center;

  & > img {
    border-radius: 50%;
    margin: 3px;
  }
`;

const ExploreAll = styled.div`
  margin-left: 10px;
  cursor: pointer;
`;
const Followers: React.FC<Props> = ({ title, space, exploreAll }) => {
  const [itemCount, setItemCount] = useState(0);
  const [showViewAllModal, setShowViewAllModal] = useState(false);
  return (
    <CardOverview template="default">
      <Container>
        <Prefix>
          <h1>{itemCount}</h1>
          <h3>{title}</h3>
        </Prefix>
        <Body>
          <Follows
            users={space.followers}
            cb={count => {
              setItemCount(count);
            }}
          />
          <ExploreAll onClick={() => setShowViewAllModal(true)}>
            <Icon
              name="chevron-forward-circle-outline"
              style={{ width: 25, height: 25 }}
              color="primary"
              onClick={exploreAll}
            />
          </ExploreAll>
        </Body>
      </Container>
      <ViewAllFollower
        isOpen={showViewAllModal}
        space={space}
        onClose={() => {
          setShowViewAllModal(false);
        }}
      />
    </CardOverview>
  );
};

export default Followers;
