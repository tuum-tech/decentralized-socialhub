/**
 * Page
 */
import { IonPage, IonContent, IonGrid, IonRow, IonCol } from "@ionic/react";
import { connect } from "react-redux";
import { compose } from "redux";
import { createStructuredSelector } from "reselect";
import injector from "src/baseplate/injectorWrap";
import { makeSelectCounter, makeSelectAjaxMsg } from "./selectors";
import { incrementAction, getSimpleAjax } from "./actions";
import React, { memo, useEffect, useState } from "react";
import style from "./style.module.scss";
import { NameSpace } from "./constants";
import reducer from "./reducer";
import saga from "./saga";
import { InferMappedProps, SubState } from "./types";
import { RouteComponentProps } from "react-router";
import { fetchSimpleApi } from "./fetchapi";
import Logo from "src/components/Logo";
import Navbar from "src/components/Navbar";
import SettingsHeader from "src/components/SettingsHeader";
import DashboardNav from "src/components/DashboardNav";

const SettingsPage: React.FC<RouteComponentProps> = (
  props: RouteComponentProps
) => {
  /**
   * Direct method implementation without SAGA
   * This was to show you dont need to put everything to global state
   * incoming from Server API calls. Maintain a local state.
   */
  const [msg, setMsg] = useState("");
  const simpleAjaxDirect = async () => {
    const msg = (await fetchSimpleApi()) as string;
    setMsg(msg);
  };

  return (
    <IonPage>
      <IonContent className={style["settingspage"]}>
        <IonGrid className={style["settingspagegrid"]}>
          <IonRow className={style["settingscontent"]}>
            <IonCol size="2" className={style["left-panel"]}>
              <Logo />
              <Navbar />
            </IonCol>
            {/* <IonCol size='7' className={style['center-panel']}>
              <ProfileComponent profile={profile} />
            </IonCol> */}
            <IonCol size="10" className={style["right-panel"]}>
              <SettingsHeader />
              <DashboardNav />
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

/** @returns {object} Contains state props from selectors */
export const mapStateToProps = createStructuredSelector<SubState, SubState>({
  counter: makeSelectCounter(),
  msg: makeSelectAjaxMsg(),
});

/** @returns {object} Contains dispatchable props */
export function mapDispatchToProps(dispatch: any) {
  return {
    eProps: {
      // eProps - Emitter proptypes thats binds to dispatch
      /** dispatch for counter to increment */
      onCount: (count: { counter: number }) => dispatch(incrementAction(count)),
      onSimpleAjax: () => dispatch(getSimpleAjax()),
    },
  };
}

/**
 * Injects prop and saga bindings done via
 * useInjectReducer & useInjectSaga
 */
const withInjectedMode = injector(SettingsPage, {
  key: NameSpace,
  reducer,
  saga,
});

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(
  withConnect,
  memo
)(withInjectedMode) as React.ComponentType<InferMappedProps>;

// export default Tab1;
