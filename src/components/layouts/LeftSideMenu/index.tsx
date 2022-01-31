import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { IonBadge, IonItem, IonLabel, IonList } from '@ionic/react';

import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { makeSelectSession } from 'src/store/users/selectors';
import { setSession } from 'src/store/users/actions';
import { InferMappedProps, SubState } from './types';

import { UserService } from 'src/services/user.service';

import Logo from 'src/elements/Logo';
import FooterLinks from './components/FooterLinks';
import ConnectionMenu from './components/ConnectionMenu';

import {
  HouseSvg,
  PeopleSvg,
  SpaceSvg,
  SearchSvg,
  SettingsSvg,
  ActivitySvg,
  SignOutSvg
} from './components/icons';
import HelpModalContent, { HelpModal } from './modals/Help';
import ReportModalContent, { ReportModal } from './modals/Report';
import ContactModalContent, { ContactModal } from './modals/Contact';

import style from './style.module.scss';
import { TuumTechScriptService } from 'src/services/script.service';

const LeftSideMenu: React.FC<InferMappedProps> = ({
  eProps,
  ...props
}: InferMappedProps) => {
  const history = useHistory();
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [requestsCount, setRequestsCount] = useState(0);

  const toggleHelpSupport = () => {
    setShowSupportModal(!showSupportModal);
  };
  const toggleReportProblem = () => {
    setShowReportModal(!showReportModal);
  };
  const toggleContactUs = () => {
    setShowContactModal(!showContactModal);
  };

  const fetchVerificationRequestsCount = async (): Promise<void> => {
    let requests: VerificationRequest[] = await TuumTechScriptService.getVerificationRequests(
      props.session.did,
      false
    );
    setRequestsCount(requests.filter(x => x.status === 'requested').length);
  };
  useEffect(() => {
    (async () => {
      await fetchVerificationRequestsCount();
    })();
  }, [fetchVerificationRequestsCount]);

  return (
    <div className={style['navbar']}>
      <Logo />
      <IonList>
        <IonItem
          className={
            history.location.pathname === '/profile'
              ? style['item-active']
              : style['item-link']
          }
          onClick={() => history.push('/profile')}
        >
          <HouseSvg />
          <IonLabel>
            <h3>Dashboard</h3>
          </IonLabel>
        </IonItem>
        <IonItem
          className={
            history.location.pathname === '/manager'
              ? style['item-active']
              : style['item-link']
          }
          onClick={async () => history.push('/manager')}
        >
          <PeopleSvg />
          <IonLabel>
            <h3>Profile Manager</h3>
          </IonLabel>
        </IonItem>

        <ConnectionMenu session={props.session} />
        {/* in a progress */}
        <IonItem
          className={
            history.location.pathname === '/spaces'
              ? style['item-active']
              : style['item-link']
          }
          onClick={async () => history.push('/spaces')}
        >
          <SpaceSvg />
          <IonLabel>
            <h3>Spaces</h3>
          </IonLabel>
        </IonItem>
        <IonItem
          className={
            history.location.pathname === '/explore'
              ? style['item-active']
              : style['item-link']
          }
          onClick={async () => history.push('/explore')}
        >
          <SearchSvg />
          <IonLabel>
            <h3>Explore</h3>
          </IonLabel>
        </IonItem>
        <hr className={style['divider']} />
        <IonItem
          className={
            history.location.pathname === '/settings'
              ? style['item-active']
              : style['item-link']
          }
          onClick={async () => history.push('/settings')}
        >
          <SettingsSvg />
          <IonLabel>
            <h3>Settings</h3>
          </IonLabel>
        </IonItem>
        <IonItem
          className={
            history.location.pathname === '/activities'
              ? style['item-active']
              : style['item-link']
          }
          onClick={async () => history.push('/activities')}
        >
          <ActivitySvg />
          <IonLabel>
            <h3>
              Activities{' '}
              {requestsCount > 0 ? <IonBadge>{requestsCount}</IonBadge> : ''}
            </h3>
          </IonLabel>
        </IonItem>
        {/* <IonItem
            className={
              history.location.pathname === '/notifications'
                ? style['item-active']
                : style['item-link']
            }
            onClick={() => history.push('/notifications')} // should be fixed later
          >
            <IonIcon
              slot="start"
              src="../../assets/icon_notifications.svg"
              className={style['img']}
            ></IonIcon>
            <IonLabel>
              <h3>Notifications</h3>
            </IonLabel>
          </IonItem> */}
        {/* <IonItem
            className={
              history.location.pathname === '/support-forum'
                ? style['item-active']
                : style['item-link']
            }
            onClick={async () => history.push('/support-forum')}
          >
            <IonIcon
              slot="start"
              src="../../assets/icon_support_forum.svg"
              className={style['img']}
            ></IonIcon>
            <IonLabel>
              <h3>Support Forum</h3>
            </IonLabel>
          </IonItem> */}
        <IonItem
          className={style['item-link']}
          onClick={() => {
            UserService.logout();
          }}
        >
          <SignOutSvg />
          <IonLabel>
            <h3>Sign Out</h3>
          </IonLabel>
        </IonItem>
      </IonList>

      <FooterLinks
        session={props.session}
        toggleHelpSupport={toggleHelpSupport}
      />

      <HelpModal
        isOpen={showSupportModal}
        cssClass="my-custom-class"
        backdropDismiss={false}
      >
        <HelpModalContent
          session={props.session}
          toggleHelpSupport={toggleHelpSupport}
          toggleReportProblem={toggleReportProblem}
          toggleContactUs={toggleContactUs}
        />
      </HelpModal>

      <ReportModal
        isOpen={showReportModal}
        cssClass="my-custom-class"
        backdropDismiss={false}
      >
        <ReportModalContent
          session={props.session}
          toggleReportProblem={toggleReportProblem}
        />
      </ReportModal>

      <ContactModal
        isOpen={showContactModal}
        cssClass="my-custom-class"
        backdropDismiss={false}
      >
        <ContactModalContent
          session={props.session}
          toggleContactUs={toggleContactUs}
        />
      </ContactModal>
    </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(LeftSideMenu);
