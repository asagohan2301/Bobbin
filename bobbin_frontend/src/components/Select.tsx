type SelectProps<T> = {
  title: string
  elementName: string
  initialValue?: string
  onChange: React.ChangeEventHandler<HTMLSelectElement>
  objects: T[]
  propertyName: keyof T
  propertyName2?: keyof T
  disabled?: boolean
  currentSelectedId?: number
}

export default function Select<T extends { id: number }>(
  props: SelectProps<T>,
) {
  const {
    title,
    elementName,
    initialValue,
    onChange,
    objects,
    propertyName,
    propertyName2,
    disabled,
    currentSelectedId,
  } = props
  return (
    <div className="mb-4 flex flex-col">
      <label htmlFor={elementName}>{title}</label>
      <select
        id={elementName}
        onChange={onChange}
        className="rounded border-2 border-gray-500 p-2"
        disabled={disabled}
      >
        <option>{initialValue}</option>
        {objects.map((object) => {
          const displayText = propertyName2
            ? `${object[propertyName2]}: ${object[propertyName]}`
            : object[propertyName]
          return (
            <option
              value={object.id}
              key={object.id}
              selected={object.id === currentSelectedId ? true : undefined}
              className="border-b-2 p-2"
            >
              {String(displayText)}
            </option>
          )
        })}
      </select>
    </div>
  )
}
