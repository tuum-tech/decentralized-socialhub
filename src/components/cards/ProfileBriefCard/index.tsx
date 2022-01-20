import React, { useState } from 'react';
import styled from 'styled-components';
import Badges from './Badges';
import Socials from './Socials';
import Follows from './Follows';

import exploreIcon from 'src/assets/icon/explore_all.svg';

import { CardOverview } from '../common';

interface Props {
  category: string;
  title: string;
  data: any;
  exploreAll: () => void;
}

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 20px;
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
const ProfileBriefCard: React.FC<Props> = ({
  category,
  title,
  data,
  exploreAll
}) => {
  const [itemCount, setItemCount] = useState(0);
  const renderContent = () => {
    let content = <></>;
    if (category === 'social') {
      content = (
        <Socials
          diddocument={data}
          cb={count => {
            setItemCount(count);
          }}
        />
      );
    } else if (
      category === 'follower' ||
      category === 'following' ||
      category === 'mutual'
    ) {
      content = (
        <Follows
          users={data}
          cb={count => {
            setItemCount(count);
          }}
        />
      );
    } else if (category === 'badge') {
      content = (
        <Badges
          badges={data}
          cb={count => {
            setItemCount(count);
          }}
        />
      );
    } else if (category === 'requests') {
      content = <>0</>;
    } else {
    }
    return content;
  };
  return (
    <CardOverview template="default">
      <Container>
        <Prefix>
          <h1>{itemCount}</h1>
          <h3>{title}</h3>
        </Prefix>
        <Body>
          {renderContent()}
          <ExploreAll>
            <img
              alt="icon"
              src={exploreIcon}
              height={25}
              onClick={exploreAll}
            />
          </ExploreAll>
        </Body>
      </Container>
    </CardOverview>
  );
};

export default ProfileBriefCard;
