import React, { useEffect, useRef, useState } from 'react';
import { IonContent } from '@ionic/react';

import { FollowService } from 'src/services/follow.service';

import ProfileComponent from 'src/components/profile/ProfileComponent';
interface Props {
  targetDid: string;
  publicFields?: string[];
}

const ProfileComp: React.FC<Props> = ({
  targetDid,
  publicFields = [
    'follower',
    'following',
    'about',
    'experience',
    'education',
    'social'
  ]
}: Props) => {
  const contentRef = useRef<HTMLIonContentElement | null>(null);
  const aboutRef = useRef<HTMLDivElement | null>(null);
  const experienceRef = useRef<HTMLDivElement | null>(null);
  const educationRef = useRef<HTMLDivElement | null>(null);
  const [scrollTop, setScrollTop] = useState(0);

  const [followerDids, setFollowerDids] = useState<string[]>([]);
  const [followingDids, setFollowingDids] = useState<string[]>([]);

  useEffect(() => {
    (async () => {
      const followerDids = await FollowService.getFollowerDids(targetDid);
      setFollowerDids(followerDids);

      const followingdids = await FollowService.getFollowingDids(targetDid);
      setFollowingDids(followingdids);
    })();
  }, [targetDid]);

  const scrollToElement = (cardName: string) => {
    let point: number = 0;
    let adjust = 0;
    if (scrollTop < 176) adjust = 292 - scrollTop;
    else {
      adjust = 260 - scrollTop;
    }

    if (cardName === 'about') {
      point = 0;
    }
    if (cardName === 'experience') {
      point = (experienceRef.current!.getBoundingClientRect().top -
        adjust) as number;
    }
    if (cardName === 'education') {
      point = (educationRef.current!.getBoundingClientRect().top -
        adjust) as number;
    }
    contentRef.current && contentRef.current.scrollToPoint(0, point, 200);
  };

  const handleScroll = (e: any) => {
    setScrollTop(e.detail.scrollTop);
  };

  return (
    <IonContent
      style={{
        height: 'calc(100% - 83px'
      }}
      ref={contentRef}
      scrollEvents={true}
      onIonScroll={handleScroll}
    >
      <ProfileComponent
        publicFields={publicFields}
        targetDid={targetDid}
        scrollToElement={scrollToElement}
        aboutRef={aboutRef}
        experienceRef={experienceRef}
        educationRef={educationRef}
        followerDids={followerDids}
        followingDids={followingDids}
      />
    </IonContent>
  );
};

export default ProfileComp;
