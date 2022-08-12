import { Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

// NOTE: no need for useAuthStatus as it's a duplicate of Redux state and only
// used here in the PrivateRoute
// No need for an outlet as we are not using nested routing

// NOTE: We can remove use of the Spinner here as it will never show. We either
// have a user in local storage that we trust is genuine or we dont'.
// No request is made to the back end to authenticate the user so we don't
// needthe Spinner

const PrivateRoute = ({ children }) => {
  const { user } = useSelector((state) => state.auth)

  if (user) return children

  return <Navigate to='/login' />
}

export default PrivateRoute
