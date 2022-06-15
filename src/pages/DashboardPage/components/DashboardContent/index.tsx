import React, { useEffect, useState } from 'react';
import { IonList, IonLabel } from '@ionic/react';
import { useRecoilValue } from 'recoil';

import { TabsContainer } from 'src/components/profile/ProfileComponent/PublicProfileTabs';
import DashboardHome from './Home';
// import DashboardStatus from './Status';
import DashboardBadges from './Badges';
import DashboardNFTs from './NFTs';
import SyncBar from 'src/components/SyncBar';
import styled from 'styled-components';
import { TabItem } from 'src/elements-v2/tabs';
import request from 'src/baseplate/request';
import { FullProfileAtom } from 'src/Atoms/Atoms';

const SyncDiv = styled.div`
  margin-left: 25px;
  margin-top: 15px;
  margin-right: 25px;
`;

const Wrapper = styled.div`
  background: #f7fafc;
`;

const TabList = styled(IonList)`
  background: none;
  padding-left: 20px;
`;

interface Props {
  onTutorialStart: () => void;
  sessionItem: ISessionItem;
  followerDids: string[];
  followingDids: string[];
  mutualDids: string[];
}

const DashboardContent: React.FC<Props> = ({
  onTutorialStart,
  sessionItem,
  followerDids,
  followingDids,
  mutualDids
}) => {
  const profile = useRecoilValue(FullProfileAtom);
  const [active, setActive] = useState('home');
  const [nfts, setNFTs] = useState<any[]>([]);
  const [ethCursor, setEthCursor] = useState('');
  const [escCursor, setEscCursor] = useState('');

  useEffect(() => {
    if (profile?.ethaddressCredential.address) {
      getNFTEthCollectionAssets(profile?.ethaddressCredential.address);
    }
    if (profile?.escaddressCredential.address) {
      getNFTEscCollectionAssets(profile?.escaddressCredential.address);
    }
  }, [profile]);

  const getNFTEthCollectionAssets = async (address: string) => {
    const ethResponse: any = await request(
      `${process.env.REACT_APP_PROFILE_API_SERVICE_URL}/v1/nft_collection_router/ethaddress?address=${address}&cursor=${ethCursor}`,
      {
        method: 'GET',
        headers: {
          'content-Type': 'application/json',
          Authorization: `${process.env.REACT_APP_PROFILE_API_SERVICE_KEY}`
        }
      }
    );
    console.log('ethResponse=====>', ethResponse);
    setNFTs([...nfts, ...ethResponse.data.assets]);
    setEthCursor(ethResponse.data.cursor ?? '');
  };

  const getNFTEscCollectionAssets = async (address: string) => {
    const escResponse: any = await request(
      `${process.env.REACT_APP_PROFILE_API_SERVICE_URL}/v1/nft_collection_router/escaddress?address=${address}&cursor=${escCursor}`,
      {
        method: 'GET',
        headers: {
          'content-Type': 'application/json',
          Authorization: `${process.env.REACT_APP_PROFILE_API_SERVICE_KEY}`
        }
      }
    );
    console.log('escResponse=====>', escResponse);
    // setNFTs([...nfts, ...escResponse.data.assets]);
    // setEscCursor(escResponse.data.cursor ?? '');
  };

  const fetchMoreEthData = () => {
    if (profile?.ethaddressCredential.address && ethCursor) {
      getNFTEthCollectionAssets(profile.ethaddressCredential.address);
    }
  };

  const fetchMoreEscData = () => {
    if (profile?.escaddressCredential.address && escCursor) {
      getNFTEscCollectionAssets(profile?.escaddressCredential.address);
    }
  };

  return (
    <Wrapper>
      <TabsContainer template="default">
        <TabList>
          <TabItem active={active === 'home'} onClick={() => setActive('home')}>
            <IonLabel>Home</IonLabel>
          </TabItem>
          {/* <TabItem
          active={active === 'status'}
          onClick={() => setActive('status')}
        >
          <IonLabel>Status</IonLabel>
        </TabItem> */}
          <TabItem
            active={active === 'badges'}
            onClick={() => setActive('badges')}
          >
            <IonLabel>Badges</IonLabel>
          </TabItem>
          <TabItem active={active === 'NFTs'} onClick={() => setActive('NFTs')}>
            <IonLabel>NFTs</IonLabel>
          </TabItem>
        </TabList>

        {active === 'home' && (
          <>
            <SyncDiv>
              <SyncBar session={sessionItem}></SyncBar>
            </SyncDiv>
            <DashboardHome
              onTutorialStart={onTutorialStart}
              activeTab={tab => {
                setActive(tab);
              }}
              followerDids={followerDids}
              followingDids={followingDids}
              mutualDids={mutualDids}
            />
          </>
        )}
        {/* {active === 'status' && <DashboardStatus />} */}
        {active === 'badges' && <DashboardBadges sessionItem={sessionItem} />}
        {active === 'NFTs' && (
          <DashboardNFTs
            nfts={nfts}
            ethCursor={ethCursor}
            escCursor={escCursor}
            fetchMoreEthData={fetchMoreEthData}
            fetchMoreEscData={fetchMoreEscData}
          />
        )}
      </TabsContainer>
    </Wrapper>
  );
};

export default DashboardContent;
