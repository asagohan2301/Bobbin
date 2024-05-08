import type { FileApiResponse, PreviewFile } from '@/types/productTypes'
import { X } from 'react-bootstrap-icons'

type PreviewFileInfoProps = {
  file: FileApiResponse | PreviewFile
  onClick: (onClickTarget: number) => void
  onClickTarget: number
}

export default function PreviewFileInfo(props: PreviewFileInfoProps) {
  const { file, onClick, onClickTarget } = props
  return (
    <>
      <p className="text-xs">{file.name}</p>
      <p className="text-xs">{`${(file.size / 1024 / 1024).toFixed(2)} MB`}</p>
      <button
        onClick={() => {
          onClick(onClickTarget)
        }}
      >
        <X className="size-[28px]" />
      </button>
    </>
  )
}
