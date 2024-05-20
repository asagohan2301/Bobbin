'use client'

import Input from '@/components/Input'
import TopImage from '@/components/TopImage'
import type { ErrorsApiResponse } from '@/types/errorTypes'
import { setCookie } from '@/utils/cookieUtils'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function Login() {
  const [mail, setMail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [triggerLogin, setTriggerLogin] = useState<boolean>(false)

  useEffect(() => {
    if (triggerLogin) {
      handleLogin()
      setTriggerLogin(false)
    }
  }, [triggerLogin])

  const router = useRouter()

  const testUserMail = 'miho@mail'
  const testUserPassword = 'miho0001'

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
      router.push('/')
    } else {
      const data: ErrorsApiResponse = await res.json()
      throw new Error(data.errors.join(','))
    }
  }

  return (
    <div className="flex min-h-screen">
      <TopImage />
      <div className="flex flex-1 items-center justify-center">
        <div className="w-[43%]">
          <form className="mb-8">
            <Input
              type="mail"
              title="メールアドレス"
              onChange={(e) => {
                setMail(e.target.value)
              }}
            />
            <Input
              type="password"
              title="パスワード"
              onChange={(e) => {
                setPassword(e.target.value)
              }}
            />
          </form>
          <button
            className="mb-5 block w-full rounded bg-[#FF997E] px-12 py-3 text-sm text-white"
            onClick={() => {
              setTriggerLogin(true)
            }}
          >
            ログイン
          </button>
          <Link href="/group/register" className="mb-3 block text-[13px]">
            <p className="text-gray-400">アカウントをお持ちでない方はこちら</p>
            <p className="text-[14px] text-[#F9816C]">新規登録</p>
          </Link>
          <div
            className="cursor-pointer text-[13px]"
            onClick={() => {
              setMail(testUserMail)
              setPassword(testUserPassword)
              setTriggerLogin(true)
            }}
          >
            <p className="text-gray-400">お試しはこちら</p>
            <p className="text-[#F9816C]">ゲストアカウントでログイン</p>
          </div>
        </div>
      </div>
    </div>
  )
}
