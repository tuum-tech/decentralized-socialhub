import React from 'react'
import { Redirect, Route, RouteProps } from 'react-router-dom'

type ProtectedRouteProps = {
  path: RouteProps['path']
  component: React.ElementType
  exact?: boolean
  proctedby?: string
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  component: Component,
  proctedby = 'accesscode',
  ...routeProps
}) => {
  const session_instance = window.sessionStorage.getItem('session_instance')
  let isLoggedIn = true
  if (!session_instance) {
    isLoggedIn = false
  }

  if (proctedby === 'password') {
    return (
      <Route
        {...routeProps}
        render={(props) => {
          if (isLoggedIn) {
            return <Component {...props} />
          } else {
            return <Redirect to='/create-profile' />
          }
        }}
      />
    )
  }

  // protected by invite code
  const local_invitecode = window.localStorage.getItem('invitecode')
  console.log('=======>local_invitecode', local_invitecode)
  let hasCode = true
  if (!local_invitecode) {
    hasCode = false
  }

  return (
    <Route
      {...routeProps}
      render={(props) => {
        if (isLoggedIn) {
          return <Redirect to='/profile' />
        } else if (hasCode) {
          return <Component {...props} />
        } else {
          return <Redirect to='/Alpha' />
        }
      }}
    />
  )
}
export default ProtectedRoute
