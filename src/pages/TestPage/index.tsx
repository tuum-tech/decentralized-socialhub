import { IonPage, IonButton } from '@ionic/react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import React from 'react';
import style from './style.module.scss';

import { makeSelectSession, makeSelectUsers } from 'src/store/users/selectors';
import { setSession } from 'src/store/users/actions';
import { InferMappedProps, SubState } from './types';

const SimplePage: React.FC<InferMappedProps> = ({
  eProps,
  ...props
}: InferMappedProps) => {
  console.log('====>eProps', eProps);
  return (
    <IonPage className={style['simple-page-module']}>
      <p>{props.session.name}</p>
      <IonButton
        expand="full"
        onClick={() => {
          eProps.setSession({
            session: {
              hiveHost: 'test123',
              userToken: 'test',
              accountType: 'test',
              did: 'test',
              name: '123',
              isDIDPublished: false,
              didPublishTime: 0,
              loginCred: {},
              mnemonics: '',
              passhash: '',
              onBoardingCompleted: false,
              tutorialStep: 1
            }
          });
        }}
        color="primary"
      >
        Increment Counter
      </IonButton>
    </IonPage>
  );
};

export const mapStateToProps = createStructuredSelector<SubState, SubState>({
  session: makeSelectSession(),
  users: makeSelectUsers()
});

export function mapDispatchToProps(dispatch: any) {
  return {
    eProps: {
      setSession: (props: { session: ISessionItem }) =>
        dispatch(setSession(props))
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SimplePage);
