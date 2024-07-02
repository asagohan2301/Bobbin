'use client'

import { getCookie } from '@/utils/cookieUtils'
import { useEffect, useState } from 'react'
import { ChevronDown, Person } from 'react-bootstrap-icons'

export default function UserInfo() {
  const [groupName, setGroupName] = useState<string>()
  const [firstName, setFirstName] = useState<string>()
  const [lastName, setLastName] = useState<string>()

  useEffect(() => {
    getUserInfo()
  }, [])

  const getUserInfo = async () => {
    const groupNameData = await getCookie('groupName')
    const firstNameData = await getCookie('firstName')
    const lastNameData = await getCookie('lastName')

    setGroupName(groupNameData)
    setFirstName(firstNameData)
    setLastName(lastNameData)
  }

  return (
    <div>
      <div className="mb-1">{groupName}</div>
      <div className="flex items-center">
        <div className="relative mr-2 size-[28px] rounded-full bg-[#FFD7BC]">
          <Person className="absolute inset-0 m-auto size-[16px] text-white" />
        </div>
        <div className="mr-6">{`${lastName} ${firstName}`}</div>
        <ChevronDown />
      </div>
    </div>
  )
}
