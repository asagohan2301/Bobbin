'use client'

import { getCookie } from '@/utils/cookieUtils'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { ChevronDown } from 'react-bootstrap-icons'

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
        <Image
          src="/bobbin_icon.png"
          width={27}
          height={27}
          alt="bobbin-icon"
          className="mr-2"
        />
        <div className="mr-6">{`${lastName} ${firstName}`}</div>
        <ChevronDown />
      </div>
    </div>
  )
}
