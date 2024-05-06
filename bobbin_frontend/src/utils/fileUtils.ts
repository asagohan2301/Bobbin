import type { PreviewFile } from '@/types/productTypes'
import { validateFiles } from '@/utils/validateUtils'

// newFiles を更新する前に合計サイズを検証する
// 既存の newFiles と、追加しようとしているファイルの合計サイズを返す
export const calculateFilesTotalSize = (
  currentFiles: File[],
  pendingFiles: File[],
) => {
  return pendingFiles.reduce(
    (total, file) => total + file.size,
    currentFiles.reduce((total, file) => total + file.size, 0),
  )
}

// 修正！！
export const checkFilesErrors = (
  existingFiles: File[],
  newFiles: File[],
  fileTotalSize: number,
) => {
  return validateFiles(
    existingFiles,
    newFiles,
    existingFiles.length + newFiles.length,
    fileTotalSize,
  )
}

export const removeNewFile = (
  targetFileIndex: number,
  currentFiles: File[],
  previewFiles: PreviewFile[],
) => {
  const updatedFiles = currentFiles.filter((_, i) => i !== targetFileIndex)
  const fileURLToRemove = previewFiles[targetFileIndex].url
  return { updatedFiles, fileURLToRemove }
}

// newFiles が更新されたら previewFiles と クリーンアップ関数を返す
export const generatePreviewFiles = (
  files: File[],
): [PreviewFile[], () => void] => {
  const previewFiles = files.map((file) => {
    return {
      url: URL.createObjectURL(file),
      name: file.name,
      type: file.type,
      size: file.size,
    }
  })
  const cleanUpPreviewFilesURL = () => {
    previewFiles.forEach((file) => URL.revokeObjectURL(file.url))
  }
  return [previewFiles, cleanUpPreviewFilesURL]
}
