import React from 'react';
import {
  IonCol,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonGrid,
  IonRow,
  IonContent,
  IonItem,
  IonCardContent,
  IonText
} from '@ionic/react';

import ManageAccount, { ButtonDisabled } from './ManageAccount';
import style from './style.module.scss';

interface Props {
  userSession: ISessionItem;
}

const SettingsAccount: React.FC<Props> = ({ userSession }) => {
  return (
    <IonContent className={style['settingsaccount']}>
      <IonGrid className={style['tab-grid']}>
        <IonRow>
          <IonCol>
            <IonCard className={style['tab-card']}>
              <IonCardContent>
                <IonCardHeader>
                  <IonCardTitle className={style['card-title']}>
                    Account Settings
                  </IonCardTitle>
                </IonCardHeader>
                <IonItem className={style['section']}>
                  <div className={style['section-data']}>
                    <IonText className={style['section-title']}>
                      Change language
                    </IonText>
                    <IonText className={style['section-description']}>
                      Choose your app language
                    </IonText>
                  </div>
                  <div className={style['section-action']}>
                    <span className={style['section-action-inner']}>
                      English {'>'}
                    </span>
                  </div>
                </IonItem>
                <IonItem className={style['section']}>
                  <div className={style['section-data']}>
                    <IonText className={style['section-title']}>
                      Download your data
                    </IonText>
                    <IonText className={style['section-description']}>
                      We are committed to reach the goal of privacy, all your
                      data is owned by you and stored on the vault of your
                      choosing. You can request this data at anytime.
                    </IonText>
                    <br></br>
                    <ButtonDisabled className={style['section-button']}>
                      Download Here
                    </ButtonDisabled>
                    <IonText className={style['coming-soon']}>
                      Coming Soon!
                    </IonText>
                  </div>
                </IonItem>

                <ManageAccount userSession={userSession} />
                {/* <IonItem lines="none" className={style['section']}>
                  <div className={style['section-data']}>
                    <IonText className={style['section-title']}>
                      Delete your account
                    </IonText>
                    <IonText className={style['section-description']}>
                      This will wipe out the vault data from your own user
                      vault. Note that the data stored on Tuum Tech vault will
                      not be removed with this action. Information stored on
                      your user vault such as your about section, education and
                      experience will be deleted. You can always create a new
                      account with the same DID at a later time but you will
                      have to enter your personal data again during that time.
                    </IonText>
                    <br></br>
                    <IonAlert
                      isOpen={isAlertOpen}
                      onDidDismiss={() => setIsAlertOpen(false)}
                      cssClass="my-custom-class"
                      header={'Delete'}
                      subHeader={'Subtitle'}
                      message={
                        'Are you sure you want to delete? This operation is irreversible'
                      }
                      buttons={[
                        {
                          text: 'Cancel',
                          role: 'cancel',
                          cssClass: 'secondary',
                          handler: () => {}
                        },
                        {
                          text: 'Delete',
                          handler: async () => {
                            if (!userSession) return;
                            setLoading('Deleting Account');
                            await UserService.deleteUser(userSession);
                            setLoading('');
                          }
                        }
                      ]}
                    />
                    <DeleteButton
                      className={style['section-button']}
                      disabled={loading !== ''}
                      onClick={async () => {
                        setIsAlertOpen(true);
                      }}
                    >
                      {loading === 'Deleting Account'
                        ? 'Deleting Now...'
                        : 'Delete'}
                    </DeleteButton>
                  </div>
                </IonItem> */}
              </IonCardContent>
            </IonCard>
          </IonCol>
        </IonRow>
      </IonGrid>
    </IonContent>
  );
};

export default SettingsAccount;
