import { Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Spinner from './Spinner'

// NOTE: no need for useAuthStatus as it's a duplicate of Redux state
// Also no need for an Outlet as we don't use nested routing

const PrivateRoute = ({ children }) => {
  const { user, loading } = useSelector((state) => state.auth)

  if (loading) return <Spinner />

  if (user) return children

  return <Navigate to='/login' />
}

export default PrivateRoute
