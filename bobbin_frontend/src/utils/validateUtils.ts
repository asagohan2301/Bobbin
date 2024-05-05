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
  existingFiles: File[],
  validateFiles: File[],
  fileLength: number,
  fileTotalSize: number,
) => {
  const errorMessages = new Set<string>()
  if (fileLength > 10) {
    errorMessages.add(
      'ファイル数が上限を超えるため追加できませんでした。一度にアップロードできるファイルは10個までです。',
    )
  }
  if (fileTotalSize > 3000000) {
    errorMessages.add(
      'ファイルの合計容量が上限を超えるため追加できませんでした。アップロードできるファイルの合計は3MB以下です。',
    )
  }

  for (const validateFile of validateFiles) {
    if (
      !['image/jpeg', 'image/png', 'image/gif', 'application/pdf'].includes(
        validateFile.type,
      )
    ) {
      errorMessages.add(
        'サポート対象外のファイルがあるため追加できませんでした。アップロードできるファイルは画像 (JPEG, PNG, GIF) とPDFファイルです。',
      )
    }
    if (validateFile.size > 1000000) {
      errorMessages.add(
        '容量が上限を超えているファイルがあるため追加できませんでした。アップロードできるファイルの容量は1ファイル1MB以下です。',
      )
    }
    if (existingFiles.some((file) => file.name === validateFile.name)) {
      errorMessages.add(
        '同じ名前のファイルが既に存在するため追加できませんでした。',
      )
    }
  }

  const errorMessageArray = Array.from(errorMessages)
  return errorMessageArray
}
