/**
 * Page
 */
import { IonPage, IonContent, IonGrid, IonRow, IonCol } from '@ionic/react';
import React from 'react';

import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { makeSelectSession } from 'src/store/users/selectors';
import { setSession } from 'src/store/users/actions';
import { InferMappedProps, SubState } from './types';

import style from './style.module.scss';

import LeftSideMenu from 'src/components/layouts/LeftSideMenu';
import SettingsBody from './components/SettingsBody';

const SettingsPage: React.FC<InferMappedProps> = ({
  eProps,
  ...props
}: InferMappedProps) => {
  return (
    <IonPage className={style['settingspage']}>
      <IonContent>
        <IonGrid className={style['settingspagegrid']}>
          <IonRow className={style['settingscontent']}>
            <IonCol size="2" className={style['left-panel']}>
              <LeftSideMenu />
            </IonCol>
            <IonCol size="10" className={style['right-panel']}>
              <SettingsBody useSession={props.session} />
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
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

export default connect(mapStateToProps, mapDispatchToProps)(SettingsPage);
