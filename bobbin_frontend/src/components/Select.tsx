type SelectProps<T> = {
  title: string
  initialValue?: string
  onChange: React.ChangeEventHandler<HTMLSelectElement>
  objects: T[]
  propertyName: keyof T
  propertyName2?: keyof T
  disabled?: boolean
  currentSelectedId?: number | null
}

export default function Select<T extends { id: number }>(
  props: SelectProps<T>,
) {
  const {
    title,
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
      <p className="mb-[3px] text-[13px]">{title}</p>
      <select
        onChange={onChange}
        className="rounded border border-gray-400 p-2 text-[15px]"
        disabled={disabled}
      >
        {initialValue && <option value="null">{initialValue}</option>}
        {objects.map((object) => {
          const displayText = propertyName2
            ? `${object[propertyName2]} ${object[propertyName]}`
            : object[propertyName]
          return (
            <option
              value={object.id}
              key={object.id}
              selected={object.id === currentSelectedId ? true : undefined}
            >
              {String(displayText)}
            </option>
          )
        })}
      </select>
    </div>
  )
}
