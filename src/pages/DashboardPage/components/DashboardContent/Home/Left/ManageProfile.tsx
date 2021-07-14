import React from 'react';
import styled from 'styled-components';

import { DefaultLinkButton } from 'src/elements/buttons';
import AboutCard from 'src/components/cards/AboutCard';
import ExperienceCard from 'src/components/cards/ExperienceCard';
import EducationCard from 'src/components/cards/EducationCard';

import profileCardImg from '../../../../../../assets/dashboard/profile.png';

export const CardTitle = styled.p`
  color: black;
  font-size: 18px;
  font-weight: bold;
  line-height: normal;
  margin: 0;
`;

export const CardText = styled.p`
  margin-top: 5px;
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 23px;
  color: #425466;
  max-width: 315px;
  maring-bottom: 15px;
`;

export const MainCard = styled.div`
  box-shadow: 0px 0px 1px rgba(12, 26, 75, 0.24),
    0px 3px 8px -1px rgba(50, 50, 71, 0.05);
  border-radius: 16px;
  padding: 56px 55px;

  font-family: 'SF Pro Display';
  background-size: auto 100% !important;
  min-height: 248px;
  background: white;
  position: relative;

  margin-bottom: 22px;
`;

export const CardImg = styled.img`
  width: auto !important;
  height: 248px;
  position: absolute;
  right: 0;
  bottom: 0;
`;

export const LinkButton = styled(DefaultLinkButton)`
  margin-top: 15px;
  width: 158px;
  color: #4c6fff;
  background-color: #f3f9ff;
  text-align: left !important;
  padding: 11px 15px;
`;

interface Props {
  profile: ProfileDTO;
}

const ManageProfile: React.FC<Props> = ({ profile }) => {
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
      <MainCard>
        <CardTitle>Manage Your profiles</CardTitle>
        <CardText>
          Add, edit and manage your profile information from profile manager.
        </CardText>
        <LinkButton href="/manager">Manage your profile &gt;</LinkButton>
        <CardImg src={profileCardImg} />
      </MainCard>
    );
  }

  return (
    <>
      {hasAbout && <AboutCard aboutText={profile.basicDTO.about} />}
      {hasExperience && (
        <ExperienceCard
          experienceDTO={profile.experienceDTO}
          template="default"
        />
      )}
      {hasEducation && (
        <EducationCard educationDTO={profile.educationDTO} template="default" />
      )}
    </>
  );
};

export default ManageProfile;
