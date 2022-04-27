import React from 'react';

import MainCard from './MainCard';
import socialCardImg from '../../../../../../assets/dashboard/social.png';
import { LinkButton } from 'src/elements-v2/buttons';

const ManageLink: React.FC = () => {
  return (
    <MainCard
      title="Connect your social profiles"
      description="Link your verified social profiles or custom links to Profile."
      right={<img src={socialCardImg} alt="social-img" />}
    >
      <LinkButton
        variant="contained"
        btnColor="secondary-gradient"
        textType="gradient"
        href="/manager"
      >
        Manage Links
      </LinkButton>
    </MainCard>
  );
};

export default ManageLink;
