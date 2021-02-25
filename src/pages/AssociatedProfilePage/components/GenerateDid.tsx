import { Redirect } from 'react-router'
import React, { useState } from 'react'

import { UserService, AccountType } from 'src/services/user.service'
import SetPassword from 'src/components/SetPassword'

interface Props {
  id: string
  fname: string
  lname: string
  email: string
  request_token: string
  credential: string
  service:
    | AccountType.DID
    | AccountType.Linkedin
    | AccountType.Facebook
    | AccountType.Google
    | AccountType.Twitter
}

const GenerateDid: React.FC<Props> = (props) => {
  /**
   * Direct method implementation without SAGA
   * This was to show you dont need to put everything to global state
   * incoming from Server API calls. Maintain a local state.
   */
  const [isLogged, setIsLogged] = useState(false)
  const [loading, setLoading] = useState(false)

  const { fname, lname, email, id, request_token, service, credential } = props

  return (
    <SetPassword
      next={async (pwd) => {
        setLoading(true)
        await UserService.SignIn3rdParty(
          id,
          fname,
          lname,
          request_token,
          service,
          email,
          credential,
          pwd
        )
        setLoading(false)

        window.location.href = '/profile'
      }}
      displayText={loading ? 'Encrypting now.......' : ''}
    />
  )
}

export default GenerateDid
