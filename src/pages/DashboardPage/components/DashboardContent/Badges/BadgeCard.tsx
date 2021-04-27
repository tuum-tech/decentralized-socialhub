import React, { useState, useEffect } from 'react';
import {
  IonRow,
  IonCol,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonText
} from '@ionic/react';

import styled from 'styled-components';
import style from './BadgeCard.module.scss';
import ProgressBar from 'src/components/ProgressBar';
import BadgeItem from './BadgeItem';

import enbl_tutoral_bdg from 'src/assets/badges/enbl_tutorial.svg';
import dsabl_tutoral_bdg from 'src/assets/badges/dsabl_tutorial.svg';
import enbl_basic_profile_bdg from 'src/assets/badges/enbl_basic_profile.svg';
import dsabl_basic_profile_Bdg from 'src/assets/badges/dsabl_basic_profile.svg';
import enbl_education_profile_bdg from 'src/assets/badges/enbl_education_profile.svg';
import dsabl_education_profile_bdg from 'src/assets/badges/dsabl_education_profile.svg';
import enbl_experience_profile_bdg from 'src/assets/badges/enbl_experience_profile.svg';
import dsabl_experience_profile_bdg from 'src/assets/badges/dsabl_experience_profile.svg';
import enbl_own_vault_bdg from 'src/assets/badges/enbl_own_vault.svg';
import dsabl_own_vault_bdg from 'src/assets/badges/dsabl_own_vault.svg';

import enbl_publish_did_5_bdg from 'src/assets/badges/enbl_publish_did_5.svg';
import dsabl_publish_did_5_bdg from 'src/assets/badges/dsabl_publish_did_5.svg';
import enbl_publish_did_10_bdg from 'src/assets/badges/enbl_publish_did_10.svg';
import dsabl_publish_did_10_bdg from 'src/assets/badges/dsabl_publish_did_10.svg';
import enbl_publish_did_25_bdg from 'src/assets/badges/enbl_publish_did_25.svg';
import dsabl_publish_did_25_bdg from 'src/assets/badges/dsabl_publish_did_25.svg';
import enbl_publish_did_50_bdg from 'src/assets/badges/enbl_publish_did_50.svg';
import dsabl_publish_did_50_bdg from 'src/assets/badges/dsabl_publish_did_50.svg';
import enbl_publish_did_100_bdg from 'src/assets/badges/enbl_publish_did_100.svg';
import dsabl_publish_did_100_bdg from 'src/assets/badges/dsabl_publish_did_100.svg';

import enbl_linkedin_bdg from 'src/assets/badges/enbl_linkedin_verify.svg';
import dsabl_linkedin_bdg from 'src/assets/badges/dsabl_linkedin_verify.svg';
import enbl_facebook_bdg from 'src/assets/badges/enbl_facebook_verify.svg';
import dsabl_facebook_bdg from 'src/assets/badges/dsabl_facebook_verify.svg';
import enbl_twitter_bdg from 'src/assets/badges/enbl_twitter_verify.svg';
import dsabl_twitter_bdg from 'src/assets/badges/dsabl_twitter_verify.svg';
import enbl_google_bdg from 'src/assets/badges/enbl_google_verify.svg';
import dsabl_google_bdg from 'src/assets/badges/dsabl_google_verify.svg';
import enbl_email_bdg from 'src/assets/badges/enbl_email_verify.svg';
import dsabl_email_bdg from 'src/assets/badges/dsabl_email_verify.svg';
import enbl_phone_bdg from 'src/assets/badges/enbl_phone_verify.svg';
import dsabl_phone_bdg from 'src/assets/badges/dsabl_phone_verify.svg';

const ProgressBarChart = styled.div`
  width: 42px;
`;
const ProgressBarText = styled.div`
  font-size: 10px;
  font-weight: normal;
  line-height: 1.71;
  letter-spacing: 0.13px;
  color: rgba(0, 0, 0, 0.87);
  margin: 0 10px;
`;
const ProgressContainer = styled.div`
  display: flex;
  align-items: center;
`;

interface Props {
  badges: IBadges;
  badgeCategory: string;
}

const BadgeCard: React.FC<Props> = ({ badges, badgeCategory }) => {
  const [totalBadgeCount, setTotalBadgeCount] = useState<number>(0);
  const [completedBadgeCount, setCompletedBadgeCount] = useState<number>(0);
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [badgeItems, setBadgeItems] = useState<any>({});
  const [badgeCategoryTitle, setBadgeCategoryTitle] = useState<string>('');

  let badgeDetails = {
    account: {
      beginnerTutorial: {
        title: 'Beginner Tutorial',
        description: 'Complete the beginner tutorial',
        enbl_icon: enbl_tutoral_bdg,
        dsabl_icon: dsabl_tutoral_bdg
      },
      basicProfile: {
        title: 'Add Basic Profile',
        description: 'Add content in About Me section',
        enbl_icon: enbl_basic_profile_bdg,
        dsabl_icon: dsabl_basic_profile_Bdg
      },
      educationProfile: {
        title: 'Add Education Profile',
        description: 'Add content in Education section',
        enbl_icon: enbl_education_profile_bdg,
        dsabl_icon: dsabl_education_profile_bdg
      },
      experienceProfile: {
        title: 'Add Experience Profile',
        description: 'Add content in Experience section',
        enbl_icon: enbl_experience_profile_bdg,
        dsabl_icon: dsabl_experience_profile_bdg
      },
      ownVault: {
        title: 'Own Vault',
        description: 'Choose own vault instead of default',
        enbl_icon: enbl_own_vault_bdg,
        dsabl_icon: dsabl_own_vault_bdg
      }
    },
    socialVerify: {
      linkedin: {
        title: 'Linkedin Verification',
        description: 'Authenticate and link your Linkedin account',
        enbl_icon: enbl_linkedin_bdg,
        dsabl_icon: dsabl_linkedin_bdg
      },
      facebook: {
        title: 'Facebook Verification',
        description: 'Authenticate and link your Facebook account',
        enbl_icon: enbl_facebook_bdg,
        dsabl_icon: dsabl_facebook_bdg
      },
      twitter: {
        title: 'Twitter Verification',
        description: 'Authenticate and link your Twitter account',
        enbl_icon: enbl_twitter_bdg,
        dsabl_icon: dsabl_twitter_bdg
      },
      google: {
        title: 'Google Verification',
        description: 'Authenticate and link your Google account',
        enbl_icon: enbl_google_bdg,
        dsabl_icon: dsabl_google_bdg
      },
      email: {
        title: 'Email Verification',
        description: 'Authenticate and link your Email account',
        enbl_icon: enbl_email_bdg,
        dsabl_icon: dsabl_email_bdg
      },
      phone: {
        title: 'Phone Verification',
        description: 'Authenticate and link your Phone no',
        enbl_icon: enbl_phone_bdg,
        dsabl_icon: dsabl_phone_bdg
      }
    },
    didPublishTimes: {
      _5times: {
        title: 'Publish DID 5 times',
        description: 'Complete the tutorial',
        enbl_icon: enbl_publish_did_5_bdg,
        dsabl_icon: dsabl_publish_did_5_bdg
      },
      _10times: {
        title: 'Publish DID 10 times',
        description: 'Complete the tutorial',
        enbl_icon: enbl_publish_did_10_bdg,
        dsabl_icon: dsabl_publish_did_10_bdg
      },
      _25times: {
        title: 'Publish DID 25 times',
        description: 'Complete the tutorial',
        enbl_icon: enbl_publish_did_25_bdg,
        dsabl_icon: dsabl_publish_did_25_bdg
      },
      _50times: {
        title: 'Publish DID 50 times',
        description: 'Complete the tutorial',
        enbl_icon: enbl_publish_did_50_bdg,
        dsabl_icon: dsabl_publish_did_50_bdg
      },
      _100times: {
        title: 'Publish DID 100 times',
        description: 'Complete the tutorial',
        enbl_icon: enbl_publish_did_100_bdg,
        dsabl_icon: dsabl_publish_did_100_bdg
      }
    }
  };

  useEffect(() => {
    switch (badgeCategory) {
      case 'account':
        setBadgeCategoryTitle('Account');
        break;
      case 'socialVerify':
        setBadgeCategoryTitle('Social Badges');
        break;
      case 'didPublishTimes':
        setBadgeCategoryTitle('DID Pubish');
        break;
      default:
        setBadgeCategoryTitle('');
        break;
    }
    let items = (badges as any)[badgeCategory];
    setBadgeItems(items);
    let count1 = Object.keys(items).length;
    let count2 = Object.keys(items).filter(key => (items as any)[key]).length;
    setTotalBadgeCount(count1);
    setCompletedBadgeCount(count2);
    setProgressPercent((count2 * 100) / count1);
  }, []);
  return (
    <IonCard className={style['badge-card']}>
      <IonCardHeader className={style['badge-card-header']}>
        <IonCardTitle className={style['badge-category-name']}>
          {badgeCategoryTitle}
        </IonCardTitle>
        <ProgressContainer>
          <ProgressBarChart>
            <ProgressBar value={progressPercent} containerColor="#dde5ec" />
          </ProgressBarChart>
          <ProgressBarText>
            {completedBadgeCount}/{totalBadgeCount} Completed
          </ProgressBarText>
        </ProgressContainer>
      </IonCardHeader>
      <IonCardContent>
        <IonRow>
          {Object.keys(badgeItems!).map((key, index) => {
            return (
              <IonCol size="3" key={index}>
                <BadgeItem
                  image={
                    (badgeItems as any)[key]
                      ? ((badgeDetails as any)[badgeCategory] as any)[key]
                          .enbl_icon
                      : ((badgeDetails as any)[badgeCategory] as any)[key]
                          .dsabl_icon
                  }
                  title={
                    ((badgeDetails as any)[badgeCategory] as any)[key].title
                  }
                  description={
                    ((badgeDetails as any)[badgeCategory] as any)[key]
                      .description
                  }
                />
              </IonCol>
            );
          })}
        </IonRow>
      </IonCardContent>
    </IonCard>
  );
};

export default BadgeCard;
