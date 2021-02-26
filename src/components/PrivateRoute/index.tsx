import React from 'react'
import { Redirect, Route, RouteProps } from 'react-router-dom'

type PrivateRouteProps = {
  path: RouteProps['path']
  component: React.ElementType
  exact?: boolean
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({
  component: Component,
  ...routeProps
}) => {
  const session = window.sessionStorage.getItem('session_instance')

  let isLoggedIn = true
  if (!session) {
    isLoggedIn = false
  } else {
    const sessionObj = JSON.parse(session)
    if (!sessionObj.did) {
      isLoggedIn = false
    }
  }

  return (
    <Route
      {...routeProps}
      render={(props) => {
        if (isLoggedIn) {
          return <Component />
        } else {
          return <Redirect to='/' />
        }
      }}
    />
  )
}
export default PrivateRoute
