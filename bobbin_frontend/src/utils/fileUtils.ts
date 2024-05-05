import type { PreviewFile } from '@/types/productTypes'
import { validateFiles } from '@/utils/validateUtils'

export const calculateFilesTotalSize = (
  existingFiles: File[],
  newFiles: File[],
) => {
  return newFiles.reduce(
    (total, file) => total + file.size,
    existingFiles.reduce((total, file) => total + file.size, 0),
  )
}

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

export const removeFile = (
  targetFileIndex: number,
  files: File[],
  previewFiles: PreviewFile[],
) => {
  const newSize = files.reduce((acc, file, i) => {
    return i === targetFileIndex ? acc : acc + file.size
  }, 0)
  const newFiles = files.filter((_, i) => i !== targetFileIndex)
  const fileURLToRemove = previewFiles[targetFileIndex].url
  return { newFiles, newSize, fileURLToRemove }
}

// files が更新されたら previewFiles と クリーンアップ関数を返す
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
