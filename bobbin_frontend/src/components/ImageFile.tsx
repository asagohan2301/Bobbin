import type { FileApiResponse } from '@/types/productTypes'

type ImageFileProps = {
  file: FileApiResponse
  width: string
}

export default function ImageFile(props: ImageFileProps) {
  const { file, width } = props

  return (
    <div className={width}>
      <img
        src={file.url}
        alt={`file-${file.id}`}
        className="mb-1 border border-gray-300"
      />
      <p className="text-xs">{file.name}</p>
    </div>
  )
}
