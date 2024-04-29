'use client'

import ButtonWithIcon from '@/components/ButtonWithIcon'
import ErrorMessage from '@/components/ErrorMessage'
import Input from '@/components/Input'
import Select from '@/components/Select'
import { getSelectOptions, postProduct } from '@/services/productService'
import type {
  CustomerApiResponse,
  CustomersApiResponse,
  ProductTypeApiResponse,
  ProductTypesApiResponse,
  ProgressApiResponse,
  ProgressesApiResponse,
  UserApiResponse,
  UsersApiResponse,
} from '@/types/productTypes'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { Check, FileEarmarkPlus, X } from 'react-bootstrap-icons'

type PreviewFile = {
  url: string
  name: string
  type: string
  size: number
}

export default function New() {
  const groupId = 1
  const [productTypes, setProductTypes] = useState<ProductTypeApiResponse[]>([])
  const [productTypeId, setProductTypeId] = useState<number | null>(null)
  const [customers, setCustomers] = useState<CustomerApiResponse[]>([])
  const [customerId, setCustomerId] = useState<number | null>(null)
  const [productNumber, setProductNumber] = useState<string>('')
  const [productName, setProductName] = useState<string>('')
  const [users, setUsers] = useState<UserApiResponse[]>([])
  const [userId, setUserId] = useState<number | null>(null)
  const [progresses, setProgresses] = useState<ProgressApiResponse[]>([])
  const [progressId, setProgressId] = useState<number | null>(null)
  const [productValidateErrorMessages, setProductValidateErrorMessages] =
    useState<string[]>([])
  const [loadErrorMessages, setLoadErrorMessages] = useState<string[]>([])

  const [files, setFiles] = useState<File[]>([])
  const [fileTotalSize, setFileTotalSize] = useState<number>(0)
  const [previewFiles, setPreviewFiles] = useState<PreviewFile[]>([])
  const [fileValidateErrorMessages, setFileValidateErrorMessages] = useState<
    string[]
  >([])

  const fileInputRef = useRef<HTMLInputElement>(null)

  const router = useRouter()

  useEffect(() => {
    handleGetSelectOptions()
  }, [])

  useEffect(() => {
    const newPreviewFiles = files.map((file) => {
      return {
        url: URL.createObjectURL(file),
        name: file.name,
        type: file.type,
        size: file.size,
      }
    })
    setPreviewFiles(newPreviewFiles)

    return () => {
      newPreviewFiles.forEach((file) => URL.revokeObjectURL(file.url))
    }
  }, [files])

  const handleGetSelectOptions = async () => {
    try {
      const productTypesData =
        await getSelectOptions<ProductTypesApiResponse>('product-types')
      if (productTypesData.product_types.length > 0) {
        setProductTypes(productTypesData.product_types)
        // setProductTypeId(productTypesData.product_types[0].id)
      } else {
        throw new Error('種別のデータがありません')
      }

      const customersData =
        await getSelectOptions<CustomersApiResponse>('customers')
      if (customersData.customers.length > 0) {
        setCustomers(customersData.customers)
        // setCustomerId(customersData.customers[0].id)
      } else {
        throw new Error('顧客のデータがありません')
      }

      const usersData = await getSelectOptions<UsersApiResponse>('users')
      if (usersData.users.length > 0) {
        setUsers(usersData.users)
        // setUserId(usersData.users[0].id)
      } else {
        throw new Error('ユーザーのデータがありません')
      }

      const progressesData =
        await getSelectOptions<ProgressesApiResponse>('progresses')
      if (progressesData.progresses.length > 0) {
        setProgresses(progressesData.progresses)
        // setProgressId(progressesData.progresses[0].id)
      } else {
        throw new Error('進捗のデータがありません')
      }
    } catch (error) {
      setLoadErrorMessages((currentMessages) => {
        if (error instanceof Error) {
          const newMessage = error.message
          return currentMessages.includes(newMessage)
            ? currentMessages
            : [...currentMessages, newMessage]
        } else {
          const genericMessage = '想定外のエラーが発生しました'
          return currentMessages.includes(genericMessage)
            ? currentMessages
            : [...currentMessages, genericMessage]
        }
      })
    }
  }

  const removeFile = (index: number) => {
    const newSize = fileTotalSize - files[index].size
    setFiles((prevFiles) => {
      const newFiles = prevFiles.filter((_, i) => i !== index)
      setFileTotalSize(newSize)
      return newFiles
    })
    URL.revokeObjectURL(previewFiles[index].url)
  }

  const validateProductForm = () => {
    const messages = []
    if (productTypeId === null) {
      messages.push('種別を選択してください')
    }
    if (productTypeId === 2 && customerId === null) {
      messages.push('種別がOEMですが顧客名が選択されていません')
    }
    if (productNumber === '') {
      messages.push('品番を入力してください')
    }
    if (productName === '') {
      messages.push('品名を入力してください')
    }
    if (messages.length > 0) {
      setProductValidateErrorMessages(messages)
      return false
    } else {
      return true
    }
  }

  const validateFiles = (
    validateFiles: File[],
    fileLength: number,
    fileTotalSize: number,
  ) => {
    const messages = new Set<string>()
    if (fileLength > 10) {
      messages.add(
        'ファイル数が上限を超えるため追加できませんでした。一度にアップロードできるファイルは10個までです。',
      )
    }
    if (fileTotalSize > 3000000) {
      messages.add(
        'ファイルの合計容量が上限を超えるため追加できませんでした。アップロードできるファイルの合計は3MB以下です。',
      )
    }

    for (const validateFile of validateFiles) {
      if (
        !['image/jpeg', 'image/png', 'image/gif', 'application/pdf'].includes(
          validateFile.type,
        )
      ) {
        messages.add(
          'サポート対象外のファイルがあるため追加できませんでした。アップロードできるファイルは画像 (JPEG, PNG, GIF) とPDFファイルです。',
        )
      }
      if (validateFile.size > 1000000) {
        messages.add(
          '容量が上限を超えているファイルがあるため追加できませんでした。アップロードできるファイルの容量は1ファイル1MB以下です。',
        )
      }
      if (files.some((file) => file.name === validateFile.name)) {
        messages.add(
          '同じ名前のファイルが既に存在するため追加できませんでした。',
        )
      }
    }

    const messageArray = Array.from(messages)
    setFileValidateErrorMessages(messageArray)
    return messages.size === 0
  }

  const handlePostProduct = () => {
    if (!validateProductForm()) {
      return
    }
    postProduct(
      groupId,
      productTypeId!,
      customerId,
      productNumber,
      productName,
      userId,
      progressId,
      files,
    )
      .then((id) => {
        router.push(`/product/${id}`)
      })
      .catch((error) => {
        setLoadErrorMessages(error.message.split(','))
      })
  }

  return (
    <div className="h-screen">
      <div className="mx-auto h-full max-w-[1440px] px-14 py-5">
        <h1 className="mb-8 text-2xl">製品登録</h1>
        <div className="flex gap-20">
          <form className="flex-[3_3_0%]">
            <Select<ProductTypeApiResponse>
              title="種別"
              elementName="productType"
              onChange={(e) => {
                setProductTypeId(parseInt(e.target.value))
              }}
              initialValue="選択してください"
              objects={productTypes}
              propertyName="product_type"
            />
            <Select<CustomerApiResponse>
              title="お客様名"
              elementName="customer"
              onChange={(e) => {
                setCustomerId(parseInt(e.target.value))
              }}
              initialValue="選択してください"
              objects={customers}
              propertyName="customer_name"
              disabled={productTypeId === 1}
            />
            <Input
              title="品番"
              elementName="productNumber"
              onChange={(e) => {
                setProductNumber(e.target.value)
              }}
            />
            <Input
              title="品名"
              elementName="productName"
              onChange={(e) => {
                setProductName(e.target.value)
              }}
            />
            <Select<UserApiResponse>
              title="担当者"
              elementName="user"
              onChange={(e) => {
                setUserId(parseInt(e.target.value))
              }}
              initialValue="未定"
              objects={users}
              propertyName="user_name"
            />
            <Select<ProgressApiResponse>
              title="進捗"
              elementName="progress"
              onChange={(e) => {
                setProgressId(parseInt(e.target.value))
              }}
              initialValue="未定"
              objects={progresses}
              propertyName="progress_status"
              propertyName2="progress_order"
            />
          </form>
          <div className="flex-[5_5_0%]">
            <p className="mb-2">ファイル一覧</p>
            <div className="mb-3 h-auto min-h-[200px] border-2 border-gray-400">
              {previewFiles.length > 0 && (
                <div className="flex flex-wrap gap-x-2 gap-y-4 p-4">
                  {previewFiles.map((file, index) => {
                    if (
                      ['image/jpeg', 'image/png', 'image/gif'].includes(
                        file.type,
                      )
                    ) {
                      return (
                        <div key={index} className="flex-[0_0_19.1%]">
                          <img
                            src={file.url}
                            alt={`preview-${index}`}
                            onLoad={() => URL.revokeObjectURL(file.url)}
                            className="mb-1 cursor-pointer border"
                          />
                          <p className="text-xs">{file.name}</p>
                          <p className="text-xs">
                            {`${(file.size / 1024 / 1024).toFixed(2)} MB`}
                          </p>
                          <button
                            onClick={() => {
                              removeFile(index)
                            }}
                          >
                            <X className="size-[28px]" />
                          </button>
                        </div>
                      )
                    } else if (file.type === 'application/pdf') {
                      return (
                        <div key={index} className="flex-[0_0_19.1%]">
                          <div className="mb-1 min-h-[80px] border p-2">
                            PDF file
                          </div>
                          <p className="text-xs">{file.name}</p>
                          <p className="text-xs">
                            {`${(file.size / 1024 / 1024).toFixed(2)} MB`}
                          </p>
                          <button
                            onClick={() => {
                              removeFile(index)
                            }}
                          >
                            <X className="size-[28px]" />
                          </button>
                        </div>
                      )
                    }
                  })}
                </div>
              )}
              <p className="p-2 text-right text-sm">{`合計 ${(fileTotalSize / 1024 / 1024).toFixed(2)} MB / 最大 3MB`}</p>
            </div>
            <div className="flex gap-3">
              <ButtonWithIcon
                IconComponent={FileEarmarkPlus}
                label="ファイルを追加"
                onClick={() => {
                  if (fileInputRef.current) {
                    fileInputRef.current.click()
                  }
                }}
              />
              <input
                type="file"
                multiple
                onChange={(e) => {
                  if (e.target.files) {
                    const newFiles = Array.from(e.target.files)
                    const newSize = newFiles.reduce(
                      (total, file) => total + file.size,
                      fileTotalSize,
                    )
                    if (
                      validateFiles(
                        newFiles,
                        files.length + newFiles.length,
                        newSize,
                      )
                    ) {
                      setFiles((prevFiles) => [...prevFiles, ...newFiles])
                      setFileTotalSize(newSize)
                    }

                    e.target.value = ''
                  }
                }}
                ref={fileInputRef}
                className="hidden"
              />
              <p className="text-sm">
                ・アップロードできるファイルは、画像 (JPEG, PNG, GIF)
                とPDFファイルです。
                <br />
                ・各ファイルの容量は1MBまで、合計3MBまでです。
                <br />
                ・一度にアップロードできるファイルは最大10個です。
              </p>
            </div>
            {fileValidateErrorMessages.length > 0 && (
              <ErrorMessage errorMessages={fileValidateErrorMessages} />
            )}
          </div>
        </div>
        <div className="flex justify-end gap-4">
          <ButtonWithIcon IconComponent={X} label="キャンセル" href="/" />
          <ButtonWithIcon
            IconComponent={Check}
            label="登録"
            onClick={handlePostProduct}
          />
        </div>
        {loadErrorMessages.length > 0 && (
          <ErrorMessage errorMessages={loadErrorMessages} />
        )}
        {productValidateErrorMessages.length > 0 && (
          <ErrorMessage errorMessages={productValidateErrorMessages} />
        )}
      </div>
      <footer className="absolute bottom-0 h-8 w-full"></footer>
    </div>
  )
}
