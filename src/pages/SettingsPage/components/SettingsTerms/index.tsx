import React, { createRef, useState, useEffect, useRef } from 'react';
import {
  IonCol,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonGrid,
  IonRow,
  IonContent,
  IonText,
  IonRouterLink
} from '@ionic/react';
import {
  PrimaryText,
  Section,
  SectionTitle,
  SectionSubTitle,
  SectionText,
  LightBox,
  Indent
} from 'src/components/note';
import styled from 'styled-components';
import style from './style.module.scss';

const SettingsTerms: React.FC = () => {
  const [sectionRefs, setSectionRefs] = useState([]);

  useEffect(() => {
    // add or remove refs
    setSectionRefs(sectionRefs =>
      Array(28)
        .fill(0)
        .map((_, i) => sectionRefs[i] || createRef())
    );
  }, []);

  interface tempParam {
    behavior: string | null;
  }
  const func = (temp: tempParam) => {};

  const scrollToSection = (index: number) => {
    let targetRef = sectionRefs[index]
      ? sectionRefs[index]
      : { current: { scrollIntoView: func } };
    return targetRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sectionTitles = [
    'AGREEMENT TO TERMS',
    'PURPOSE',
    'PRIVACY POLICY',
    'INTELLECTUAL PROPERTY RIGHTS',
    'USER REPRESENTATIONS',
    'USER REGISTRATION',
    'PROHIBITED ACTIVITIES',
    'USER GENERATED CONTRIBUTIONS',
    'CONTRIBUTION LICENSE',
    'MOBILE APPLICATION LICENSE(as applicable)',
    'SUBMISSIONS',
    'THIRD-PARTY WEBSITES AND CONTENT',
    'ADVERTISERS',
    'SITE MANAGEMENT',
    'DIGITAL MILLENNIUM COPYRIGHT ACT (DMCA) NOTICE AND POLICY',
    'TERM AND TERMINATION',
    'MODIFICATIONS AND INTERRUPTIONS',
    'GOVERNING LAW',
    'DISPUTE RESOLUTION',
    'CORRECTIONS',
    'DISCLAIMER',
    'LIMITATIONS OF LIABILITY',
    'INDEMNIFICATION',
    'USER DATA',
    'ELECTRONIC COMMUNICATIONS, TRANSACTIONS, AND SIGNATURES',
    'CALIFORNIA USERS AND RESIDENTS',
    'MISCELLANEOUS',
    'CONTACT US'
  ];

  return (
    <IonContent className={style['settingsterms']}>
      <IonGrid className={style['tab-grid']}>
        <IonRow>
          <IonCol>
            <IonCard className={style['tab-card']}>
              <IonCardHeader>
                <IonCardTitle className={style['card-title']}>
                  Terms of Use
                </IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                <IonCard no-padding className={style['toc-card']}>
                  <IonCardHeader>
                    <IonCardTitle className={style['card-title-ls']}>
                      Table of Content
                    </IonCardTitle>
                  </IonCardHeader>
                  <IonCardContent>
                    {sectionTitles.map((item, idx) => {
                      return (
                        <IonRouterLink
                          href="#"
                          key={idx}
                          onClick={e => {
                            e.preventDefault();
                            scrollToSection(idx);
                          }}
                        >
                          <TocText>
                            <h3>
                              {idx + 1}. {item}
                            </h3>
                          </TocText>
                        </IonRouterLink>
                      );
                    })}
                  </IonCardContent>
                </IonCard>
                <Section ref={sectionRefs[0]}>
                  <SectionTitle>AGREEMENT TO TERMS</SectionTitle>
                  <SectionText>
                    <p>
                      These Terms and Conditions (“Terms of Use”) constitute a
                      legally binding agreement made between you, whether
                      personally or on behalf of an entity (“you”) and
                      Blockchain Limited dba Tuum Technologies and its
                      affiliates (“we,” “us” or “our”), concerning your access
                      to and use of the Profile Platform, a website and platform
                      owned by Blockchain Limited dba Tuum Technologies, as well
                      as any other media form, media channel, application,
                      mobile website or mobile application related, linked, or
                      otherwise connected thereto, existing now or created at a
                      later date (collectively, the “Platform”). You agree that
                      by accessing the Platform, you have read, understood, and
                      agree to be bound by all of these Terms of Use.
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
                      IF YOU DO NOT AGREE WITH ALL OF THESE TERMS OF USE, THEN
                      YOU ARE EXPRESSLY PROHIBITED FROM USING THE PLATFORM AND
                      YOU MUST DISCONTINUE USE IMMEDIATELY.
                    </p>
                    <p>
                      Supplemental terms and conditions or documents that may be
                      posted on the Platform from time to time are hereby
                      expressly incorporated herein by reference. We reserve the
                      right, in our sole discretion, to make changes or
                      modifications to these Terms of Use at any time and for
                      any reason. We will alert you about any changes by
                      updating the “Last updated” date of these Terms of Use and
                      you waive any right to receive specific notice of each
                      such change. It is your responsibility to periodically
                      review these Terms of Use to stay informed of updates. You
                      will be subject to, and will be deemed to have been made
                      aware of and to have accepted, the changes in any revised
                      Terms of Use by your continued use of the Platform after
                      the date such revised Terms are posted.
                    </p>
                    <p>
                      The information provided on the Platform is not intended
                      for distribution to or use by any person or entity in any
                      jurisdiction or country where such distribution or use
                      would be contrary to law or regulation or which would
                      subject us to any registration requirement within such
                      jurisdiction or country. Accordingly, those persons who
                      choose to access the Platform from other locations do so
                      on their own initiative and are solely responsible for
                      compliance with local laws, if and to the extent local
                      laws are applicable.
                    </p>
                  </SectionText>
                </Section>
                <Section ref={sectionRefs[1]}>
                  <SectionTitle>PURPOSE</SectionTitle>
                  <SectionText>
                    <p>
                      Profile is a consumer product that provides individuals
                      access to a secure digital identity, and personal data
                      ownership, on an inclusive web-based platform powered by
                      blockchain technology. Profile is based on Elastos
                      open-sourced software that provides self-sovereign
                      identity, verified credentials, and a semi-decentralized
                      data storage solution. This revolutionary verified digital
                      profile is one of the first in existence controlled
                      entirely by the user. No personal information will be
                      stored on the platform or our servers, unless Tuum
                      Technologies vault is selected as a storage solution.
                    </p>
                  </SectionText>
                </Section>
                <Section ref={sectionRefs[2]}>
                  <SectionTitle>PRIVACY POLICY</SectionTitle>
                  <SectionText>
                    <p>
                      We care about data privacy and security. Please review our
                      TUUM Privacy Policy at&nbsp;
                      <IonRouterLink href="https://tuum.tech/privacy-policy/">
                        <PrimaryText>
                          https://tuum.tech/privacy-policy/
                        </PrimaryText>
                      </IonRouterLink>
                      &nbsp;which governs the Platform (the “Privacy Policy”).
                    </p>
                    <p>
                      By using the Platform, you agree to be bound by our
                      Privacy Policy, which is incorporated by reference into
                      these Terms of Use. Please be advised the Platform is
                      hosted in the United States. If you access the Platform
                      from the European Union, Asia, or any other region of the
                      world with laws or other requirements governing personal
                      data collection, use, or disclosure that differ from
                      applicable laws in the United States, then through your
                      continued use of the Platform, you are transferring your
                      data to the United States, and you expressly consent to
                      have your data transferred to and processed in the United
                      States. Further, we do not knowingly accept, request, or
                      solicit information from children or knowingly market to
                      children. Therefore, in accordance with the U.S.
                      Children’s Online Privacy Protection Act, if we receive
                      actual knowledge that anyone under the age of 13 has
                      provided personal information to us without the requisite
                      and verifiable parental consent, we will delete that
                      information from the Platform as quickly as is reasonably
                      practical.
                    </p>
                  </SectionText>
                </Section>
                <Section ref={sectionRefs[3]}>
                  <SectionTitle>INTELLECTUAL PROPERTY RIGHTS</SectionTitle>
                  <SectionText>
                    <p>
                      Unless otherwise indicated, the Platform is our
                      proprietary property and all source code, databases,
                      functionality, software, website designs, audio, video,
                      text, photographs, and graphics on the Platform
                      (collectively, the “Content”) and the trademarks, service
                      marks, and logos contained therein (the “Marks”) are owned
                      or controlled by us or licensed to us, and are protected
                      by copyright and trademark laws and various other
                      intellectual property rights and unfair competition laws
                      of the United States, foreign jurisdictions, and
                      international conventions. The Content and the Marks are
                      provided on the Platform “AS IS” for your information and
                      personal use only. Except as expressly provided in these
                      Terms of Use, no part of the Platform and no Content or
                      Marks may be copied, reproduced, aggregated, republished,
                      uploaded, posted, publicly displayed, encoded, translated,
                      transmitted, distributed, sold, licensed, or otherwise
                      exploited for any commercial purpose whatsoever, without
                      our express prior written permission.
                    </p>
                    <p>
                      Provided that you are eligible to use the Platform, you
                      are granted a limited license to access and use the
                      Platform and to download or print a copy of any portion of
                      the Content to which you have properly gained access
                      solely for your personal, non-commercial use. We reserve
                      all rights not expressly granted to you in and to the
                      Platform, Content and the Marks.
                    </p>
                  </SectionText>
                </Section>
                <Section ref={sectionRefs[4]}>
                  <SectionTitle>USER REPRESENTATIONS</SectionTitle>
                  <SectionText>
                    <p>
                      By using the Platform, you represent and warrant that: (1)
                      all registration information you submit will be true,
                      accurate, current, and complete; (2) you will maintain the
                      accuracy of such information and promptly update such
                      registration information as necessary; (3) you have the
                      legal capacity and you agree to comply with these Terms of
                      Use; (4) you are not under the age of 13; (5) not a minor
                      in the jurisdiction in which you reside, or if a minor,
                      you have received parental permission to use the Platform;
                      (6) you will not access the Platform through automated or
                      non-human means, whether through a bot, script or
                      otherwise; (7) you will not use the Platform for any
                      illegal or unauthorized purpose; and (8) your use of the
                      Platform will not violate any applicable law or
                      regulation.
                    </p>
                    <p>
                      If you provide any information that is untrue, inaccurate,
                      not current, or incomplete, we have the right to suspend
                      or terminate your account and refuse any and all current
                      or future use of the Platform (or any portion thereof).
                    </p>
                  </SectionText>
                </Section>
                <Section ref={sectionRefs[5]}>
                  <SectionTitle>USER REGISTRATION</SectionTitle>
                  <SectionText>
                    <p>
                      You may be required to register with the Platform. You
                      agree to keep your DID and/or username, private keys, and
                      password confidential and will be responsible for all use
                      of your account and password. In the event DIDs are not
                      used, we reserve the right to remove, reclaim, or change a
                      username you select if we determine, in our sole
                      discretion, that such username is inappropriate, obscene,
                      or otherwise objectionable.
                    </p>
                  </SectionText>
                </Section>
                <Section ref={sectionRefs[6]}>
                  <SectionTitle>PROHIBITED ACTIVITES</SectionTitle>
                  <SectionText>
                    <p>
                      You may not access or use the Platform for any purpose
                      other than that for which we make the Platform available.
                      The Platform may not be used in connection with any
                      commercial endeavors except those that are specifically
                      endorsed or approved by us.
                    </p>
                    <p>As a user of the Platform, you agree not to:</p>
                  </SectionText>
                  <Indent>
                    <p>
                      1. systematically retrieve data or other content from the
                      Platform to create or compile, directly or indirectly, a
                      collection, compilation, database, or directory without
                      written permission from us.
                    </p>
                    <p>
                      2. make any unauthorized use of the Platform, including
                      collecting DIDs, usernames and/or email addresses of users
                      by electronic or other means for the purpose of sending
                      unsolicited email, or creating user accounts by automated
                      means or under false pretenses.
                    </p>
                    <p>
                      3. use a buying agent or purchasing agent to make
                      purchases on the Platform.
                    </p>
                    <p>
                      4. use the Platform to advertise or offer to sell goods
                      and services.
                    </p>
                    <p>
                      5. circumvent, disable, or otherwise interfere with
                      security-related features of the Platform, including
                      features that prevent or restrict the use or copying of
                      any Content or enforce limitations on the use of the
                      Platform and/or the Content contained therein.
                    </p>
                    <p>
                      6. engage in unauthorized framing of or linking to the
                      Platform.
                    </p>
                    <p>
                      7. trick, defraud, or mislead us and other users,
                      especially in any attempt to learn sensitive account
                      information such as user passwords.
                    </p>
                    <p>
                      8. make improper use of our support services or submit
                      false reports of abuse or misconduct.
                    </p>
                    <p>
                      9. engage in any automated use of the system, such as
                      using scripts to send comments or messages, or using any
                      data mining, robots, or similar data gathering and
                      extraction tools.
                    </p>
                    <p>
                      10. interfere with, disrupt, or create an undue burden on
                      the Platform or the networks or services connected to the
                      Platform.
                    </p>
                    <p>
                      11. attempt to impersonate another user or person or use
                      the username of another user.
                    </p>
                    <p>12. sell or otherwise transfer your profile.</p>
                    <p>
                      13. use any information obtained from the Platform in
                      order to harass, abuse, or harm another person.
                    </p>
                    <p>
                      14. use the Platform as part of any effort to compete with
                      us or otherwise use the Platform and/or the Content for
                      any revenue-generating endeavor or commercial enterprise.
                    </p>
                    <p>
                      15. decipher, decompile, disassemble, or reverse engineer
                      any of the software comprising or in any way making up a
                      part of the Platform.
                    </p>
                    <p>
                      16. attempt to bypass any measures of the Platform
                      designed to prevent or restrict access to the Platform, or
                      any portion of the Platform.
                    </p>
                    <p>
                      17. harass, annoy, intimidate, or threaten any of our
                      employees or agents engaged in providing any portion of
                      the Platform to you.
                    </p>
                    <p>
                      18. delete the copyright or other proprietary rights
                      notice from any Content.
                    </p>
                    <p>
                      19. copy or adapt the Platform’s software, including but
                      not limited to Flash, PHP, HTML, JavaScript, or other
                      code.
                    </p>
                    <p>
                      20. upload or transmit (or attempt to upload or to
                      transmit) viruses, Trojan horses, or other material,
                      including excessive use of capital letters and spamming
                      (continuous posting of repetitive text), that interferes
                      with any party’s uninterrupted use and enjoyment of the
                      Platform or modifies, impairs, disrupts, alters, or
                      interferes with the use, features, functions, operation,
                      or maintenance of the Platform.
                    </p>
                    <p>
                      21. upload or transmit (or attempt to upload or to
                      transmit) any material that acts as a passive or active
                      information collection or transmission mechanism,
                      including without limitation, clear graphics interchange
                      formats (“gifs”), 1×1 pixels, web bugs, cookies, or other
                      similar devices (sometimes referred to as “spyware” or
                      “passive collection mechanisms” or “pcms”).
                    </p>
                    <p>
                      22. except as may be the result of standard search engine
                      or Internet browser usage, use, launch, develop, or
                      distribute any automated system, including without
                      limitation, any spider, robot, cheat utility, scraper, or
                      offline reader that accesses the Platform, or using or
                      launching any unauthorized script or other software.
                    </p>
                    <p>
                      23. disparage, tarnish, or otherwise harm, in our opinion,
                      us and/or the Platform.
                    </p>
                    <p>
                      24. use the Platform in a manner inconsistent with any
                      applicable laws or regulations.
                    </p>
                  </Indent>
                </Section>
                <Section ref={sectionRefs[7]}>
                  <SectionTitle>USER GENERATED CONTRIBUTIONS</SectionTitle>
                  <SectionText>
                    <p>
                      The Platform may invite you to chat, contribute to, or
                      participate in blogs, quizzes, code development, message
                      boards, online forums, and other functionality, and may
                      provide you with the opportunity to create, submit, post,
                      display, transmit, perform, publish, distribute, or
                      broadcast content and materials to us or on the Platform,
                      including but not limited to text, code, writings, video,
                      audio, photographs, graphics, comments, suggestions, or
                      personal information or other material (collectively,
                      &quot;Contributions&quot;). Contributions may be viewable
                      by other users of the Platform and through third-party
                      websites. As such, any Contributions you transmit may be
                      treated as non-confidential and non- proprietary. When you
                      create or make available any Contributions, you thereby
                      represent and warrant that:
                    </p>
                  </SectionText>
                  <Indent>
                    <p>
                      1. the creation, distribution, transmission, public
                      display, or performance, and the accessing, downloading,
                      or copying of your Contributions do not and will not
                      infringe the proprietary rights, including but not limited
                      to the copyright, patent, trademark, trade secret, or
                      moral rights of any third party.
                    </p>
                    <p>
                      2. you are the creator and owner of or have the necessary
                      licenses, rights, consents, releases, and permissions to
                      use and to authorize us, the Platform, and other users of
                      the Platform to use your Contributions in any manner
                      contemplated by the Platform and these Terms of Use.
                    </p>
                    <p>
                      3. you have the written consent, release, and/or
                      permission of each and every identifiable individual
                      person in your Contributions to use the name or likeness
                      of each and every such identifiable individual person to
                      enable inclusion and use of your Contributions in any
                      manner contemplated by the Platform and these Terms of
                      Use.
                    </p>
                    <p>
                      4. your Contributions are not false, inaccurate, or
                      misleading.
                    </p>
                    <p>
                      5. your Contributions are not unsolicited or unauthorized
                      advertising, promotional materials, pyramid schemes, chain
                      letters, spam, mass mailings, or other forms of
                      solicitation.
                    </p>
                    <p>
                      6. your Contributions are not obscene, lewd, lascivious,
                      filthy, violent, harassing, libelous, slanderous, or
                      otherwise objectionable (as determined by us).
                    </p>
                    <p>
                      7. your Contributions do not ridicule, mock, disparage,
                      intimidate, or abuse anyone.
                    </p>
                    <p>
                      8. your Contributions do not advocate the violent
                      overthrow of any government or incite, encourage, or
                      threaten physical harm against another.
                    </p>
                    <p>
                      9. your Contributions do not violate any applicable law,
                      regulation, or rule.
                    </p>
                    <p>
                      10. your Contributions do not violate the privacy or
                      publicity rights of any third party.
                    </p>
                    <p>
                      11. your Contributions do not contain any material that
                      solicits personal information from anyone under the age of
                      18 or exploits people under the age of 18 in a sexual or
                      violent manner.
                    </p>
                    <p>
                      12. your Contributions do not violate any federal or state
                      law concerning child pornography, or otherwise intended to
                      protect the health or well-being of minors;
                    </p>
                    <p>
                      13. your Contributions do not include any offensive
                      comments that are connected to race, national origin,
                      gender, sexual preference, or physical handicap.
                    </p>
                    <p>
                      14. your Contributions do not otherwise violate, or link
                      to material that violates, any provision of these Terms of
                      Use, or any applicable law or regulation.
                    </p>
                    <p>
                      Any use of the Platform in violation of the foregoing
                      violates these Terms of Use and may result in, among other
                      things, termination or suspension of your rights to use
                      the Platform.
                    </p>
                  </Indent>
                </Section>
                <Section ref={sectionRefs[8]}>
                  <SectionTitle>CONTRIBUTION LICENSE</SectionTitle>
                  <SectionText>
                    <p>
                      By posting your Contributions to any part of the Platform
                      or making Contributions accessible to the Platform by
                      linking your account from the Platform to any of your
                      social networking accounts, you automatically grant, and
                      you represent and warrant that you have the right to
                      grant, to us an unrestricted, unlimited, irrevocable,
                      perpetual, non-exclusive, transferable, royalty-free,
                      fully-paid, worldwide right, and license to host, use,
                      copy, reproduce, disclose, sell, resell, publish,
                      broadcast, retitle, archive, store, cache, publicly
                      perform, publicly display, reformat, translate, transmit,
                      excerpt (in whole or in part), and distribute such
                      Contributions (including, without limitation, your image
                      and voice) for any purpose, commercial, advertising, or
                      otherwise, and to prepare derivative works of, or
                      incorporate into other works, such Contributions, and
                      grant and authorize sublicenses of the foregoing. The use
                      and distribution may occur in any media formats and
                      through any media channels.
                    </p>
                    <p>
                      This license will apply to any form, media, or technology
                      now known or hereafter developed, and includes our use of
                      your name, company name, and franchise name, as
                      applicable, and any of the trademarks, service marks,
                      trade names, logos, and personal and commercial images you
                      provide. You waive all moral rights in your Contributions,
                      and you warrant that moral rights have not otherwise been
                      asserted in your Contributions.
                    </p>
                    <p>
                      We do not assert any ownership over your Contributions.
                      You retain full ownership of all of your Contributions and
                      any intellectual property rights or other proprietary
                      rights associated with your Contributions. We are not
                      liable for any statements or representations in your
                      Contributions provided by you in any area on the Platform.
                      You are solely responsible for your Contributions to the
                      Platform and you expressly agree to exonerate us from any
                      and all responsibility and to refrain from any legal
                      action against us regarding your Contributions.
                    </p>
                    <p>
                      We have the right, in our sole and absolute discretion,
                      (1) to edit, redact, or otherwise change any
                      Contributions; (2) to re-categorize any Contributions to
                      place them in more appropriate locations on the Platform;
                      and (3) to pre-screen or delete any Contributions at any
                      time and for any reason, without notice. We have no
                      obligation to monitor your Contributions.
                    </p>
                  </SectionText>
                </Section>
                <Section ref={sectionRefs[9]}>
                  <SectionTitle>
                    MOBILE APPLICATION LICENSE(as applicable)
                  </SectionTitle>
                  <SectionSubTitle>User License</SectionSubTitle>
                  <SectionText>
                    <p>
                      If you download the Platform via a mobile application,
                      then we grant you a revocable, non- exclusive,
                      non-transferable, limited right to install and use the
                      mobile application on wireless electronic devices owned or
                      controlled by you, and to access and use the mobile
                      application on such devices strictly in accordance with
                      the terms and conditions of this mobile application
                      license contained in these Terms of Use. You shall not:
                      (1) decompile, reverse engineer, disassemble, attempt to
                      derive the source code of, or decrypt the application
                      which is not labeled as “open source”; (2) make any
                      modification, adaptation, improvement, enhancement,
                      translation, or derivative work from the application; (3)
                      violate any applicable laws, rules, or regulations in
                      connection with your access or use of the application; (4)
                      remove, alter, or obscure any proprietary notice
                      (including any notice of copyright or trademark) posted by
                      us or the licensors of the application; (5) use the
                      application for any revenue generating endeavor,
                      commercial enterprise, or other purpose for which it is
                      not designed or intended; (6) make the application
                      available over a network or other environment permitting
                      access or use by multiple devices or users at the same
                      time; (7) use the application for creating a product,
                      service, or software that is, directly or indirectly,
                      competitive with or in any way a substitute for the
                      application; (8) use the application to send automated
                      queries to any website or to send any unsolicited
                      commercial e-mail; or (9) use any proprietary information
                      or any of our interfaces or our other intellectual
                      property in the design, development, manufacture,
                      licensing, or distribution of any applications,
                      accessories, or devices for use with the application.
                    </p>
                  </SectionText>
                  <SectionSubTitle>Apple and Android Devices</SectionSubTitle>
                  <SectionText>
                    <p>
                      The following terms apply when you use a mobile
                      application obtained from either the Apple Store or Google
                      Play (each an “App Distributor”) to access the Platform:
                      (1) the license granted to you for our mobile application
                      is limited to a non-transferable license to use the
                      application on a device that utilizes the Apple iOS or
                      Android operating systems, as applicable, and in
                      accordance with the usage rules set forth in the
                      applicable App Distributor’s terms of service; (2) we are
                      responsible for providing any maintenance and support
                      services with respect to the mobile application as
                      specified in the terms and conditions of this mobile
                      application license contained in these Terms of Use or as
                      otherwise required under applicable law, and you
                      acknowledge that each App Distributor has no obligation
                      whatsoever to furnish any maintenance and support services
                      with respect to the mobile application; (3) in the event
                      of any failure of the mobile application to conform to any
                      applicable warranty, you may notify the applicable App
                      Distributor, and the App Distributor, in accordance with
                      its terms and policies, may refund the purchase price, if
                      any, paid for the mobile application, and to the maximum
                      extent permitted by applicable law, the App Distributor
                      will have no other warranty obligation whatsoever with
                      respect to the mobile application; (4) you represent and
                      warrant that (i) you are not located in a country that is
                      subject to a U.S. government embargo, or that has been
                      designated by the U.S. government as a “terrorist
                      supporting” country and (ii) you are not listed on any
                      U.S. government list of prohibited or restricted parties;
                      (5) you must comply with applicable third-party terms of
                      agreement when using the mobile application, e.g., if you
                      have a VoIP application, then you must not be in violation
                      of their wireless data service agreement when using the
                      mobile application; and (6) you acknowledge and agree that
                      the App Distributors are third-party beneficiaries of the
                      terms and conditions in this mobile application license
                      contained in these Terms of Use, and that each App
                      Distributor will have the right (and will be deemed to
                      have accepted the right) to enforce the terms and
                      conditions in this mobile application license contained in
                      these Terms of Use against you as a third-party
                      beneficiary thereof.
                    </p>
                  </SectionText>
                </Section>
                <Section ref={sectionRefs[10]}>
                  <SectionTitle>SUBMISSIONS</SectionTitle>
                  <SectionText>
                    <p>
                      You acknowledge and agree that any questions, comments,
                      quiz answers, polls, suggestions, ideas, feedback, or
                      other information regarding the Platform
                      (&quot;Submissions&quot;) provided by you to us are non-
                      confidential and shall become our sole property. We shall
                      own exclusive rights, including all intellectual property
                      rights, and shall be entitled to the unrestricted use and
                      dissemination of these Submissions for any lawful purpose,
                      commercial or otherwise, without acknowledgment or
                      compensation to you. You hereby waive all moral rights to
                      any such Submissions, and you hereby warrant that any such
                      Submissions are original with you or that you have the
                      right to submit such Submissions. You agree there shall be
                      no recourse against us for any alleged or actual
                      infringement or misappropriation of any proprietary right
                      in your Submissions.
                    </p>
                  </SectionText>
                </Section>
                <Section ref={sectionRefs[11]}>
                  <SectionTitle>THIRD-PARTY WEBSITES AND CONTENT</SectionTitle>
                  <SectionText>
                    <p>
                      The Platform may contain (or you may be sent via the
                      Platform) links to other websites (&quot;Third-Party
                      Websites&quot;) as well as articles, photographs, text,
                      graphics, pictures, designs, music, sound, video,
                      information, applications, software, and other content or
                      items belonging to or originating from third parties
                      (&quot;Third-Party Content&quot;). Such Third-Party
                      Websites and Third-Party Content are not investigated,
                      monitored, or checked for accuracy, appropriateness, or
                      completeness by us, and we are not responsible for any
                      Third-Party Websites accessed through the Platform or any
                      Third-Party Content posted on, available through, or
                      installed from the Platform, including the content,
                      accuracy, offensiveness, opinions, reliability, privacy
                      practices, or other policies of or contained in the Third-
                      Party Websites or the Third-Party Content. Inclusion of,
                      linking to, or permitting the use or installation of any
                      Third-Party Websites or any Third-Party Content does not
                      imply approval or endorsement thereof by us. If you decide
                      to leave the Platform and access the Third-Party Websites
                      or to use or install any Third-Party Content, you do so at
                      your own risk, and you should be aware these Terms of Use
                      no longer govern. You should review the applicable terms
                      and policies, including privacy and data gathering
                      practices, of any website to which you navigate from the
                      Platform or relating to any applications you use or
                      install from the Platform. Any purchases you make through
                      Third-Party Websites will be through other websites and
                      from other companies, and we take no responsibility
                      whatsoever in relation to such purchases which are
                      exclusively between you and the applicable third party.
                      You agree and acknowledge that we do not endorse the
                      products or services offered on Third- Party Websites and
                      you shall hold us harmless from any harm caused by your
                      purchase of such products or services. Additionally, you
                      shall hold us harmless from any losses sustained by you or
                      harm caused to you relating to or resulting in any way
                      from any Third-Party Content or any contact with
                      Third-Party Websites.
                    </p>
                  </SectionText>
                </Section>
                <Section ref={sectionRefs[12]}>
                  <SectionTitle>ADVERTISERS</SectionTitle>
                  <SectionText>
                    <p>
                      We may allow advertisers to display their advertisements
                      and other information in certain areas of the Platform,
                      such as sidebar advertisements or banner advertisements.
                      If you are an advertiser, you shall take full
                      responsibility for any advertisements you place on the
                      Platform and any services provided on the Platform or
                      products sold through those advertisements. Further, as an
                      advertiser, you warrant and represent that you possess all
                      rights and authority to place advertisements on the
                      Platform, including, but not limited to, intellectual
                      property rights, publicity rights, and contractual rights.
                      As an advertiser, you agree that such advertisements are
                      subject to our Digital Millennium Copyright Act (“DMCA”)
                      Notice and Policy provisions as described below, and you
                      understand and agree there will be no refund or other
                      compensation for DMCA takedown-related issues. We simply
                      provide the space to place such advertisements, and we
                      have no other relationship with advertisers.
                    </p>
                  </SectionText>
                </Section>
                <Section ref={sectionRefs[13]}>
                  <SectionTitle>SITE MANAGEMENT</SectionTitle>
                  <SectionText>
                    <p>
                      We reserve the right, but not the obligation, to: (1)
                      monitor the Platform for violations of these Terms of Use;
                      (2) take appropriate legal action against anyone who, in
                      our sole discretion, violates the law or these Terms of
                      Use, including without limitation, reporting such user to
                      law enforcement authorities; (3) in our sole discretion
                      and without limitation, refuse, restrict access to, limit
                      the availability of, or disable (to the extent
                      technologically feasible) any of your Contributions or any
                      portion thereof; (4) in our sole discretion and without
                      limitation, notice, or liability, to remove from the
                      Platform or otherwise disable all files and content that
                      are excessive in size or are in any way burdensome to our
                      systems; and (5) otherwise manage the Platform in a manner
                      designed to protect our rights and property and to
                      facilitate the proper functioning of the Platform.
                    </p>
                  </SectionText>
                </Section>
                <Section ref={sectionRefs[14]}>
                  <SectionTitle>
                    DIGITAL MILLENNIUM COPYRIGHT ACT (DMCA) NOTICE AND POLICY
                  </SectionTitle>
                  <SectionSubTitle>Notifications</SectionSubTitle>
                  <SectionText>
                    <p>
                      We respect the intellectual property rights of others. If
                      you believe that any material available on or through the
                      Platform infringes upon any copyright you own or control,
                      please immediately notify our Designated Copyright Agent
                      using the contact information provided below (a
                      “Notification”). A copy of your Notification will be sent
                      to the person who posted or stored the material addressed
                      in the Notification. Please be advised that pursuant to
                      federal law you may be held liable for damages if you make
                      material misrepresentations in a Notification. Thus, if
                      you are not sure that material located on or linked to by
                      the Platform infringes your copyright, you should consider
                      first contacting an attorney.
                    </p>
                    <p>
                      All Notifications should meet the requirements of DMCA 17
                      U.S.C. § 512(c)(3) and include the following information:
                      (1) A physical or electronic signature of a person
                      authorized to act on behalf of the owner of an exclusive
                      right that is allegedly infringed; (2) identification of
                      the copyrighted work claimed to have been infringed, or,
                      if multiple copyrighted works on the Platform are covered
                      by the Notification, a representative list of such works
                      on the Platform; (3) identification of the material that
                      is claimed to be infringing or to be the subject of
                      infringing activity and that is to be removed or access to
                      which is to be disabled, and information reasonably
                      sufficient to permit us to locate the material; (4)
                      information reasonably sufficient to permit us to contact
                      the complaining party, such as an address, telephone
                      number, and, if available, an email address at which the
                      complaining party may be contacted; (5) a statement that
                      the complaining party has a good faith belief that use of
                      the material in the manner complained of is not authorized
                      by the copyright owner, its agent, or the law; and (6) a
                      statement that the information in the notification is
                      accurate, and under penalty of perjury, that the
                      complaining party is authorized to act on behalf of the
                      owner of an exclusive right that is allegedly infringed
                      upon.
                    </p>
                  </SectionText>
                  <SectionSubTitle>Counter Notifications</SectionSubTitle>
                  <SectionText>
                    <p>
                      If you believe your own copyrighted material has been
                      removed from the Platform as a result of a mistake or
                      misidentification, you may submit a written counter
                      notification to us using the contact information provided
                      below (a “Counter Notification”). To be an effective
                      Counter Notification under the DMCA, your Counter
                      Notification must include substantially the following: (1)
                      identification of the material that has been removed or
                      disabled and the location at which the material appeared
                      before it was removed or disabled; (2) a statement that
                      you consent to the jurisdiction of the Federal District
                      Court in which your address is located, or if your address
                      is outside the United States, for any judicial district in
                      which we are located; (3) a statement that you will accept
                      service of process from the party that filed the
                      Notification or the party&#39;s agent; (4) your name,
                      address, and telephone number; (5) a statement under
                      penalty of perjury that you have a good faith belief that
                      the material in question was removed or disabled as a
                      result of a mistake or misidentification of the material
                      to be removed or disabled; and (6) your physical or
                      electronic signature.
                    </p>
                    <p>
                      If you send us a valid, written Counter Notification
                      meeting the requirements described above, we will restore
                      your removed or disabled material, unless we first receive
                      notice from the party filing the Notification informing us
                      that such party has filed a court action to restrain you
                      from engaging in infringing activity related to the
                      material in question. Please note that if you materially
                      misrepresent that the disabled or removed content was
                      removed by mistake or misidentification, you may be liable
                      for damages, including costs and attorney&#39;s fees.
                      Filing a false Counter Notification constitutes perjury.
                    </p>
                  </SectionText>
                </Section>
                <Section ref={sectionRefs[15]}>
                  <SectionTitle>TERM AND TERMINATION</SectionTitle>
                  <SectionText>
                    <p>
                      These Terms of Use shall remain in full force and effect
                      while you use the Platform. WITHOUT LIMITING ANY OTHER
                      PROVISION OF THESE TERMS OF USE, WE RESERVE THE RIGHT TO,
                      IN OUR SOLE DISCRETION AND WITHOUT NOTICE OR LIABILITY,
                      DENY ACCESS TO AND USE OF THE PLATFORM (INCLUDING BLOCKING
                      CERTAIN IP ADDRESSES OR ELASTOS DIDS), TO ANY PERSON FOR
                      ANY REASON OR FOR NO REASON, INCLUDING WITHOUT LIMITATION
                      FOR BREACH OF ANY REPRESENTATION, WARRANTY, OR COVENANT
                      CONTAINED IN THESE TERMS OF USE OR OF ANY APPLICABLE LAW
                      OR REGULATION. WE MAY TERMINATE YOUR USE OR PARTICIPATION
                      IN THE PLATFORM OR DELETE YOUR ACCOUNT AND ANY CONTENT OR
                      INFORMATION THAT YOU POSTED AT ANY TIME, WITHOUT WARNING,
                      IN OUR SOLE DISCRETION.
                    </p>
                    <p>
                      If we terminate or suspend your account for any reason,
                      you are prohibited from registering and creating a new
                      account under your name, a fake or borrowed name, or the
                      name of any third party, even if you may be acting on
                      behalf of the third party. In addition to terminating or
                      suspending your account, we reserve the right to take
                      appropriate legal action, including without limitation
                      pursuing civil, criminal, and injunctive redress.
                    </p>
                  </SectionText>
                </Section>
                <Section ref={sectionRefs[16]}>
                  <SectionTitle>MODIFICATIONS AND INTERRUPTIONS</SectionTitle>
                  <SectionText>
                    <p>
                      We reserve the right to change, modify, or remove the
                      contents of the Platform at any time or for any reason at
                      our sole discretion without notice. However, we have no
                      obligation to update any information on our Site. We also
                      reserve the right to modify or discontinue all or part of
                      the Platform without notice at any time. We will not be
                      liable to you or any third party for any modification,
                      price change, suspension, or discontinuance of the
                      Platform. We cannot guarantee the Platform will be
                      available at all times. We may experience hardware,
                      software, or other problems or need to perform maintenance
                      related to the Platform, resulting in interruptions,
                      delays, or errors. We reserve the right to change, revise,
                      update, suspend, discontinue, or otherwise modify the
                      Platform at any time or for any reason without notice to
                      you. You agree that we have no liability whatsoever for
                      any loss, damage, or inconvenience caused by your
                      inability to access or use the Platform during any
                      downtime or discontinuance of the Platform. Nothing in
                      these Terms of Use will be construed to obligate us to
                      maintain and support the Platform or to supply any
                      corrections, updates, or releases in connection therewith.
                    </p>
                  </SectionText>
                </Section>
                <Section ref={sectionRefs[17]}>
                  <SectionTitle>GOVERNING LAW</SectionTitle>
                  <SectionText>
                    <p>
                      These Terms of Use and your use of the Platform are
                      governed by and construed in accordance with the laws of
                      the State of North Carolina, USA.
                    </p>
                  </SectionText>
                </Section>
                <Section ref={sectionRefs[18]}>
                  <SectionTitle>DISPUTE RESOLUTION</SectionTitle>
                  <SectionSubTitle>Informal Negotiations</SectionSubTitle>
                  <SectionText>
                    <p>
                      To expedite resolution and control the cost of any
                      dispute, controversy, or claim related to these Terms of
                      Use (each a &quot;Dispute&quot; and collectively, the
                      “Disputes”) brought by either you or us (individually, a
                      “Party” and collectively, the “Parties”), the Parties
                      agree to first attempt to negotiate any Dispute (except
                      those Disputes expressly provided below) informally for at
                      least 45 days before initiating arbitration. Such informal
                      negotiations commence upon written notice from one Party
                      to the other Party.
                    </p>
                  </SectionText>
                  <SectionSubTitle>Binding Arbitration</SectionSubTitle>
                  <SectionText>
                    <p>
                      To expedite resolution and control the cost of any
                      dispute, controversy or claim related to these Terms of
                      Use (each a &quot;Dispute&quot; and collectively,
                      “Disputes”), any Dispute brought by either you or us
                      (individually, a “Party” and collectively, the “Parties”)
                      shall be finally and exclusively resolved by binding
                      arbitration. YOU UNDERSTAND THAT WITHOUT THIS PROVISION,
                      YOU WOULD HAVE THE RIGHT TO SUE IN COURT AND HAVE A JURY
                      TRIAL. The arbitration shall be commenced and conducted
                      under the Commercial Arbitration Rules of the American
                      Arbitration Association (&quot;AAA&quot;) and, where
                      appropriate, the AAA’s Supplementary Procedures for
                      Consumer Related Disputes (&quot;AAA Consumer
                      Rules&quot;), both of which are available at the AAA
                      website www.adr.org. Your arbitration fees and your share
                      of arbitrator compensation shall be governed by the AAA
                      Consumer Rules and, where appropriate, limited by the AAA
                      Consumer Rules. The arbitration may be conducted in
                      person, through the submission of documents, by phone, or
                      online. The arbitrator will make a decision in writing,
                      but need not provide a statement of reasons unless
                      requested by either Party. The arbitrator must follow
                      applicable law, and any award may be challenged if the
                      arbitrator fails to do so. Except where otherwise required
                      by the applicable AAA rules or applicable law, the
                      arbitration will take place in New Hanover County, North
                      Carolina. Except as otherwise provided herein, the Parties
                      may litigate in court to compel arbitration, stay
                      proceedings pending arbitration, or to confirm, modify,
                      vacate, or enter judgment on the award entered by the
                      arbitrator.
                    </p>
                    <p>
                      If for any reason, a Dispute proceeds in court rather than
                      arbitration, the Dispute shall be commenced or prosecuted
                      in the state and federal courts located in New Hanover
                      County, North Carolina, and the Parties hereby consent to,
                      and waive all defenses of lack of, personal jurisdiction,
                      and forum non conveniens with respect to venue and
                      jurisdiction in such state and federal courts. Application
                      of the United Nations Convention on Contracts for the
                      International Sale of Goods and the Uniform Computer
                      Information Transaction Act (UCITA) are excluded from
                      these Terms of Use.
                    </p>
                  </SectionText>
                  <SectionSubTitle>Restrictions</SectionSubTitle>
                  <SectionText>
                    <p>
                      The Parties agree that any arbitration shall be limited to
                      the Dispute between the Parties individually. To the full
                      extent permitted by law, (a) no arbitration shall be
                      joined with any other proceeding; (b) there is no right or
                      authority for any Dispute to be arbitrated on a
                      class-action basis or to utilize class action procedures;
                      and (c) there is no right or authority for any Dispute to
                      be brought in a purported representative capacity on
                      behalf of the general public or any other persons.
                    </p>
                  </SectionText>
                </Section>
                <Section ref={sectionRefs[19]}>
                  <SectionTitle>CORRECTIONS</SectionTitle>
                  <SectionText>
                    <p>
                      There may be information on the Platform that contains
                      typographical errors, inaccuracies, or omissions that may
                      relate to the Platform, including descriptions, pricing,
                      availability, and various other information. We reserve
                      the right to correct any errors, inaccuracies, or
                      omissions and to change or update the information on the
                      Platform at any time, without prior notice.
                    </p>
                  </SectionText>
                </Section>
                <Section ref={sectionRefs[20]}>
                  <SectionTitle>DISCLAIMER</SectionTitle>
                  <SectionText>
                    <p>
                      THE PLATFORM IS PROVIDED ON AN AS-IS AND AS-AVAILABLE
                      BASIS. YOU AGREE THAT YOUR USE OF THE PLATFORM SERVICES
                      WILL BE AT YOUR SOLE RISK. TO THE FULLEST EXTENT PERMITTED
                      BY LAW, WE DISCLAIM ALL WARRANTIES, EXPRESS OR IMPLIED, IN
                      CONNECTION WITH THE PLATFORM AND YOUR USE THEREOF,
                      INCLUDING, WITHOUT LIMITATION, THE IMPLIED WARRANTIES OF
                      MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND
                      NON-INFRINGEMENT. WE MAKE NO WARRANTIES OR REPRESENTATIONS
                      ABOUT THE ACCURACY OR COMPLETENESS OF THE PLATFORM’S
                      CONTENT OR THE CONTENT OF ANY WEBSITES LINKED TO THIS SITE
                      AND WE WILL ASSUME NO LIABILITY OR RESPONSIBILITY FOR ANY
                      (1) ERRORS, MISTAKES, OR INACCURACIES OF CONTENT AND
                      MATERIALS, (2) PERSONAL INJURY OR PROPERTY DAMAGE, OF ANY
                      NATURE WHATSOEVER, RESULTING FROM YOUR ACCESS TO AND USE
                      OF THE PLATFORM, (3) ANY UNAUTHORIZED ACCESS TO OR USE OF
                      OUR SECURE SERVERS AND/OR ANY AND ALL PERSONAL INFORMATION
                      AND/OR FINANCIAL INFORMATION STORED THEREIN, (4) ANY
                      INTERRUPTION OR CESSATION OF TRANSMISSION TO OR FROM THE
                      PLATFORM, (5) ANY BUGS, VIRUSES, TROJAN HORSES, OR THE
                      LIKE WHICH MAY BE TRANSMITTED TO OR THROUGH THE PLATFORM
                      BY ANY THIRD PARTY, AND/OR (6) ANY ERRORS OR OMISSIONS IN
                      ANY CONTENT AND MATERIALS OR FOR ANY LOSS OR DAMAGE OF ANY
                      KIND INCURRED AS A RESULT OF THE USE OF ANY CONTENT
                      POSTED, TRANSMITTED, OR OTHERWISE MADE AVAILABLE VIA THE
                      PLATFORM. WE DO NOT WARRANT, ENDORSE, GUARANTEE, OR ASSUME
                      RESPONSIBILITY FOR ANY PRODUCT OR SERVICE ADVERTISED OR
                      OFFERED BY A THIRD PARTY THROUGH THE PLATFORM, ANY
                      HYPERLINKED WEBSITE, OR ANY WEBSITE OR MOBILE APPLICATION
                      FEATURED IN ANY BANNER OR OTHER ADVERTISING, AND WE WILL
                      NOT BE A PARTY TO OR IN ANY WAY BE RESPONSIBLE FOR
                      MONITORING ANY TRANSACTION BETWEEN YOU AND ANY THIRD-PARTY
                      PROVIDERS OF PRODUCTS OR SERVICES. AS WITH THE PURCHASE OF
                      A PRODUCT OR SERVICE THROUGH ANY MEDIUM OR IN ANY
                      ENVIRONMENT, YOU SHOULD USE YOUR BEST JUDGMENT AND
                      EXERCISE CAUTION WHERE APPROPRIATE.
                    </p>
                  </SectionText>
                </Section>
                <Section ref={sectionRefs[21]}>
                  <SectionTitle>LIMITATIONS OF LIABILITY</SectionTitle>
                  <SectionText>
                    <p>
                      IN NO EVENT WILL WE OR OUR DIRECTORS, EMPLOYEES, OR AGENTS
                      BE LIABLE TO YOU OR ANY THIRD PARTY FOR ANY DIRECT,
                      INDIRECT, CONSEQUENTIAL, EXEMPLARY, INCIDENTAL, SPECIAL,
                      OR PUNITIVE DAMAGES, INCLUDING LOST PROFIT, LOST REVENUE,
                      LOSS OF DATA, OR OTHER DAMAGES ARISING FROM YOUR USE OF
                      THE PLATFORM, EVEN IF WE HAVE BEEN ADVISED OF THE
                      POSSIBILITY OF SUCH DAMAGES.
                    </p>
                  </SectionText>
                </Section>
                <Section ref={sectionRefs[22]}>
                  <SectionTitle>INDEMNIFICATION</SectionTitle>
                  <SectionText>
                    <p>
                      You agree to defend, indemnify, and hold us harmless,
                      including our subsidiaries, affiliates, and all of our
                      respective officers, agents, partners, and employees, from
                      and against any loss, damage, liability, claim, or demand,
                      including reasonable attorneys’ fees and expenses, made by
                      any third party due to or arising out of: (1) your
                      Contributions; (2) use of the Platform; (3) breach of
                      these Terms of Use; (4) any breach of your representations
                      and warranties set forth in these Terms of Use; (5) your
                      violation of the rights of a third party, including but
                      not limited to intellectual property rights; or (6) any
                      overt harmful act toward any other user of the Platform
                      with whom you connected via the Platform. Notwithstanding
                      the foregoing, we reserve the right, at your expense, to
                      assume the exclusive defense and control of any matter for
                      which you are required to indemnify us, and you agree to
                      cooperate, at your expense, with our defense of such
                      claims. We will use reasonable efforts to notify you of
                      any such claim, action, or proceeding which is subject to
                      this indemnification upon becoming aware of it.
                    </p>
                  </SectionText>
                </Section>
                <Section ref={sectionRefs[23]}>
                  <SectionTitle>USER DATA</SectionTitle>
                  <SectionText>
                    <p>
                      We will maintain certain data that you transmit to the
                      Platform for the purpose of managing the Platform, as well
                      as data relating to your use of the Platform. Although we
                      perform regular routine backups of data, you are solely
                      responsible for all data that you transmit or that relates
                      to any activity you have undertaken using the Platform.
                      You agree that we shall have no liability to you for any
                      loss or corruption of any such data, and you hereby waive
                      any right of action against us arising from any such loss
                      or corruption of such data.
                    </p>
                  </SectionText>
                </Section>
                <Section ref={sectionRefs[24]}>
                  <SectionTitle>
                    ELECTRONIC COMMUNICATIONS, TRANSACTIONS, AND SIGNATURES
                  </SectionTitle>
                  <SectionText>
                    <p>
                      Visiting the Platform, sending us emails, and completing
                      online forms constitute electronic communications. You
                      consent to receive electronic communications, and you
                      agree that all agreements, notices, disclosures, and other
                      communications we provide to you electronically, via email
                      and on the Platform, satisfy any legal requirement that
                      such communication be in writing. YOU HEREBY AGREE TO THE
                      USE OF ELECTRONIC SIGNATURES, CONTRACTS, ORDERS, AND OTHER
                      RECORDS, AND TO ELECTRONIC DELIVERY OF NOTICES, POLICIES,
                      AND RECORDS OF TRANSACTIONS INITIATED OR COMPLETED BY US
                      OR VIA THE PLATFORM. You hereby waive any rights or
                      requirements under any statutes, regulations, rules,
                      ordinances, or other laws in any jurisdiction which
                      require an original signature or delivery or retention of
                      non-electronic records, or to payments or the granting of
                      credits by any means other than electronic means.
                    </p>
                  </SectionText>
                </Section>
                <Section ref={sectionRefs[25]}>
                  <SectionTitle>CALIFORNIA USERS AND RESIDENTS</SectionTitle>
                  <SectionText>
                    <p>
                      If any complaint with us is not satisfactorily resolved,
                      you can contact the Complaint Assistance Unit of the
                      Division of Consumer Services of the California Department
                      of Consumer Affairs in writing at 1625 North Market Blvd.,
                      Suite N 112, Sacramento, California 95834 or by telephone
                      at (800) 952- 5210 or (916) 445-1254.
                    </p>
                  </SectionText>
                </Section>
                <Section ref={sectionRefs[26]}>
                  <SectionTitle>MISCELLANEOUS</SectionTitle>
                  <SectionText>
                    <p>
                      These Terms of Use and any policies or operating rules
                      posted by us on the Platform constitute the entire
                      agreement and understanding between you and us. Our
                      failure to exercise or enforce any right or provision of
                      these Terms of Use shall not operate as a waiver of such
                      right or provision. These Terms of Use operate to the
                      fullest extent permissible by law. We may assign any or
                      all of our rights and obligations to others at any time.
                      We shall not be responsible or liable for any loss,
                      damage, delay, or failure to act caused by any cause
                      beyond our reasonable control. If any provision or part of
                      a provision of these Terms of Use is determined to be
                      unlawful, void, or unenforceable, that provision or part
                      of the provision is deemed severable from these Terms of
                      Use and does not affect the validity and enforceability of
                      any remaining provisions. There is no joint venture,
                      partnership, employment or agency relationship created
                      between you and us as a result of these Terms of Use or
                      use of the Platform. You agree that these Terms of Use
                      will not be construed against us by virtue of having
                      drafted them. You hereby waive any and all defenses you
                      may have based on the electronic form of these Terms of
                      Use and the lack of signing by the parties hereto to
                      execute these Terms of Use.
                    </p>
                  </SectionText>
                </Section>
                <Section ref={sectionRefs[27]}>
                  <SectionTitle>CONTACT US</SectionTitle>
                  <SectionText>
                    <p>
                      In order to resolve a complaint regarding the Platform or
                      to receive further information regarding use of the
                      Platform, please contact us at:
                    </p>
                    Blockchain Limited
                    <br />
                    PO Box 1373
                    <br />
                    Hampstead, NC 28443
                    <br />
                    <PrimaryText>contact@tuum.tech</PrimaryText>
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
const TocText = styled(PrimaryText)`
  & h3 {
    margin-bottom: 10px;
  }
`;

export default SettingsTerms;
