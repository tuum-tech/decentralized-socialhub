/**
 * Page
 */
import { IonContent, IonPage, IonGrid, IonRow, IonCol } from "@ionic/react";
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
import {
  EducationItem,
  ExperienceItem,
  InferMappedProps,
  ProfileDTO,
  SubState,
} from "./types";
import { requestFullProfile } from "./fetchapi";
import FollowingList from "src/components/FollowingList";
import { RouteComponentProps } from "react-router";
import Logo from "src/components/Logo";
import Navbar from "src/components/Navbar";
import ProfileHeader from "src/components/ProfileHeader";
import DashboardNav from "src/components/DashboardNav";
import PublicNavbar from "src/components/PublicNavbar";
import RegisterNewUserButton from "src/components/RegisterNewUserButton";
import SignInButton from "src/components/SignInButton";
import ProfileComponent from "src/components/ProfileComponent";
import {
  AccountType,
  ISessionItem,
  UserService,
} from "src/services/user.service";

interface MatchParams {
  did: string;
}

interface Props extends RouteComponentProps<MatchParams> {}

const PublicPage: React.FC<RouteComponentProps<MatchParams>> = (
  props: RouteComponentProps<MatchParams>
) => {
  /**
   * Direct method implementation without SAGA
   * This was to show you dont need to put everything to global state
   * incoming from Server API calls. Maintain a local state.
   */
  const [error, setError] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [userInfo, setUserInfo] = useState({
    accountType: AccountType.DID,
    did: "",
    name: "",
    hiveHost: "",
    email: "",
    userToken: "",
    isDIDPublished: false,
    onBoardingCompleted: false,
  });

  const [full_profile, setfull_profile] = useState({
    basicDTO: {
      isEnabled: false,
      name: "",
      did: "",
      title: "",
      email: "",
      hiveHost: "",
      about: "",
      address: {
        number: "",
        street_name: "",
        postal_code: "",
        state: "",
        country: "",
      },
    },
    educationDTO: {
      isEnabled: false,
      items: [] as EducationItem[],
    },
    experienceDTO: {
      isEnabled: false,
      items: [] as ExperienceItem[],
    },
  });

  const getFullProfile = async (did: string): Promise<any> => {
    return await requestFullProfile(did);
  };

  let did: string = props.match.params.did;

  useEffect(() => {
    (async () => {
      try {
      
        let userInfo = await UserService.SearchUserWithDID(did);
        setUserInfo(userInfo as any);
      } catch (e) {
        setError(true);
      }

      try {
        if (!error) {
          let profile: ProfileDTO = await getFullProfile(did);
          profile.basicDTO.isEnabled = true;
          profile.experienceDTO.isEnabled = true;
          profile.educationDTO.isEnabled = true;
          setfull_profile(profile);
        }
      } catch (e) {}
      setLoaded(true);
    })();
  }, []);

  const scrollToPosition = (position: number) => {
    let ionContent = document.querySelector("ion-content");
    ionContent!.scrollToPoint(0, position);
  };

  return (
    <IonPage className={style["profilepage"]}>
      <IonContent className={style["content-scroll"]}>
        <IonGrid className={style["profilepagegrid"]}>
          <PublicNavbar className="ion-justify-content-between">
            <IonCol size="auto">
              <img src="../../assets/logo_profile_black.svg" />
            </IonCol>
            <IonCol size="auto">
              <IonRow>
                <IonCol>
                  <SignInButton href="create-profile">
                    Register new user
                  </SignInButton>
                </IonCol>
                <IonCol>
                  <SignInButton href="../sign-did">Sign In</SignInButton>
                </IonCol>
              </IonRow>
            </IonCol>
          </PublicNavbar>

          <IonRow className="ion-justify-content-around">
            <IonCol size="12">
              {loaded && userInfo && userInfo.did !== "" ? (
                <ProfileComponent
                  scrollToPosition={scrollToPosition}
                  profile={full_profile}
                  sessionItem={userInfo as any}
                  error={error}
                />
              ) : (
                "404 user not found"
              )}
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
const withInjectedMode = injector(PublicPage, {
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
