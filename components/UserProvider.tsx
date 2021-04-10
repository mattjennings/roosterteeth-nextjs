import { User } from 'next-auth'
import { useSession } from 'next-auth/client'
import React, { useContext, useMemo } from 'react'

interface UserContextValue {
  loading?: boolean
  user?: User
}

const UserContext = React.createContext<UserContextValue>({} as any)

export default function UserProvider({ children }) {
  const [session, loading] = useSession()

  const value = useMemo<UserContextValue>(
    () => ({
      user: session?.user,
      loading,
    }),
    [session?.user, loading]
  )

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}

export const useUser = () => useContext(UserContext)
