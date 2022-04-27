import React from 'react';

import AboutCard from 'src/components/cards/AboutCard';
import ExperienceCard from 'src/components/cards/ExperienceCard';
import EducationCard from 'src/components/cards/EducationCard';

import profileCardImg from '../../../../../../assets/dashboard/profile.png';
import { useRecoilValue } from 'recoil';
import { FullProfileAtom } from 'src/Atoms/Atoms';
import { LinkButton } from 'src/elements-v2/buttons';
import MainCard from './MainCard';
interface Props {
  userSession: ISessionItem;
}

const ManageProfile: React.FC<Props> = ({ userSession }) => {
  const profile = useRecoilValue(FullProfileAtom);

  let filledContent = false;
  let hasAbout =
    profile.basicDTO && profile.basicDTO.about && profile.basicDTO.about !== '';
  let hasEducation =
    profile.educationDTO &&
    profile.educationDTO.items &&
    profile.educationDTO.items.length > 0;
  let hasExperience =
    profile.experienceDTO &&
    profile.experienceDTO.items &&
    profile.experienceDTO.items.length > 0;

  if (hasAbout || hasEducation || hasExperience) {
    filledContent = true;
  }

  if (!filledContent) {
    return (
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
    );
  }

  return (
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
