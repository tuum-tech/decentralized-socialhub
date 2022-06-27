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
import { CredentialType, DidcredsService } from 'src/services/didcreds.service';

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
  activeTab?: any;
  setCurrentTab: (active: string) => void;
}

const DashboardContent: React.FC<Props> = ({
  onTutorialStart,
  sessionItem,
  followerDids,
  followingDids,
  mutualDids,
  activeTab,
  setCurrentTab
}) => {
  const profile = useRecoilValue(FullProfileAtom);
  const [active, setActive] = useState('home');
  const [nfts, setNFTs] = useState<any[]>([]);

  useEffect(() => {
    setActive(activeTab);
  }, [activeTab]);

  useEffect(() => {
    (async () => {
      const ethWallet = await DidcredsService.getCredentialValue(
        sessionItem,
        CredentialType.ETHAddress.toLowerCase()
      );
      if (ethWallet) {
        getNFTEthCollectionAssets(ethWallet);
      } else {
        console.log(
          `Error fetching NFTs for address ${profile?.ethaddressCredential.address} as this VC was not issued by Tuum Tech`
        );
      }
      const escWallet = await DidcredsService.getCredentialValue(
        sessionItem,
        CredentialType.ESCAddress.toLowerCase()
      );
      if (ethWallet) {
        getNFTEscCollectionAssets(escWallet);
      } else {
        console.log(
          `Error fetching NFTs for address ${profile?.escaddressCredential.address} as this VC was not issued by Tuum Tech`
        );
      }
    })();
  }, [profile, sessionItem]);

  const getNFTEthCollectionAssets = async (address: string) => {
    const ethResponse: any = await request(
      `${process.env.REACT_APP_PROFILE_API_SERVICE_URL}/v1/nft_collection_router/ethaddress?address=${address}&chain=eth`,
      {
        method: 'GET',
        headers: {
          'content-Type': 'application/json',
          Authorization: `${process.env.REACT_APP_PROFILE_API_SERVICE_KEY}`
        }
      }
    );
    console.log('ethResponse=====>', ethResponse);
    if (ethResponse.data && ethResponse.data.nfts.length > 0) {
      setNFTs(nfts => [...nfts, ...ethResponse.data.nfts]);
    }
  };

  const getNFTEscCollectionAssets = async (address: string) => {
    const escResponse: any = await request(
      `${process.env.REACT_APP_PROFILE_API_SERVICE_URL}/v1/nft_collection_router/escaddress?address=${address}`,
      {
        method: 'GET',
        headers: {
          'content-Type': 'application/json',
          Authorization: `${process.env.REACT_APP_PROFILE_API_SERVICE_KEY}`
        }
      }
    );
    console.log('escResponse=====>', escResponse);
    if (escResponse.data && escResponse.data.nfts.length > 0) {
      setNFTs(nfts => [...nfts, ...escResponse.data.nfts]);
    }
  };

  const fetchMoreEthData = () => {
    if (profile?.ethaddressCredential.address) {
      getNFTEthCollectionAssets(profile.ethaddressCredential.address);
    }
  };

  const fetchMoreEscData = () => {
    if (profile?.escaddressCredential.address) {
      getNFTEscCollectionAssets(profile.escaddressCredential.address);
    }
  };

  return (
    <Wrapper>
      <TabsContainer template="default">
        <TabList>
          <TabItem
            active={active === 'home'}
            onClick={() => {
              setActive('home');
              setCurrentTab('home');
            }}
          >
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
            onClick={() => {
              setActive('badges');
              setCurrentTab('badges');
            }}
          >
            <IonLabel>Badges</IonLabel>
          </TabItem>
          <TabItem
            active={active === 'NFTs'}
            onClick={() => {
              setActive('NFTs');
              setCurrentTab('NFTs');
            }}
          >
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
            fetchMoreEthData={fetchMoreEthData}
            fetchMoreEscData={fetchMoreEscData}
          />
        )}
      </TabsContainer>
    </Wrapper>
  );
};

export default DashboardContent;
