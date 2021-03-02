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
  if (proctedby === 'password') {
    const session = window.sessionStorage.getItem('session_instance')
    let isLoggedIn = true
    if (!session) {
      isLoggedIn = false
    } else {
      const sessionObj = JSON.parse(session)
      if (!sessionObj.userToken || sessionObj.userToken === '') {
        isLoggedIn = false
      }
    }

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
  const session = window.sessionStorage.getItem('invitecode')
  let hasCode = true
  if (!session) {
    hasCode = false
  }

  return (
    <Route
      {...routeProps}
      render={(props) => {
        if (hasCode) {
          return <Component {...props} />
        } else {
          return <Redirect to='/Alpha' />
        }
      }}
    />
  )
}
export default ProtectedRoute
