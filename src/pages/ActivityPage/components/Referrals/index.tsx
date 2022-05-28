import React, { useEffect, useState } from 'react';
import {
  IonCardHeader,
  IonText,
  IonLabel,
  IonSelect,
  IonSelectOption,
  IonSearchbar,
  IonContent
} from '@ionic/react';
import styled from 'styled-components';

import UserRows from './UserRows';
import TopInfo from './TopInfo';
import style from '../../style.module.scss';

export const PageContainer = styled.div`
  padding: 0 20px 20px 20px;
`;

export const PageContent = styled.div`
  background: #ffffff;
  box-shadow: 0px 0px 1px rgba(12, 26, 75, 0.24),
    0px 3px 8px -1px rgba(50, 50, 71, 0.05);
  border-radius: 16px;
  padding: 17px 20px;
  margin-top: 38px;
`;

interface Props {
  session: ISessionItem;
  referrals: IReferral[];
}

const Referrals: React.FC<Props> = ({ session, referrals }: Props) => {
  const [selectedStatus, setSelectedStatus] = useState('');
  const [filteredRefersals, setFilteredReferals] = useState(referrals || []);
  const [sort, setSort] = useState(-1);
  const [searchQuery, setSearchQuery] = useState('');
  useEffect(() => {
    if (selectedStatus === '') {
      setFilteredReferals(referrals || []);
    } else if (selectedStatus === 'completed') {
      setFilteredReferals(
        (referrals || []).filter((r: IReferral) => r.sign_up_date)
      );
    } else if (selectedStatus === 'requested') {
      setFilteredReferals(
        (referrals || []).filter((r: IReferral) => r.sign_up_date === undefined)
      );
    }
  }, [selectedStatus, referrals]);

  return (
    <PageContainer>
      <TopInfo referrals={referrals || []} selectStatus={setSelectedStatus} />
      <PageContent>
        <IonCardHeader className={style['card-header']}>
          <IonContent className={style['searchcomponent']}>
            <IonSearchbar
              onIonChange={(e: any) => setSearchQuery(e.detail.value)}
              placeholder="Search people, pages by name or DID"
              className={style['search-input']}
              value={searchQuery}
            ></IonSearchbar>
          </IonContent>
          <IonText className={style['selectinput']}>
            <IonLabel className={style['selectinput_label']}>Sort by</IonLabel>
            <IonSelect
              className={style['selectinput_field']}
              placeholder="Latest"
              onIonChange={e => setSort(e.detail.value)}
            >
              <IonSelectOption value={0}>Latest</IonSelectOption>
              <IonSelectOption value={1}>Oldest</IonSelectOption>
            </IonSelect>
          </IonText>
        </IonCardHeader>
        <UserRows
          referrals={filteredRefersals}
          session={session}
          sortBy={sort}
          searchQuery={searchQuery}
        />
      </PageContent>
    </PageContainer>
  );
};

export default Referrals;
