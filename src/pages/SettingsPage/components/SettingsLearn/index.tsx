import React from 'react';
import styled from 'styled-components';
import {
  IonCol,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonGrid,
  IonRow,
  IonContent,
  IonText,
  IonCardContent,
  IonSearchbar,
  IonIcon
} from '@ionic/react';
import { chevronForwardCircleOutline } from 'ionicons/icons';
import {
  PrimaryText,
  Section,
  SectionTitle,
  SectionSubTitle,
  SectionText,
  LightBox,
  SpaceLg,
  SpaceLs,
  PageTitle,
  PageCategory
} from 'src/components/note';
import style from './style.module.scss';
const SettingsLearn: React.FC = () => {
  return (
    <IonContent className={style['settingslearn']}>
      <IonGrid className={style['tab-grid']}>
        <IonRow>
          <IonCol>
            <IonCard className={style['tab-card']}>
              <IonCardHeader>
                <PageCategory>Help & Support</PageCategory>
                <PageTitle>Learn About Profile</PageTitle>
              </IonCardHeader>
              <IonCardContent>
                <IonText>
                  <p>
                    Terms and conditions (also referred to as terms of use or
                    terms of service) are a form of legan agreement outlining
                    rules and restrictions for customers to follow when using
                    your site.
                  </p>
                </IonText>
                <SpaceLs></SpaceLs>
                <CustomSearchbar placeholder="Search for topic or articles"></CustomSearchbar>
                <IonRow>
                  <IonCol size="4">
                    <AboutProfile>
                      <IonCardHeader>
                        <IonCardTitle>About Profile</IonCardTitle>
                      </IonCardHeader>
                      <IonCardContent>
                        <IonText>
                          Terms and conditions (also referred to as terms of
                          use)
                        </IonText>
                        <CustomIconWrapper className="ion-text-end">
                          <CustomIcon
                            slot="end"
                            icon={chevronForwardCircleOutline}
                          ></CustomIcon>
                        </CustomIconWrapper>
                      </IonCardContent>
                    </AboutProfile>
                  </IonCol>
                  <IonCol size="4">
                    <DecentralizeIdentity>
                      <IonCardHeader>
                        <IonCardTitle>Decentralize Identity (DID)</IonCardTitle>
                      </IonCardHeader>
                      <IonCardContent>
                        <IonText>
                          Terms and conditions (also referred to as terms of
                          use)
                        </IonText>
                        <CustomIconWrapper className="ion-text-end">
                          <CustomIcon
                            slot="end"
                            icon={chevronForwardCircleOutline}
                          ></CustomIcon>
                        </CustomIconWrapper>
                      </IonCardContent>
                    </DecentralizeIdentity>
                  </IonCol>
                  <IonCol size="4">
                    <StorageVault>
                      <IonCardHeader>
                        <IonCardTitle>Storage Vaults</IonCardTitle>
                      </IonCardHeader>
                      <IonCardContent>
                        <IonText>
                          Terms and conditions (also referred to as terms of
                          use)
                        </IonText>
                        <CustomIconWrapper className="ion-text-end">
                          <CustomIcon
                            slot="end"
                            icon={chevronForwardCircleOutline}
                          ></CustomIcon>
                        </CustomIconWrapper>
                      </IonCardContent>
                    </StorageVault>
                  </IonCol>
                </IonRow>
                <SpaceLg></SpaceLg>
                <Section>
                  <SectionTitle>1. Heading 01</SectionTitle>
                  <SectionText>
                    <p>
                      Terms and conditions (also referred to as terms of use or
                      terms of service) are a form of legal agreement outlining
                      rules and restrictions for customers to follow when using
                      yoru site.
                    </p>
                  </SectionText>
                  <LightBox>
                    <svg
                      width="36"
                      height="37"
                      viewBox="0 0 36 37"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g clipPath="url(#clip0)">
                        <path
                          d="M36 18.4727C36 22.0327 34.9443 25.5128 32.9665 28.4729C30.9886 31.433 28.1774 33.7401 24.8883 35.1025C21.5992 36.4649 17.98 36.8213 14.4884 36.1268C10.9967 35.4323 7.78943 33.7179 5.27209 31.2006C2.75474 28.6832 1.04041 25.4759 0.345873 21.9843C-0.348661 18.4926 0.00779915 14.8734 1.37018 11.5844C2.73255 8.29528 5.03966 5.48407 7.99974 3.5062C10.9598 1.52834 14.4399 0.472656 18 0.472656C22.7739 0.472656 27.3523 2.36908 30.7279 5.74473C34.1036 9.12039 36 13.6988 36 18.4727Z"
                          fill="#4C6FFF"
                          fillOpacity="0.4"
                        />
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M2.743 8.27266L18 18.4727L7.808 3.20666L2.743 8.27266ZM33.262 8.27966L28.2 3.21166L18 18.4727L0 14.8867V22.0507L18 18.4727L2.738 28.6677L7.8 33.7347L18 18.4727L14.415 36.4727H21.577L18 18.4727L28.192 33.7387L33.258 28.6727L18 18.4727L33.262 8.27966ZM36 14.8947L18 18.4727L36 22.0587V14.8947ZM14.423 0.472656L18 18.4727L21.585 0.472656H14.423Z"
                          fill="#4C6FFF"
                          fillOpacity="0.39"
                        />
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M21.6001 33.9544H14.4001C14.4001 31.2274 13.1451 27.6314 11.5241 26.2774C10.2138 25.1906 9.19925 23.7904 8.5747 22.2067C7.95016 20.623 7.73584 18.9072 7.95164 17.2186C8.16743 15.5299 8.80636 13.9232 9.80909 12.5475C10.8118 11.1718 12.1459 10.0717 13.6874 9.34931C15.2289 8.62697 16.928 8.30578 18.6268 8.41557C20.3256 8.52536 21.9692 9.06256 23.4049 9.97731C24.8407 10.8921 26.022 12.1547 26.8393 13.6481C27.6567 15.1414 28.0835 16.817 28.0801 18.5194C28.0513 19.9942 27.715 21.4468 27.0927 22.7843C26.4704 24.1217 25.5758 25.3145 24.4661 26.2864C22.6243 28.4173 21.6074 31.1379 21.6001 33.9544Z"
                          fill="#4C6FFF"
                          stroke="#EBEFFD"
                          strokeWidth="1.44"
                          strokeMiterlimit="10"
                        />
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M19.0801 34.6739C18.9846 34.6739 18.893 34.636 18.8255 34.5685C18.758 34.501 18.7201 34.4094 18.7201 34.3139V22.4339H17.2801V34.3139C17.2801 34.4094 17.2421 34.501 17.1746 34.5685C17.1071 34.636 17.0155 34.6739 16.9201 34.6739H16.2001C16.1046 34.6739 16.013 34.636 15.9455 34.5685C15.878 34.501 15.8401 34.4094 15.8401 34.3139V22.4339H14.9401C14.4898 22.434 14.049 22.3042 13.6707 22.06C13.2924 21.8158 12.9925 21.4677 12.8071 21.0573C12.6218 20.647 12.5587 20.1919 12.6255 19.7466C12.6924 19.3013 12.8863 18.8847 13.184 18.5469C13.4817 18.209 13.8705 17.9643 14.3038 17.8419C14.7372 17.7196 15.1966 17.7249 15.627 17.8572C16.0574 17.9894 16.4406 18.2431 16.7304 18.5877C17.0202 18.9323 17.2045 19.3532 17.2611 19.7999C17.2738 19.8366 17.2802 19.8751 17.2801 19.9139V20.9939H18.7201V19.9139C18.72 19.8737 18.7268 19.8338 18.7401 19.7959C18.7974 19.3494 18.9823 18.929 19.2725 18.5849C19.5628 18.2409 19.9462 17.9879 20.3766 17.8562C20.807 17.7246 21.2663 17.7199 21.6994 17.8427C22.1324 17.9655 22.5209 18.2106 22.8182 18.5486C23.1154 18.8866 23.3089 19.3032 23.3754 19.7484C23.4418 20.1936 23.3785 20.6485 23.1929 21.0586C23.0073 21.4687 22.7074 21.8166 22.3291 22.0605C21.9508 22.3044 21.5102 22.4341 21.0601 22.4339H20.1601V34.3139C20.1601 34.4094 20.1221 34.501 20.0546 34.5685C19.9871 34.636 19.8955 34.6739 19.8001 34.6739H19.0801ZM21.0601 20.9939C21.2328 20.995 21.4023 20.9464 21.5482 20.8538C21.6941 20.7612 21.8102 20.6286 21.8828 20.4718C21.9553 20.3149 21.9812 20.1406 21.9573 19.9694C21.9334 19.7983 21.8607 19.6377 21.748 19.5067C21.6353 19.3758 21.4872 19.2801 21.3215 19.231C21.1559 19.1819 20.9796 19.1816 20.8137 19.23C20.6479 19.2784 20.4994 19.3735 20.3862 19.504C20.2729 19.6345 20.1996 19.7949 20.1751 19.9659L20.1601 20.0279V20.9939H21.0601ZM14.9401 19.1939C14.7014 19.1939 14.4725 19.2887 14.3037 19.4575C14.1349 19.6263 14.0401 19.8552 14.0401 20.0939C14.0401 20.3326 14.1349 20.5615 14.3037 20.7303C14.4725 20.8991 14.7014 20.9939 14.9401 20.9939H15.8401V20.0249L15.8261 19.9659C15.7954 19.7524 15.6891 19.557 15.5265 19.4153C15.3638 19.2737 15.1558 19.1951 14.9401 19.1939Z"
                          fill="#EBEFFD"
                        />
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M13.6797 33.2336H22.3197V36.4736H13.6797V33.2336ZM15.8397 23.5136H17.2797V22.4336H15.8397V23.5136ZM18.7197 22.4336V23.5136H20.1597V22.4336H18.7197Z"
                          fill="#EBEFFD"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0">
                          <rect
                            width="36"
                            height="36"
                            fill="white"
                            transform="translate(0 0.472656)"
                          />
                        </clipPath>
                      </defs>
                    </svg>
                    <IonText>
                      Terms and conditions (also referred to as terms of use or
                      terms of service) are a form of legal agreement outlining
                      rules and restrictions for customers to follow when using
                      yoru site.
                    </IonText>
                  </LightBox>
                  <SectionText>
                    <p>
                      While it's not legally required for ecommerce websites to
                      have a terms and conditions agreement, adding one will
                      help protect your online business.
                    </p>
                    <p>
                      As terms and conditions are legally enforceable rules,
                      they allow you to set standards for how users interact
                      with your site. Here are some of the major benefits of
                      including terms and conditions on your ecommerce site.
                    </p>
                  </SectionText>
                </Section>
                <Section>
                  <SectionTitle>2. Heading 02</SectionTitle>
                  <SectionSubTitle>2.1 Sub headings</SectionSubTitle>
                  <SectionText>
                    <p>
                      Terms and conditions (also referred to as{' '}
                      <PrimaryText>
                        terms of use or terms of service
                      </PrimaryText>
                      ) are a form of legal agreement outlining rules and
                      restrictions for customers to follow when using yoru site.
                    </p>
                  </SectionText>
                  <LightBox>
                    <svg
                      width="36"
                      height="37"
                      viewBox="0 0 36 37"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g clipPath="url(#clip0)">
                        <path
                          d="M36 18.4727C36 22.0327 34.9443 25.5128 32.9665 28.4729C30.9886 31.433 28.1774 33.7401 24.8883 35.1025C21.5992 36.4649 17.98 36.8213 14.4884 36.1268C10.9967 35.4323 7.78943 33.7179 5.27209 31.2006C2.75474 28.6832 1.04041 25.4759 0.345873 21.9843C-0.348661 18.4926 0.00779915 14.8734 1.37018 11.5844C2.73255 8.29528 5.03966 5.48407 7.99974 3.5062C10.9598 1.52834 14.4399 0.472656 18 0.472656C22.7739 0.472656 27.3523 2.36908 30.7279 5.74473C34.1036 9.12039 36 13.6988 36 18.4727Z"
                          fill="#4C6FFF"
                          fillOpacity="0.4"
                        />
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M2.743 8.27266L18 18.4727L7.808 3.20666L2.743 8.27266ZM33.262 8.27966L28.2 3.21166L18 18.4727L0 14.8867V22.0507L18 18.4727L2.738 28.6677L7.8 33.7347L18 18.4727L14.415 36.4727H21.577L18 18.4727L28.192 33.7387L33.258 28.6727L18 18.4727L33.262 8.27966ZM36 14.8947L18 18.4727L36 22.0587V14.8947ZM14.423 0.472656L18 18.4727L21.585 0.472656H14.423Z"
                          fill="#4C6FFF"
                          fillOpacity="0.39"
                        />
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M21.6001 33.9544H14.4001C14.4001 31.2274 13.1451 27.6314 11.5241 26.2774C10.2138 25.1906 9.19925 23.7904 8.5747 22.2067C7.95016 20.623 7.73584 18.9072 7.95164 17.2186C8.16743 15.5299 8.80636 13.9232 9.80909 12.5475C10.8118 11.1718 12.1459 10.0717 13.6874 9.34931C15.2289 8.62697 16.928 8.30578 18.6268 8.41557C20.3256 8.52536 21.9692 9.06256 23.4049 9.97731C24.8407 10.8921 26.022 12.1547 26.8393 13.6481C27.6567 15.1414 28.0835 16.817 28.0801 18.5194C28.0513 19.9942 27.715 21.4468 27.0927 22.7843C26.4704 24.1217 25.5758 25.3145 24.4661 26.2864C22.6243 28.4173 21.6074 31.1379 21.6001 33.9544Z"
                          fill="#4C6FFF"
                          stroke="#EBEFFD"
                          strokeWidth="1.44"
                          strokeMiterlimit="10"
                        />
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M19.0801 34.6739C18.9846 34.6739 18.893 34.636 18.8255 34.5685C18.758 34.501 18.7201 34.4094 18.7201 34.3139V22.4339H17.2801V34.3139C17.2801 34.4094 17.2421 34.501 17.1746 34.5685C17.1071 34.636 17.0155 34.6739 16.9201 34.6739H16.2001C16.1046 34.6739 16.013 34.636 15.9455 34.5685C15.878 34.501 15.8401 34.4094 15.8401 34.3139V22.4339H14.9401C14.4898 22.434 14.049 22.3042 13.6707 22.06C13.2924 21.8158 12.9925 21.4677 12.8071 21.0573C12.6218 20.647 12.5587 20.1919 12.6255 19.7466C12.6924 19.3013 12.8863 18.8847 13.184 18.5469C13.4817 18.209 13.8705 17.9643 14.3038 17.8419C14.7372 17.7196 15.1966 17.7249 15.627 17.8572C16.0574 17.9894 16.4406 18.2431 16.7304 18.5877C17.0202 18.9323 17.2045 19.3532 17.2611 19.7999C17.2738 19.8366 17.2802 19.8751 17.2801 19.9139V20.9939H18.7201V19.9139C18.72 19.8737 18.7268 19.8338 18.7401 19.7959C18.7974 19.3494 18.9823 18.929 19.2725 18.5849C19.5628 18.2409 19.9462 17.9879 20.3766 17.8562C20.807 17.7246 21.2663 17.7199 21.6994 17.8427C22.1324 17.9655 22.5209 18.2106 22.8182 18.5486C23.1154 18.8866 23.3089 19.3032 23.3754 19.7484C23.4418 20.1936 23.3785 20.6485 23.1929 21.0586C23.0073 21.4687 22.7074 21.8166 22.3291 22.0605C21.9508 22.3044 21.5102 22.4341 21.0601 22.4339H20.1601V34.3139C20.1601 34.4094 20.1221 34.501 20.0546 34.5685C19.9871 34.636 19.8955 34.6739 19.8001 34.6739H19.0801ZM21.0601 20.9939C21.2328 20.995 21.4023 20.9464 21.5482 20.8538C21.6941 20.7612 21.8102 20.6286 21.8828 20.4718C21.9553 20.3149 21.9812 20.1406 21.9573 19.9694C21.9334 19.7983 21.8607 19.6377 21.748 19.5067C21.6353 19.3758 21.4872 19.2801 21.3215 19.231C21.1559 19.1819 20.9796 19.1816 20.8137 19.23C20.6479 19.2784 20.4994 19.3735 20.3862 19.504C20.2729 19.6345 20.1996 19.7949 20.1751 19.9659L20.1601 20.0279V20.9939H21.0601ZM14.9401 19.1939C14.7014 19.1939 14.4725 19.2887 14.3037 19.4575C14.1349 19.6263 14.0401 19.8552 14.0401 20.0939C14.0401 20.3326 14.1349 20.5615 14.3037 20.7303C14.4725 20.8991 14.7014 20.9939 14.9401 20.9939H15.8401V20.0249L15.8261 19.9659C15.7954 19.7524 15.6891 19.557 15.5265 19.4153C15.3638 19.2737 15.1558 19.1951 14.9401 19.1939Z"
                          fill="#EBEFFD"
                        />
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M13.6797 33.2336H22.3197V36.4736H13.6797V33.2336ZM15.8397 23.5136H17.2797V22.4336H15.8397V23.5136ZM18.7197 22.4336V23.5136H20.1597V22.4336H18.7197Z"
                          fill="#EBEFFD"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0">
                          <rect
                            width="36"
                            height="36"
                            fill="white"
                            transform="translate(0 0.472656)"
                          />
                        </clipPath>
                      </defs>
                    </svg>
                    <IonText>
                      Terms and conditions (also referred to as terms of use or
                      terms of service) are a form of legal agreement outlining
                      rules and restrictions for customers to follow when using
                      yoru site.
                    </IonText>
                  </LightBox>
                  <SectionText>
                    <p>
                      While it's not <PrimaryText>legally required</PrimaryText>{' '}
                      for ecommerce websites to have a terms and conditions
                      agreement, adding one will help protect your online
                      business.
                    </p>
                    <p>
                      As terms and conditions are legally enforceable rules,
                      they allow you to <PrimaryText>set standards</PrimaryText>{' '}
                      for how users interact with your site. Here are some of
                      the major benefits of including terms and conditions on
                      your ecommerce site.
                    </p>
                  </SectionText>
                  <SectionSubTitle>2.1 Sub headings</SectionSubTitle>
                  <SectionText>
                    <p>
                      Terms and conditions (also referred to as terms of use or
                      terms of service) are a form of legal agreement outlining
                      rules and restrictions for customers to follow when using
                      yoru site.
                    </p>
                    <p>
                      While it's not legally required for ecommerce websites to
                      have a terms and conditions agreement, adding one will
                      help protect your online business.
                    </p>
                    <p>
                      As terms and conditions are{' '}
                      <PrimaryText>legally enforceable rules</PrimaryText>, they
                      allow you to set standards for how users interact with
                      your site. Here are some of the major benefits of
                      including terms and conditions on your ecommerce site.
                    </p>
                  </SectionText>
                </Section>
              </IonCardContent>
            </IonCard>
          </IonCol>
        </IonRow>
      </IonGrid>
    </IonContent>
  );
};
const CustomIconWrapper = styled('div')`
  margin-top: 20px;
  width: 100%;
`;
const CustomIcon = styled(IonIcon)`
  font-size: 30px;
`;
const CustomSearchbar = styled(IonSearchbar)`
  --background: #edf2f7;
`;
const InfoCard = styled(IonCard)`
  border-radius: 19px;
  margin: 3px;
  & ion-card-title {
    font-size: 16px;
    font-weight: bold;
    letter-spacing: -0.005em;
    color: #000000;
  }
  & ion-card-header {
    padding: 13px 20px;
  }
  & ion-card-content {
    padding-left: 20px;
    padding-right: 20px;
  }
  & ion-text {
    color: #000000;
  }
`;
const AboutProfile = styled(InfoCard)`
  --background: #e9edff;
  ${CustomIcon} {
    color: #4c6fff;
  }
`;
const DecentralizeIdentity = styled(InfoCard)`
  --background: #e2f9fa;
  ${CustomIcon} {
    color: #2fd5dd;
  }
`;
const StorageVault = styled(InfoCard)`
  --background: #ffead9;
  ${CustomIcon} {
    color: #ff8e00;
  }
`;

export default SettingsLearn;
