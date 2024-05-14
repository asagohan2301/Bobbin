'use client'

import ButtonWithIcon from '@/components/ButtonWithIcon'
import Input from '@/components/Input'
import { LoginUserContext } from '@/contexts/LoginUserContext'
import type { ErrorsApiResponse } from '@/types/errorTypes'
import { useRouter } from 'next/navigation'
import { useContext, useState } from 'react'
import { Check, X } from 'react-bootstrap-icons'
import { setCookie } from '../../utils/cookieUtils'

export default function Login() {
  const [mail, setMail] = useState<string>('')
  const [password, setPassword] = useState<string>('')

  const router = useRouter()

  const context = useContext(LoginUserContext)
  if (!context) {
    console.error('コンテキストの取得に失敗しました')
    return
  }
  const { setLoginUserGroupId, setLoginUserId } = context

  const handleLogin = async () => {
    const apiEndpoint = process.env.NEXT_PUBLIC_API_ENDPOINT

    const userData = {
      mail,
      password,
    }
    const res = await fetch(`${apiEndpoint}/api/login`, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify(userData),
    })
    if (res.ok) {
      const { user } = await res.json()
      await setCookie('groupName', user.group_name)
      await setCookie('firstName', user.first_name)
      await setCookie('lastName', user.last_name)
      await setCookie('token', user.token)
      setLoginUserGroupId(user.group_id)
      setLoginUserId(user.user_id)
      router.push('/')
    } else {
      const data: ErrorsApiResponse = await res.json()
      throw new Error(data.errors.join(','))
    }
  }

  return (
    <div>
      <div className="relative mx-auto max-w-[1440px] px-14 py-5">
        <h2>ログイン</h2>
        <form>
          <Input
            type="mail"
            title="メールアドレス"
            elementName="mail"
            onChange={(e) => {
              setMail(e.target.value)
            }}
          />
          <Input
            type="password"
            title="パスワード"
            elementName="password"
            onChange={(e) => {
              setPassword(e.target.value)
            }}
          />
        </form>
        <div className="flex justify-end gap-4">
          <ButtonWithIcon
            IconComponent={X}
            label="キャンセル"
            href="/"
            isCancel={true}
          />
          <ButtonWithIcon
            IconComponent={Check}
            label="ログイン"
            onClick={handleLogin}
            isConfirm={true}
          />
        </div>
      </div>
      <footer className="h-8 w-full"></footer>
    </div>
  )
}
