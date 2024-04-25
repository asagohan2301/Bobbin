import Link from 'next/link'

type ButtonWithIconProps = {
  IconComponent: React.ElementType
  label: string
  href?: string
  onClick?: () => void
}

export default function ButtonWithIcon(props: ButtonWithIconProps) {
  const { IconComponent, label, href, onClick } = props

  const renderButtonTag = () => {
    return (
      <button
        className="flex items-center gap-2 rounded-2xl border-2 border-gray-400 px-4 py-2 text-sm"
        onClick={onClick}
      >
        <IconComponent className="size-[20px] cursor-pointer text-gray-700" />
        {label}
      </button>
    )
  }

  if (href) {
    return <Link href={href}>{renderButtonTag()}</Link>
  } else {
    return renderButtonTag()
  }
}
