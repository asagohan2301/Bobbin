import classNames from 'classnames'
import Link from 'next/link'

type ButtonWithIconProps = {
  IconComponent: React.ElementType
  label: string
  href?: string
  onClick?: () => void
  isRegular?: boolean
  isCancel?: boolean
  isConfirm?: boolean
  isDestroy?: boolean
}

export default function ButtonWithIcon(props: ButtonWithIconProps) {
  const {
    IconComponent,
    label,
    href,
    onClick,
    isRegular,
    isCancel,
    isConfirm,
    isDestroy,
  } = props

  const buttonClasses = classNames(
    'flex items-center gap-2 rounded-lg px-5 py-3 text-sm',
    {
      'border border-gray-500 text-gray-700': isRegular,
      'border border-gray-400 text-gray-500': isCancel,
      'bg-blue-400 text-white': isConfirm,
      'bg-red-500 text-white': isDestroy,
    },
  )

  const iconClasses = classNames('size-[18px] cursor-pointer', {
    'text-gray-700': isRegular,
    'text-gray-500': isCancel,
    'text-white': isConfirm || isDestroy,
  })

  const renderButtonTag = () => {
    return (
      <button className={buttonClasses} onClick={onClick}>
        <IconComponent className={iconClasses} />
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
