import React from 'react';

import AboutCard from 'src/components/cards/AboutCard';
import ExperienceCard from 'src/components/cards/ExperienceCard';
import EducationCard from 'src/components/cards/EducationCard';

import profileCardImg from '../../../../../../assets/dashboard/profile.png';
import { LinkButton } from 'src/elements-v2/buttons';
import useProfileFilled from 'src/hooks/useProfileFilled';
import MainCard from './MainCard';

interface Props {
  userSession: ISessionItem;
}

const ManageProfile: React.FC<Props> = ({ userSession }) => {
  const {
    profile,
    filledContent,
    hasAbout,
    hasEducation,
    hasExperience
  } = useProfileFilled();

  return !filledContent ? (
    <MainCard
      title="Manage Your profile"
      description="Add, edit and manage your profile information from profile manager."
      right={<img src={profileCardImg} alt="profile-img" />}
    >
      <LinkButton
        variant="contained"
        btnColor="secondary-gradient"
        textType="gradient"
        href="/manager"
      >
        Manage Profile
      </LinkButton>
    </MainCard>
  ) : (
    <>
      {hasAbout && <AboutCard aboutText={profile.basicDTO.about} />}
      {hasExperience && (
        <ExperienceCard template="default" userSession={userSession} />
      )}
      {hasEducation && (
        <EducationCard template="default" userSession={userSession} />
      )}
    </>
  );
};

export default ManageProfile;
