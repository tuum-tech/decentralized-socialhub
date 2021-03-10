/**
 * Page
 */

import React, { useEffect, useState } from 'react'
import { Redirect, RouteComponentProps } from 'react-router'

import { AccountType } from 'src/services/user.service'
import PageLoading from 'src/components/layouts/PageLoading'

import { TokenResponse } from './types'
import { requestLinkedinProfile, requestLinkedinToken } from './fetchapi'

const LinkedinCallback: React.FC<RouteComponentProps> = (props) => {
  /**
   * Direct method implementation without SAGA
   * This was to show you dont need to put everything to global state
   * incoming from Server API calls. Maintain a local state.
   */
  const [credentials, setCredentials] = useState({
    name: '',
    email: '',
    request_token: '',
    credential: '',
  })
  const getToken = async (
    code: string,
    state: string
  ): Promise<TokenResponse> => {
    return (await requestLinkedinToken(code, state)) as TokenResponse
  }

  let code: string =
    new URLSearchParams(props.location.search).get('code') || ''
  let state: string =
    new URLSearchParams(props.location.search).get('state') || ''

  useEffect(() => {
    ;(async () => {
      if (code !== '' && state !== '' && credentials.request_token === '') {
        let t = await getToken(code, state)
        let linkedinprofile: any = await requestLinkedinProfile(
          t.data.request_token
        )
        if (!linkedinprofile || !linkedinprofile.data) return

        const firstName = linkedinprofile.data.profile.localizedFirstName.toLowerCase()
        const lastName = linkedinprofile.data.profile.localizedLastName.toLowerCase()
        const uniqueEmail = firstName + lastName + '@linkedin.com'
        setCredentials({
          name: firstName + ' ' + lastName,
          request_token: t.data.request_token,
          email: uniqueEmail,
          credential: linkedinprofile.data.profile.id,
        })
      }
    })()
  })

  const getRedirect = () => {
    if (credentials.request_token !== '') {
      return (
        <Redirect
          to={{
            pathname: '/generate-did',
            state: {
              name: credentials.name,
              request_token: credentials.request_token,
              email: credentials.email,
              service: AccountType.Linkedin,
              credential: credentials.credential,
            },
          }}
        />
      )
    }
    return <PageLoading />
  }
  return getRedirect()
}

export default LinkedinCallback
