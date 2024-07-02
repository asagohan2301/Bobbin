'use client'

import Input from '@/components/Input'
import TopImage from '@/components/TopImage'
import type { ErrorsApiResponse } from '@/types/errorTypes'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function GroupResister() {
  const [groupName, setGroupName] = useState<string>('')
  const [firstName, setFirstName] = useState<string>('')
  const [lastName, setLastName] = useState<string>('')
  const [mail, setMail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [passwordConfirmation, setPasswordConfirmation] = useState<string>('')

  const router = useRouter()

  const handlePostGroup = async () => {
    const apiEndpoint = process.env.NEXT_PUBLIC_API_ENDPOINT

    const groupAndUserData = {
      group: {
        group_name: groupName,
      },
      user: {
        first_name: firstName,
        last_name: lastName,
        mail,
        is_admin: true,
        is_active: true,
        password,
        password_confirmation: passwordConfirmation,
      },
    }
    const res = await fetch(`${apiEndpoint}/api/groups`, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify(groupAndUserData),
    })
    if (res.ok) {
      const data = await res.json()
      router.push('/login')
    } else {
      const data: ErrorsApiResponse = await res.json()
      throw new Error(data.errors.join(','))
    }
  }

  return (
    <div className="flex min-h-screen">
      <TopImage />
      <div className="flex flex-1 items-center justify-center">
        <div className="w-[43%] py-6">
          <p className="mb-3 border-b border-gray-300 text-[15px]">組織情報</p>
          <form className="mb-8">
            <Input
              type="text"
              title="組織名"
              onChange={(e) => {
                setGroupName(e.target.value)
              }}
              placeholder="ABC design"
            />
            <p className="mb-3 mt-8 border-b border-gray-300 text-[15px]">
              管理ユーザー情報
            </p>
            <Input
              type="text"
              title="姓"
              onChange={(e) => {
                setLastName(e.target.value)
              }}
              placeholder="大野"
            />
            <Input
              type="text"
              title="名"
              onChange={(e) => {
                setFirstName(e.target.value)
              }}
              placeholder="美穂"
            />
            <Input
              type="mail"
              title="メールアドレス"
              onChange={(e) => {
                setMail(e.target.value)
              }}
              placeholder="bobbin@example.com"
            />
            <Input
              type="password"
              onChange={(e) => {
                setPassword(e.target.value)
              }}
            >
              パスワード
              <span className="block text-xs text-gray-400">
                ※半角英数字のみ、6文字以上20文字以内
              </span>
            </Input>
            <Input
              type="password"
              onChange={(e) => {
                setPasswordConfirmation(e.target.value)
              }}
            >
              パスワード(確認)
              <span className="block text-xs text-gray-400">
                ※半角英数字のみ、6文字以上20文字以内
              </span>
            </Input>
          </form>
          <button
            className="mb-5 block w-full rounded bg-[#FF997E] px-12 py-3 text-sm text-white hover:opacity-80"
            onClick={handlePostGroup}
          >
            登録
          </button>
          <Link href="/login" className="mb-3 block text-[13px]">
            <p className="text-gray-400">すでにアカウントをお持ちですか？</p>
            <p className="text-[14px] text-[#F9816C] hover:opacity-70">
              ログイン
            </p>
          </Link>
        </div>
      </div>
    </div>
  )
}
