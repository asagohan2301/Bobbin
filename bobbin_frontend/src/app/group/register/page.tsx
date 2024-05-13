'use client'

import ButtonWithIcon from '@/components/ButtonWithIcon'
import Input from '@/components/Input'
import type { ErrorsApiResponse } from '@/types/errorTypes'
import { useState } from 'react'
import { Check, X } from 'react-bootstrap-icons'

export default function GroupResister() {
  const [groupName, setGroupName] = useState<string>('')
  const [firstName, setFirstName] = useState<string>('')
  const [lastName, setLastName] = useState<string>('')
  const [mail, setMail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [passwordConfirmation, setPasswordConfirmation] = useState<string>('')

  const handlePostGroup = async () => {
    const apiEndpoint = process.env.NEXT_PUBLIC_API_ENDPOINT

    const groupData = {
      group_name: groupName,
    }
    const groupRes = await fetch(`${apiEndpoint}/api/groups`, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify(groupData),
    })
    if (!groupRes.ok) {
      const groupResData: ErrorsApiResponse = await groupRes.json()
      throw new Error(groupResData.errors.join(','))
    }
    const groupResData = await groupRes.json()
    const groupId = groupResData.id
    console.log(groupId)

    const userData = {
      user: {
        group_id: groupId,
        first_name: firstName,
        last_name: lastName,
        mail,
        is_admin: true,
        is_active: true,
        password,
        password_confirmation: passwordConfirmation,
      },
    }
    const userRes = await fetch(`${apiEndpoint}/api/groups/${groupId}/users`, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify(userData),
    })
    if (!userRes.ok) {
    }
    const userResData = await userRes.json()
    console.log(userResData)
  }

  return (
    <div>
      <div className="relative mx-auto max-w-[1440px] px-14 py-5">
        <h2>組織情報</h2>
        <form>
          <Input
            type="text"
            title="組織名"
            elementName="groupName"
            onChange={(e) => {
              setGroupName(e.target.value)
            }}
          />
          <h2>管理ユーザー情報</h2>
          <Input
            type="text"
            title="氏"
            elementName="lastName"
            onChange={(e) => {
              setLastName(e.target.value)
            }}
          />
          <Input
            type="text"
            title="名"
            elementName="firstName"
            onChange={(e) => {
              setFirstName(e.target.value)
            }}
          />
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
          <Input
            type="password"
            title="パスワード(確認)"
            elementName="passwordConfirmation"
            onChange={(e) => {
              setPasswordConfirmation(e.target.value)
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
            label="決定"
            onClick={handlePostGroup}
            isConfirm={true}
          />
        </div>
      </div>
      <footer className="h-8 w-full"></footer>
    </div>
  )
}
