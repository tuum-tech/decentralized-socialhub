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
  let hasCode = true
  let isLoggedIn = true

  const session_instance = window.sessionStorage.getItem('session_instance')
  const local_invitecode = window.localStorage.getItem('invitecode')

  if (!local_invitecode) {
    hasCode = false
    isLoggedIn = false
  } else if (!session_instance) {
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
