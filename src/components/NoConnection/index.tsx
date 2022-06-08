import React from 'react';
import styled from 'styled-components';
import { IonCard } from '@ionic/react';
import { useHistory } from 'react-router-dom';

import noFollwersImg from 'src/assets/noconnect/followers.svg';
import noFollwingsImg from 'src/assets/noconnect/followings.svg';
import noMutalsImg from 'src/assets/noconnect/mutals.svg';

interface Props {
  pageType?: string;
}

const Container = styled(IonCard)`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  padding: 185px 20px;
  background: #ffffff;
  box-shadow: 0px 0px 1px rgba(12, 26, 75, 0.24),
    0px 3px 8px -1px rgba(50, 50, 71, 0.05);
  border-radius: 16px;

  img {
    width: 162px;
  }

  color: #27272e;

  .title {
    margin-top: 34px;
    margin-bottom: 10px;

    font-style: normal;
    font-weight: 600;
    font-size: 20px;
    line-height: 136.52%;
    text-align: center;
  }

  .text {
    margin-bottom: 32px;

    font-family: SF Pro Display;
    font-style: normal;
    font-weight: normal;
    font-size: 16px;
    line-height: 162.02%;
    text-align: center;

    max-width: 246px;
  }

  .btn {
    border: 1px solid #4c6fff;
    box-sizing: border-box;
    border-radius: 8px;
    padding: 4px 20px;

    font-style: normal;
    font-weight: 600;
    font-size: 13px;
    line-height: 25px;
    text-align: center;

    color: #4c6fff;
  }
`;

const NoConnectionComp: React.FC<Props> = ({ pageType = 'followers' }) => {
  const history = useHistory();

  const redirectToExplore = () => {
    history.push('/explore');
  };

  if (pageType === 'followers') {
    return (
      <Container>
        <img src={noFollwersImg} alt="no followers" />
        <p className="title">No Followers Yet</p>
        <p className="text">
          This is where you'll find your followers & admirers.
        </p>
      </Container>
    );
  } else if (pageType === 'followingPeople') {
    return (
      <Container>
        <img src={noFollwingsImg} alt="no following" />
        <p className="title">No Followings</p>
        <p className="text">You are not following anyone yet</p>
        <button className="btn" onClick={redirectToExplore}>
          Start exploring profiles
        </button>
      </Container>
    );
  } else if (pageType === 'followingPages') {
    return (
      <Container>
        <img src={noFollwingsImg} alt="no following" />
        <p className="title">No Followings</p>
        <p className="text">You are not following any pages yet</p>
        <button className="btn" onClick={redirectToExplore}>
          Start exploring profiles
        </button>
      </Container>
    );
  }

  return (
    <Container>
      <img src={noMutalsImg} alt="no mutuals" />
      <p className="title">Mutual Followers</p>
      <p className="text">People you follow and they follow you back.</p>
      <button className="btn" onClick={redirectToExplore}>
        Start exploring profiles
      </button>
    </Container>
  );
};

export default NoConnectionComp;
