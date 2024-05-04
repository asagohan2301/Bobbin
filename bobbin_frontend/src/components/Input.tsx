type InputProps = {
  title: string
  elementName: string
  onChange: React.ChangeEventHandler<HTMLInputElement>
  currentValue?: string
}

export default function Input(props: InputProps) {
  const { title, elementName, onChange, currentValue } = props
  return (
    <div className="mb-4 flex flex-col">
      <label htmlFor={elementName}>{title}</label>
      <input
        type="text"
        id={elementName}
        onChange={onChange}
        className="rounded border-2 border-gray-500 px-2 py-1"
        // ↓これだと消せないねーーー
        value={currentValue ? currentValue : undefined}
      />
    </div>
  )
}
