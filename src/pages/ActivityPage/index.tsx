import React, { useEffect, useState } from 'react';
import { IonContent, IonPage, IonGrid, IonRow, IonCol } from '@ionic/react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { makeSelectSession } from 'src/store/users/selectors';
import { setSession } from 'src/store/users/actions';
import LeftSideMenu from 'src/components/layouts/LeftSideMenu';
import { TuumTechScriptService } from 'src/services/script.service';

import ActivityTimeline from './components/ActivityTimeline';
import VerificationRequests from './components/VerificationRequests';
import MyRequests from './components/MyRequests';
import Referrals from './components/Referrals';
import ActivityPageHeader, {
  Header,
  PageTitle,
  ActivityTabsContainer
} from './components/ActivityPageHeader';

import { InferMappedProps, SubState } from './types';
import style from './style.module.scss';

const ActivityPage: React.FC<InferMappedProps> = ({
  eProps,
  ...props
}: InferMappedProps) => {
  const [active, setActive] = useState('timeline'); // timeline or veificationrequests
  const [myverifications, setMyVerification] = useState<VerificationRequest[]>(
    []
  );
  const [verificationRequests, setVerificationRequests] = useState<
    VerificationRequest[]
  >([]);
  const [referrals, setReferrals] = useState<IReferral[]>([]);

  const fetchMyVerifications = async () => {
    const requests_by_me: VerificationRequest[] = await TuumTechScriptService.getVerificationRequests(
      props.session.did,
      true
    );
    setMyVerification(requests_by_me);
  };

  const fetchVerificationRequestToMe = async () => {
    const vRequests: VerificationRequest[] = await TuumTechScriptService.getVerificationRequests(
      props.session.did,
      false
    );
    setVerificationRequests(vRequests);
  };

  const fetchReferrals = async () => {
    const referrals: IReferral[] = await TuumTechScriptService.getReferrals(
      props.session.did
    );
    setReferrals(referrals);
  };

  useEffect(() => {
    (async () => {
      await fetchMyVerifications();
      await fetchVerificationRequestToMe();
      await fetchReferrals();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.session.did]);

  const [showNewVerificationModal, setShowNewVerificationModal] = useState(
    false
  );

  return (
    <>
      <IonPage className={style['activitypage']}>
        <IonContent className={style['content-page']}>
          <IonGrid className={style['profilepagegrid']}>
            <IonRow className={style['profilecontent']}>
              <IonCol size="2" className={style['left-panel']}>
                <LeftSideMenu />
              </IonCol>
              <IonCol size="10" className={style['right-panel']}>
                <Header>
                  <PageTitle>Activities</PageTitle>
                </Header>
                <ActivityTabsContainer template="default">
                  <ActivityPageHeader
                    active={active}
                    setActive={setActive}
                    myverifications={myverifications.length}
                    referrals={
                      referrals.filter(v => v.sign_up_date == undefined).length
                    }
                    verificationRequests={
                      verificationRequests.filter(x => x.status === 'requested')
                        .length
                    }
                    newVerificationClicked={() =>
                      setShowNewVerificationModal(!showNewVerificationModal)
                    }
                  />
                  {active === 'timeline' && (
                    <ActivityTimeline session={props.session} />
                  )}
                  {active === 'myrequests' && (
                    <MyRequests
                      verifications={myverifications}
                      session={props.session}
                      showNewVerificationModal={showNewVerificationModal}
                      closeNewVerificationModal={() =>
                        setShowNewVerificationModal(false)
                      }
                      refresh={fetchMyVerifications}
                    />
                  )}
                  {active === 'verificationrequests' && (
                    <VerificationRequests
                      session={props.session}
                      verifications={verificationRequests}
                      forceReFetch={async () => {
                        await fetchVerificationRequestToMe();
                      }}
                    />
                  )}
                  {active === 'referrals' && (
                    <Referrals session={props.session} referrals={referrals} />
                  )}
                </ActivityTabsContainer>
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonContent>
      </IonPage>
    </>
  );
};

export const mapStateToProps = createStructuredSelector<SubState, SubState>({
  session: makeSelectSession()
});

export function mapDispatchToProps(dispatch: any) {
  return {
    eProps: {
      setSession: (props: { session: ISessionItem }) =>
        dispatch(setSession(props))
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ActivityPage);
