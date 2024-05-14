'use client'

import type { Dispatch, ReactNode, SetStateAction } from 'react'
import { createContext, useState } from 'react'

type LoginUserContextType = {
  loginUserGroupId: number | null
  setLoginUserGroupId: Dispatch<SetStateAction<number | null>>
  loginUserId: number | null
  setLoginUserId: Dispatch<SetStateAction<number | null>>
}

export const LoginUserContext = createContext<LoginUserContextType | null>(null)

type LoginUserContextProviderProps = {
  children: ReactNode
}

export function LoginUserContextProvider({
  children,
}: LoginUserContextProviderProps) {
  const [loginUserGroupId, setLoginUserGroupId] = useState<number | null>(1)
  const [loginUserId, setLoginUserId] = useState<number | null>(1)

  return (
    <LoginUserContext.Provider
      value={{
        loginUserGroupId,
        setLoginUserGroupId,
        loginUserId,
        setLoginUserId,
      }}
    >
      {children}
    </LoginUserContext.Provider>
  )
}
