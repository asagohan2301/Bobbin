import type { FileApiResponse, PreviewFile } from '@/types/productTypes'
import { validateFiles } from '@/utils/validateUtils'

export const calculateFilesTotalSize = (files: File[] | FileApiResponse[]) => {
  const filesTotalSize = files.reduce((total, file) => {
    return total + file.size
  }, 0)
  return filesTotalSize
}

export const checkFilesErrors = (
  existingFiles: FileApiResponse[],
  currentNewFiles: File[],
  pendingNewFiles: File[],
  existingFilesTotalSize: number,
  newFilesTotalSize: number,
) => {
  const filesTotalLength =
    existingFiles.length + currentNewFiles.length + pendingNewFiles.length
  const filesTotalSize =
    existingFilesTotalSize +
    newFilesTotalSize +
    calculateFilesTotalSize(pendingNewFiles)

  return validateFiles(
    existingFiles,
    currentNewFiles,
    pendingNewFiles,
    filesTotalLength,
    filesTotalSize,
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
