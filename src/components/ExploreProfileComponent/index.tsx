import React, { useEffect, useState } from 'react';

import { IonSpinner, IonContent } from '@ionic/react';
import styled from 'styled-components';
import ProfileComponent from '../profile/ProfileComponent';
import {
  AccountType,
  ISessionItem,
  UserService
} from 'src/services/user.service';
import {
  EducationItem,
  ExperienceItem,
  ProfileDTO
} from 'src/pages/PublicPage/types';
import { requestFullProfile } from 'src/pages/ExplorePage/fetchapi';
import ProfileHeader from '../profile/ProfileHeader';
import style from './style.module.scss';
import arrowLeft from '../../assets/icons/arrow-left-square.svg';

const Header = styled.div`
    width: 100%;
    height: 83px;
    background: #fff;
    padding: 27px 25px 20px 48px;
    border-bottom: 1px solid #edf2f7;s
  `;

const PageTitle = styled.h2`
  font-family: 'SF Pro Display';
  font-size: 28px;
  font-weight: 600;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.36;
  letter-spacing: normal;
  text-align: left;
  color: #27272e;
  display: inline;
  margin-left: 10px;
`;

interface ArrowProps {
  onClick: any;
}

const ArrowLeft: React.FC<any> = ({ onClick }: ArrowProps) => {
  const ArrowImage = styled.img`
    margin-bottom: 5px;
  `;

  return <ArrowImage onClick={onClick} src={arrowLeft} alt="arrow-left" />;
};

interface ExploreProfileParams {
  did: string;
}

const ExploreProfileComponent: React.FC<ExploreProfileParams> = ({
  did
}: ExploreProfileParams) => {
  const [userInfo, setUserInfo] = useState({
    accountType: AccountType.DID,
    did: '',
    name: '',
    hiveHost: '',
    email: '',
    userToken: '',
    isDIDPublished: false,
    onBoardingCompleted: false,
    avatar: ''
  });
  const [full_profile, setfull_profile] = useState({
    basicDTO: {
      isEnabled: false,
      name: '',
      did: '',
      title: '',
      email: '',
      hiveHost: '',
      about: '',
      address: {
        number: '',
        street_name: '',
        postal_code: '',
        state: '',
        country: ''
      }
    },
    educationDTO: {
      isEnabled: false,
      items: [] as EducationItem[]
    },
    experienceDTO: {
      isEnabled: false,
      items: [] as ExperienceItem[]
    }
  });

  const getFullProfile = async (did: string): Promise<any> => {
    return await requestFullProfile(did);
  };
  useEffect(() => {
    (async () => {
      try {
        let userInfo = await UserService.SearchUserWithDID(did);
        setUserInfo(userInfo as any);
      } catch (e) {
        //setError(true);
      }

      try {
        //if (!error) {
        let profile: ProfileDTO = await getFullProfile(did);
        profile.basicDTO.isEnabled = true;
        profile.experienceDTO.isEnabled = true;
        profile.educationDTO.isEnabled = true;
        setfull_profile(profile);
      } catch (e) {}
      //setLoaded(true);
    })();
  }, []);
  return (
    <div className={style['exploreprofilecomponent']}>
      <Header>
        <ArrowLeft />
        <PageTitle>Explore</PageTitle>
      </Header>

      <ProfileComponent
        profile={full_profile}
        sessionItem={userInfo as ISessionItem}
        error={false}
      />
    </div>
  );
};

export default ExploreProfileComponent;
