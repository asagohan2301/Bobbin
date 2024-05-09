'use client'

import { useState } from 'react'

type InputProps = {
  title: string
  elementName: string
  onChange: React.ChangeEventHandler<HTMLInputElement>
  currentValue?: string
}

export default function Input(props: InputProps) {
  const { title, elementName, onChange, currentValue } = props
  const [inputValue, setInputValue] = useState<string>(currentValue || '')

  const handleOnChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setInputValue(e.target.value)
    onChange(e)
  }

  return (
    <div className="mb-4 flex flex-col">
      <label htmlFor={elementName}>{title}</label>
      <input
        type="text"
        id={elementName}
        onChange={handleOnChange}
        className="rounded border border-gray-500 p-2"
        value={inputValue}
      />
    </div>
  )
}
