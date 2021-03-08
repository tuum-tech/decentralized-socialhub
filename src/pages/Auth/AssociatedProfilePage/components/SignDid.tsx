import { IonRow } from '@ionic/react'
import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import {
  OnBoardLayout,
  OnBoardLayoutRight,
  OnBoardLayoutRightContent,
  OnBoardLayoutRightContentTitle,
} from 'src/components/layouts/OnBoardLayout'

import { Text16, Text12 } from 'src/components/texts'
import DidSignForm from 'src/components/DidSign/DidSignForm'
import DidLeftSide from 'src/components/DidSign/DidLeftSide'
import { UserService } from 'src/services/user.service'

import style from '../style.module.scss'

interface Props {
  did: string
}

const SignDid: React.FC<Props> = ({ did }) => {
  const [error, setError] = useState(false)
  const history = useHistory()

  return (
    <OnBoardLayout className={style['did-signin']}>
      <DidLeftSide error={error} />
      <OnBoardLayoutRight>
        <OnBoardLayoutRightContent>
          <OnBoardLayoutRightContentTitle>
            Sign into with Decentrialized ID (DID)
          </OnBoardLayoutRightContentTitle>
          <Text16>
            Enter your 12 security passwords in the correct order.
          </Text16>
          <IonRow style={{ marginTop: '12px' }}>
            <Text12>What are these?</Text12>
            <Text12>&nbsp;Help</Text12>
          </IonRow>
          <DidSignForm
            error={error}
            setError={setError}
            onSuccess={async (uDid: string) => {
              if (`did:elastos:${did}` === uDid) {
                const res = await UserService.SearchUserWithDID(
                  `did:elastos:${did}`
                )
                if (!res) {
                  setError(true)
                } else {
                  history.push({
                    pathname: '/set-password',
                    state: {
                      hiveHost: res.hiveHost,
                      userToken: res.userToken,
                      did: res.did,
                      firstName: res.firstName,
                      lastName: res.lastName,
                      accountType: res.accountType,
                      isDIDPublished: res.isDIDPublished,
                      onBoardingCompleted: true,
                    },
                  })
                }
              } else {
                setError(true)
              }
            }}
          />
        </OnBoardLayoutRightContent>
      </OnBoardLayoutRight>
    </OnBoardLayout>
  )
}

export default SignDid
