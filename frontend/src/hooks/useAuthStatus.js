import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'

// FIX: this hook is not necessary as it's just a duplicate of Redux state
// and is only used in PrivateRoute so not used anywhere else in the app.
export const useAuthStatus = () => {
  const [loggedIn, setLoggedIn] = useState(false)
  const [checkingStatus, setCheckingStatus] = useState(true)

  const { user } = useSelector((state) => state.auth)

  useEffect(() => {
    if (user) {
      setLoggedIn(true)
    } else {
      setLoggedIn(false)
    }
    setCheckingStatus(false)
  }, [user])

  return { loggedIn, checkingStatus }
}
