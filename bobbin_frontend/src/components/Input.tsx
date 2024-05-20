'use client'

import type { ReactNode } from 'react'
import { useState } from 'react'

type InputProps = {
  type: string
  title?: string
  onChange: React.ChangeEventHandler<HTMLInputElement>
  currentValue?: string
  placeholder?: string
  children?: ReactNode
}

export default function Input(props: InputProps) {
  const { type, title, onChange, currentValue, placeholder, children } = props
  const [inputValue, setInputValue] = useState<string>(currentValue || '')

  const handleOnChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setInputValue(e.target.value)
    onChange(e)
  }

  return (
    <div className="mb-4 flex flex-col">
      {title ? (
        <p className="mb-[3px] text-[13px]">{title}</p>
      ) : (
        <p className="mb-[3px] text-[13px]">{children}</p>
      )}
      <input
        type={type}
        onChange={handleOnChange}
        className="rounded border border-gray-400 p-2 text-[15px]"
        value={inputValue}
        placeholder={placeholder}
      />
    </div>
  )
}
