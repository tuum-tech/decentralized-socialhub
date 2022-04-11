import React from 'react';

import { MainCard, CardText, CardTitle, CardImg } from './ManageProfile';
import socialCardImg from '../../../../../../assets/dashboard/social.png';
import LinkButton from 'src/elements-v2/buttons/LinkButton';

const ManageLink: React.FC = () => {
  return (
    <MainCard>
      <CardTitle>Connect your social profiles</CardTitle>
      <CardText>
        Link your verified social profiles or custom links to Profile.
      </CardText>
      <LinkButton
        variant="contained"
        color="gradient"
        textType="gradient"
        href="/manager"
      >
        Manage Links
      </LinkButton>
      <CardImg src={socialCardImg} />
    </MainCard>
  );
};

export default ManageLink;
