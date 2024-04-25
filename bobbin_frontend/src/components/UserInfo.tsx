import Image from 'next/image'
import { ChevronDown } from 'react-bootstrap-icons'

export default function UserInfo() {
  return (
    <div>
      <div className="mb-1">ABC design</div>
      <div className="flex items-center">
        <Image
          src="/bobbin_icon.png"
          width={27}
          height={27}
          alt="bobbin-icon"
          className="mr-2"
        />
        <div className="mr-6 cursor-pointer">山田</div>
        <ChevronDown className="cursor-pointer" />
      </div>
    </div>
  )
}
