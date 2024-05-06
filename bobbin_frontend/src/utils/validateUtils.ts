import type { FileApiResponse } from '@/types/productTypes'

// 製品新規登録送信前 / 製品編集送信前
export const validateProductForm = (
  productTypeId: number | null,
  customerId: number | null,
  productNumber: string,
  productName: string,
) => {
  const errorMessages = []
  if (productTypeId === null) {
    errorMessages.push('種別を選択してください')
  }
  if (productTypeId === 2 && customerId === null) {
    errorMessages.push('種別がOEMですが顧客名が選択されていません')
  }
  if (productNumber === '') {
    errorMessages.push('品番を入力してください')
  }
  if (productName === '') {
    errorMessages.push('品名を入力してください')
  }
  return errorMessages
}

// ファイル追加前
export const validateFiles = (
  existingFiles: FileApiResponse[],
  currentNewFiles: File[],
  pendingNewFiles: File[],
  filesTotalLength: number,
  filesTotalSize: number,
) => {
  const errorMessages = new Set<string>()
  if (filesTotalLength > 10) {
    errorMessages.add(
      'ファイルの合計数が上限を超えています。アップロードできるファイルは合計10個以下です。',
    )
  }
  if (filesTotalSize > 3000000) {
    errorMessages.add(
      'ファイルの合計容量が上限を超えています。アップロードできるファイルは合計3MB以下です。',
    )
  }

  const existingFileNames = new Set(existingFiles.map((file) => file.name))
  const currentNewFileNames = new Set(currentNewFiles.map((file) => file.name))

  for (const file of pendingNewFiles) {
    if (
      !['image/jpeg', 'image/png', 'image/gif', 'application/pdf'].includes(
        file.type,
      )
    ) {
      errorMessages.add(
        `${file.name}はサポート対象外のファイルです。アップロードできるファイルは画像 (JPEG, PNG, GIF) とPDFファイルです。`,
      )
    }
    if (file.size > 1000000) {
      errorMessages.add(
        `${file.name}は1MBを超えているためアップロードできません。各ファイルの容量は1MB以下にしてください。`,
      )
    }
    if (
      currentNewFileNames.has(file.name) ||
      existingFileNames.has(file.name)
    ) {
      errorMessages.add(
        `同じ名前のファイルが存在するため、${file.name}はアップロードできません。`,
      )
    }
  }

  const errorMessageArray = Array.from(errorMessages)
  return errorMessageArray
}
