/**
 * Page
 */
import { IonHeader, IonPage, IonInput, IonCol, IonRow } from '@ionic/react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { createStructuredSelector } from 'reselect'
import injector from 'src/baseplate/injectorWrap'
import { makeSelectCounter, makeSelectAjaxMsg } from './selectors'
import { incrementAction, getSimpleAjax } from './actions'
import React, { memo, useContext, useState } from 'react'
import style from './style.module.scss'
import { NameSpace } from './constants'
import reducer from './reducer'
import saga from './saga'
import { InferMappedProps, SubState } from './types'
import ClearlyMeContent from 'src/components/ClearlyMeContent'
import Header from 'src/components/Header'
import ButtonDefault from 'src/components/ButtonDefault'
import ButtonLight from 'src/components/ButtonLight'
import { toNumber } from 'lodash'
import { ElastosClient } from '@elastosfoundation/elastos-js-sdk'
import SessionContext from 'src/context/session.context'
import { useHistory } from 'react-router-dom'
import { HiveService } from 'src/services/hive.service'
import { DidService } from 'src/services/did.service'
import { UserService, AccountType } from 'src/services/user.service'
// import { ProfileService } from 'src/services/profile.service';
import { UserVaultScripts } from 'src/scripts/uservault.script'

const ElastosMnemonicPage: React.FC<InferMappedProps> = ({
  eProps,
  ...props
}: InferMappedProps) => {
  const history = useHistory()

  const { session, setSession } = useContext(SessionContext)
  /**
   * Direct method implementation without SAGA
   * This was to show you dont need to put everything to global state
   * incoming from Server API calls. Maintain a local state.
   */
  const [msg, setMsg] = useState('')
  const [did, setDID] = useState(
    UserService.getSignedUsers().length > 0
      ? UserService.getSignedUsers()[0]
      : ''
  )
  const [ownAddress, setOwnAddress] = useState('')

  const [loggedUsers, setLoggedUsers] = useState(UserService.getSignedUsers())

  const [hiveAddress, setHiveAddress] = useState('')
  const [userToken, setUserToken] = useState('')

  const [storagePassword, setStoragePassword] = useState('')
  const [repeatStoragePassword, setRepeatStoragePassword] = useState('')

  const [indexPage, setIndexPage] = useState(
    UserService.getSignedUsers().length === 0 ? 0 : 4
  )

  const [mnemonic, setMnemonic] = useState([
    'garage',
    'stadium',
    'stand',
    'toy',
    'swap',
    'fish',
    'include',
    'animal',
    'leave',
    'van',
    'moment',
    '',
  ])

  const updateMnemonic = (event: any) => {
    let index: number = toNumber(event.target.outerText) - 1
    mnemonic[index] = event.target.value
    setMnemonic(mnemonic)
  }

  const mnemonicInput = (index: number) => {
    return (
      <IonCol>
        <IonInput
          value={mnemonic[index]}
          onIonChange={updateMnemonic}
          className={style['mnemonic']}
        >
          <span className={style['number']}>{index + 1}</span>
        </IonInput>
      </IonCol>
    )
  }

  const signIn = async () => {
    console.log(session)
    if (
      isMnemonicWordValid(0) &&
      isMnemonicWordValid(1) &&
      isMnemonicWordValid(2) &&
      isMnemonicWordValid(3) &&
      isMnemonicWordValid(4) &&
      isMnemonicWordValid(5) &&
      isMnemonicWordValid(6) &&
      isMnemonicWordValid(7) &&
      isMnemonicWordValid(8) &&
      isMnemonicWordValid(9) &&
      isMnemonicWordValid(10) &&
      isMnemonicWordValid(11)
    ) {
      let userDid = await ElastosClient.did.loadFromMnemonic(mnemonic.join(' '))
      setDID(userDid.did)
      setIndexPage(1)
      //setSession({ userDid: userDid })
    } else {
      console.log('invalid')
      setMsg('Invalid mnemonics')
    }
  }

  const otherVault = async (hostUrl: string) => {
    try {
      await connectHive(hostUrl)
      setIndexPage(3)
    } catch (error) {
      console.error(error)
    }
  }

  const ownVault = () => {
    console.log(session)
    setIndexPage(2)
    //history.push("/profile", session)
  }

  const validateOwnVault = async () => {
    try {
      await connectHive(ownAddress)
      setIndexPage(3)
    } catch (error) {
      console.error(error)
    }
  }

  const connectHive = async (address: string) => {
    let isDIDPublished = await DidService.isDIDPublished(did)

    if (!isDIDPublished) {
      console.log('DID is not published')
      return
    }

    let challenge = await HiveService.getHiveChallenge(address)
    let presentation = await DidService.generateVerifiablePresentationFromUserMnemonics(
      mnemonic.join(' '),
      '',
      challenge.issuer,
      challenge.nonce
    )
    let token = await HiveService.getUserHiveToken(address, presentation)

    setHiveAddress(address)
    setUserToken(token)
  }

  const encryptProfile = async () => {
    if (storagePassword !== repeatStoragePassword) {
      console.log('Password is different')
    } else {
      await loginProfile(storagePassword)
    }
  }

  const skipEncryption = async () => {
    await loginProfile('')
  }

  const loginProfile = async (pwd: string) => {
    try {
      await UserService.LockWithDIDAndPWd(
        {
          hiveHost: hiveAddress,
          userToken: userToken,
          did: did,
          firstName: '',
          lastName: '',
          accountType: AccountType.DID,
          isDIDPublished: false,
          mnemonics: '',
          onBoardingCompleted: false,
          tutorialCompleted: false,
        },
        pwd
      )

      // debugger;
      // Handle all the script registering somewhere
      console.log('script execute')
      let instance = await HiveService.getSessionInstance()
      if (instance) UserVaultScripts.Execute(instance)
      history.replace('/profile')
    } catch (error) {
      console.error(error)
    }
  }

  const signInLocalUser = async () => {
    if (did === '') return
    try {
      await UserService.UnLockWithDIDAndPWd(did, storagePassword)

      history.replace('/profile')
    } catch (error) {
      console.error(error)
    }
  }

  const useAnotherDID = async () => {
    setIndexPage(0)
  }

  const isMnemonicWordValid = (index: number): boolean => {
    let word: string = mnemonic[0]
    if (!word) return false
    return word.trim() !== ''
  }

  const divSelection = () => {
    if (indexPage === 0) {
      return (
        <div>
          <h1>Sign in with elastOS</h1>
          <br />
          <p>Enter your 12 security words to sign in</p>

          <div>
            <IonRow style={{ marginTop: '10px' }}>
              {mnemonicInput(0)}
              {mnemonicInput(1)}
              {mnemonicInput(2)}
            </IonRow>
            <IonRow style={{ marginTop: '10px' }}>
              {mnemonicInput(3)}
              {mnemonicInput(4)}
              {mnemonicInput(5)}
            </IonRow>
            <IonRow style={{ marginTop: '10px' }}>
              {mnemonicInput(6)}
              {mnemonicInput(7)}
              {mnemonicInput(8)}
            </IonRow>
            <IonRow style={{ marginTop: '10px' }}>
              {mnemonicInput(9)}
              {mnemonicInput(10)}
              {mnemonicInput(11)}
            </IonRow>
          </div>

          <br />
          <br />
          <div style={{ textAlign: 'center' }}>
            <ButtonDefault onClick={signIn}>Sign in</ButtonDefault>
          </div>

          <p>{msg}</p>
        </div>
      )
    }

    if (indexPage === 1) {
      return (
        <div>
          <h1>Choose Your Vault</h1>

          <div className={style['warning-light']}>
            <p className={style['text']}>
              Vault options
              <br />
              <br />
            </p>
          </div>

          <div className={style['vault-list']}>
            <IonRow style={{ marginTop: '10px' }}>
              <IonCol>
                <ButtonLight
                  onClick={() =>
                    otherVault(`${process.env.REACT_APP_TUUM_TECH_HIVE}`)
                  }
                >
                  Tuum Tech
                </ButtonLight>
              </IonCol>
            </IonRow>
            <IonRow style={{ marginTop: '10px' }}>
              <IonCol>
                <ButtonLight
                  onClick={() =>
                    otherVault(`${process.env.REACT_APP_TUUM_TECH_HIVE}`)
                  }
                >
                  Trinity Tech
                </ButtonLight>
              </IonCol>
            </IonRow>
            <IonRow style={{ marginTop: '10px' }}>
              <IonCol>
                <ButtonLight onClick={ownVault}>My own vault</ButtonLight>
              </IonCol>
            </IonRow>
          </div>
          <br />
          <br />
          <p>{did}</p>
        </div>
      )
    }

    if (indexPage === 2) {
      return (
        <div>
          <h1>Enter Your Vault</h1>

          <div>
            <IonRow style={{ marginTop: '150px' }}>
              <IonCol>
                <IonInput
                  className={style['addressInput']}
                  value={ownAddress}
                  onIonChange={(event) =>
                    setOwnAddress((event.target as HTMLInputElement).value)
                  }
                  placeholder='Vault ip address'
                ></IonInput>
              </IonCol>
            </IonRow>
          </div>

          <div style={{ textAlign: 'center', marginTop: '150px' }}>
            <ButtonDefault onClick={validateOwnVault}>Next &gt;</ButtonDefault>
          </div>
        </div>
      )
    }

    if (indexPage === 3) {
      return (
        <div>
          <h1>Storage Password</h1>

          <div className={style['warning-light']}>
            <p className={style['text']}>
              Create a password to storage your profile
            </p>
          </div>
          <div>
            <IonRow style={{ marginTop: '100px' }}>
              <IonCol>
                <IonInput
                  type='password'
                  className={style['addressInput']}
                  value={storagePassword}
                  onIonChange={(event) =>
                    setStoragePassword((event.target as HTMLInputElement).value)
                  }
                  placeholder='New password'
                ></IonInput>
                <br />
                <IonInput
                  type='password'
                  className={style['addressInput']}
                  value={repeatStoragePassword}
                  onIonChange={(event) =>
                    setRepeatStoragePassword(
                      (event.target as HTMLInputElement).value
                    )
                  }
                  placeholder='Retype your password'
                ></IonInput>
              </IonCol>
            </IonRow>
          </div>

          <div style={{ textAlign: 'center', marginTop: '100px' }}>
            <ButtonDefault onClick={encryptProfile}>
              Encrypt and Save
            </ButtonDefault>
            <ButtonLight onClick={skipEncryption}>Skip</ButtonLight>
          </div>
        </div>
      )
    }

    if (indexPage === 4) {
      return (
        <div>
          <h1>Welcome back</h1>

          <div className={style['warning-light']}>
            <p className={style['text']}>Use your storage password to login</p>
          </div>

          <div>
            <IonRow style={{ marginTop: '100px' }}>
              <IonCol>
                <select
                  className={style['loginInput']}
                  value={did}
                  onChange={(event) =>
                    setDID((event.target as HTMLSelectElement).value)
                  }
                >
                  {loggedUsers.map((userDid: string, index: number) => (
                    <option value={userDid}>{userDid}</option>
                  ))}
                </select>

                <br />

                <input
                  type='password'
                  className={style['loginInput']}
                  value={storagePassword}
                  onChange={(event) =>
                    setStoragePassword((event.target as HTMLInputElement).value)
                  }
                  placeholder='Storage password'
                ></input>
              </IonCol>
            </IonRow>
          </div>

          <div style={{ textAlign: 'center', marginTop: '100px' }}>
            <ButtonDefault onClick={signInLocalUser}>Login</ButtonDefault>
            <ButtonLight onClick={useAnotherDID}>Use another DID</ButtonLight>
          </div>
        </div>
      )
    }
  }

  return (
    <IonPage className={style['elastosmnemonicpage']}>
      <ClearlyMeContent>
        <IonHeader style={{ height: '80px' }}>
          <Header />
        </IonHeader>
        <div className={style['main-container']}>{divSelection()}</div>
      </ClearlyMeContent>
    </IonPage>
  )
}

/** @returns {object} Contains state props from selectors */
export const mapStateToProps = createStructuredSelector<SubState, SubState>({
  counter: makeSelectCounter(),
  msg: makeSelectAjaxMsg(),
})

/** @returns {object} Contains dispatchable props */
export function mapDispatchToProps(dispatch: any) {
  return {
    eProps: {
      // eProps - Emitter proptypes thats binds to dispatch
      /** dispatch for counter to increment */
      onCount: (count: { counter: number }) => dispatch(incrementAction(count)),
      onSimpleAjax: () => dispatch(getSimpleAjax()),
    },
  }
}

/**
 * Injects prop and saga bindings done via
 * useInjectReducer & useInjectSaga
 */
const withInjectedMode = injector(ElastosMnemonicPage, {
  key: NameSpace,
  reducer,
  saga,
})

const withConnect = connect(mapStateToProps, mapDispatchToProps)

export default compose(
  withConnect,
  memo
)(withInjectedMode) as React.ComponentType<InferMappedProps>

// export default Tab1;
