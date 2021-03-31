import React from 'react';

import {
  MainCard,
  CardText,
  CardTitle,
  CardImg,
  LinkButton
} from './ManageProfile';
import socialCardImg from '../../../../../../assets/dashboard/social.png';

const ManageLink: React.FC = ({}) => {
  return (
    <MainCard>
      <CardTitle>Connect your social profiles</CardTitle>
      <CardText>
        Link your verified social profiles or custom links to Profile.
      </CardText>
      <LinkButton>Manage Links ></LinkButton>
      <CardImg src={socialCardImg} />
    </MainCard>
  );
};

export default ManageLink;
