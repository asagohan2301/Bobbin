'use client'

import ButtonWithIcon from '@/components/ButtonWithIcon'
import ErrorMessage from '@/components/ErrorMessage'
import Input from '@/components/Input'
import Select from '@/components/Select'
import { destroyFile, getSelectOptions } from '@/services/productService'
import type {
  CustomerApiResponse,
  CustomersApiResponse,
  FileApiResponse,
  PreviewFile,
  ProductTypeApiResponse,
  ProductTypesApiResponse,
  ProgressApiResponse,
  ProgressesApiResponse,
  UserApiResponse,
  UsersApiResponse,
} from '@/types/productTypes'
import {
  calculateFilesTotalSize,
  checkFilesErrors,
  generatePreviewFiles,
  removeNewFile,
} from '@/utils/fileUtils'
import { validateProductForm } from '@/utils/validateUtils'
import { useEffect, useRef, useState } from 'react'
import { Check, FileEarmarkPlus, Trash3, X } from 'react-bootstrap-icons'

type ProductFormProps = {
  title: string
  productId?: number
  currentProductTypeId?: number
  currentCustomerId?: number
  currentProductNumber?: string
  currentProductName?: string
  currentUserId?: number
  currentProgressId?: number
  currentExistingFiles?: FileApiResponse[] | []
  submitButtonTitle: string
  submitButtonAction: (
    groupId: number,
    productTypeId: number,
    customerId: number,
    productNumber: string,
    productName: string,
    userId: number,
    progressId: number,
    files: File[],
  ) => Promise<void>
  showDestroyButton?: boolean
  destroyButtonAction?: () => Promise<void>
  responseErrorMessages: string[]
}

export default function ProductForm(props: ProductFormProps) {
  const {
    title,
    productId,
    currentProductTypeId,
    currentCustomerId,
    currentProductNumber,
    currentProductName,
    currentUserId,
    currentProgressId,
    currentExistingFiles,
    submitButtonTitle,
    submitButtonAction,
    showDestroyButton,
    destroyButtonAction,
    responseErrorMessages,
  } = props

  const groupId = 1
  const [productTypes, setProductTypes] = useState<ProductTypeApiResponse[]>([])
  const [productTypeId, setProductTypeId] = useState<number | null>(
    currentProductTypeId || null,
  )
  const [customers, setCustomers] = useState<CustomerApiResponse[]>([])
  const [customerId, setCustomerId] = useState<number | null>(
    currentCustomerId || null,
  )
  const [productNumber, setProductNumber] = useState<string>(
    currentProductNumber || '',
  )
  const [productName, setProductName] = useState<string>(
    currentProductName || '',
  )
  const [users, setUsers] = useState<UserApiResponse[]>([])
  const [userId, setUserId] = useState<number | null>(currentUserId || null)
  const [progresses, setProgresses] = useState<ProgressApiResponse[]>([])
  const [progressId, setProgressId] = useState<number | null>(
    currentProgressId || null,
  )

  const [existingFiles, setExistingFiles] = useState<FileApiResponse[]>(
    currentExistingFiles || [],
  )
  const [existingFilesTotalSize, setExistingFilesTotalSize] =
    useState<number>(0)
  const [newFiles, setNewFiles] = useState<File[]>([])
  const [newFilesTotalSize, setNewFilesTotalSize] = useState<number>(0)
  const [previewFiles, setPreviewFiles] = useState<PreviewFile[]>([])

  const [selectOptionsLoadErrorMessages, setSelectOptionsLoadErrorMessages] =
    useState<string[]>([])
  const [productValidateErrorMessages, setProductValidateErrorMessages] =
    useState<string[]>([])
  const [fileValidateErrorMessages, setFileValidateErrorMessages] = useState<
    string[]
  >([])

  const fileInputRef = useRef<HTMLInputElement>(null)

  // ページ読み込み時に select 要素のオプションを取得
  useEffect(() => {
    handleGetSelectOptions()
  }, [])

  // newFiles が更新されたら previewFiles と newFilesTotalSize を更新する
  useEffect(() => {
    const filesTotalSize = calculateFilesTotalSize(newFiles)
    setNewFilesTotalSize(filesTotalSize)

    const [pendingPreviewFiles, cleanUp] = generatePreviewFiles(newFiles)
    setPreviewFiles(pendingPreviewFiles)
    return cleanUp
  }, [newFiles])

  // existingFiles が更新されたら existingFilesTotalSize を更新する
  useEffect(() => {
    const filesTotalSize = calculateFilesTotalSize(existingFiles)
    setExistingFilesTotalSize(filesTotalSize)
  }, [existingFiles])

  // 新規登録送信 or 編集送信
  const handleSubmit = async () => {
    const errors = validateProductForm(
      productTypeId,
      customerId,
      productNumber,
      productName,
    )
    if (errors.length > 0) {
      setProductValidateErrorMessages(errors)
      return
    }

    await submitButtonAction(
      groupId,
      productTypeId as number,
      customerId as number,
      productNumber,
      productName,
      userId as number,
      progressId as number,
      newFiles,
    )
  }

  // select 要素のオプションを取得
  const handleGetSelectOptions = async () => {
    try {
      const productTypesData =
        await getSelectOptions<ProductTypesApiResponse>('product-types')
      if (productTypesData.product_types.length > 0) {
        setProductTypes(productTypesData.product_types)
      } else {
        throw new Error('種別のデータがありません')
      }

      const customersData =
        await getSelectOptions<CustomersApiResponse>('customers')
      if (customersData.customers.length > 0) {
        setCustomers(customersData.customers)
      } else {
        throw new Error('顧客のデータがありません')
      }

      const usersData = await getSelectOptions<UsersApiResponse>('users')
      if (usersData.users.length > 0) {
        setUsers(usersData.users)
      } else {
        throw new Error('ユーザーのデータがありません')
      }

      const progressesData =
        await getSelectOptions<ProgressesApiResponse>('progresses')
      if (progressesData.progresses.length > 0) {
        setProgresses(progressesData.progresses)
      } else {
        throw new Error('進捗のデータがありません')
      }
    } catch (error) {
      setSelectOptionsLoadErrorMessages((currentMessages) => {
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

  // newFiles 更新
  const handleUpdateFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const pendingNewFiles = Array.from(e.target.files)

      const errors = checkFilesErrors(
        existingFiles,
        newFiles,
        pendingNewFiles,
        existingFilesTotalSize,
        newFilesTotalSize,
      )

      if (errors.length > 0) {
        setFileValidateErrorMessages(errors)
        return
      }

      setNewFiles((currentNewFiles) => [...currentNewFiles, ...pendingNewFiles])
      e.target.value = ''
    }
  }

  // newFile 削除
  const handleRemoveNewFile = (index: number) => {
    const { updatedFiles, fileURLToRemove } = removeNewFile(
      index,
      newFiles,
      previewFiles,
    )
    setNewFiles(updatedFiles)
    URL.revokeObjectURL(fileURLToRemove)
  }

  // existingFile 削除
  const handleDestroyExistingFile = async (fileId: number) => {
    if (!productId) {
      return
    }

    try {
      await destroyFile(productId, fileId)
      setExistingFiles((currentFiles) =>
        currentFiles.filter((file) => file.id !== fileId),
      )
    } catch (error) {
      console.log('ファイルの削除に失敗しました')
    }
  }

  return (
    <div className="h-screen">
      <div className="mx-auto h-full max-w-[1440px] px-14 py-5">
        <h1 className="mb-8 text-2xl">{title}</h1>
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
              currentSelectedId={currentProductTypeId}
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
              currentSelectedId={currentCustomerId}
              disabled={productTypeId === 1}
            />
            <Input
              title="品番"
              elementName="productNumber"
              onChange={(e) => {
                setProductNumber(e.target.value)
              }}
              currentValue={currentProductNumber}
            />
            <Input
              title="品名"
              elementName="productName"
              onChange={(e) => {
                setProductName(e.target.value)
              }}
              currentValue={currentProductName}
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
              currentSelectedId={currentUserId}
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
              currentSelectedId={currentProgressId}
            />
          </form>
          <div className="flex-[5_5_0%]">
            <p className="mb-2">ファイル一覧</p>
            <div className="mb-3 h-auto min-h-[200px] border-2 border-gray-400">
              {existingFiles.length > 0 && (
                <div className="flex flex-wrap gap-x-2 gap-y-4 p-4">
                  {existingFiles.map((file) => {
                    return (
                      <div key={file.id} className="flex-[0_0_19.1%]">
                        <img
                          src={file.url}
                          alt=""
                          className="mb-1 cursor-pointer border"
                        />
                        <p className="text-xs">{file.name}</p>
                        <p className="text-xs">
                          {`${(file.size / 1024 / 1024).toFixed(2)} MB`}
                        </p>
                        <button
                          onClick={() => {
                            handleDestroyExistingFile(file.id)
                          }}
                        >
                          <X className="size-[28px]" />
                        </button>
                      </div>
                    )
                  })}
                </div>
              )}
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
                              handleRemoveNewFile(index)
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
                              handleRemoveNewFile(index)
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
              <p className="p-2 text-right text-sm">{`合計 ${((existingFilesTotalSize + newFilesTotalSize) / 1024 / 1024).toFixed(2)} MB / 最大 3MB`}</p>
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
                onChange={handleUpdateFiles}
                ref={fileInputRef}
                className="hidden"
              />
              <p className="text-sm">
                ・アップロードできるファイルは、画像 (JPEG, PNG, GIF)
                とPDFファイルです。
                <br />
                ・ファイル数: 合計10個まで
                <br />
                ・ファイル容量: 各1MBまで、合計3MBまで
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
            label={submitButtonTitle}
            onClick={handleSubmit}
          />
          {showDestroyButton && (
            <ButtonWithIcon
              IconComponent={Trash3}
              label="削除"
              onClick={destroyButtonAction}
            />
          )}
        </div>
        {selectOptionsLoadErrorMessages.length > 0 && (
          <ErrorMessage errorMessages={selectOptionsLoadErrorMessages} />
        )}
        {productValidateErrorMessages.length > 0 && (
          <ErrorMessage errorMessages={productValidateErrorMessages} />
        )}
        {responseErrorMessages.length > 0 && (
          <ErrorMessage errorMessages={responseErrorMessages} />
        )}
      </div>
      <footer className="absolute bottom-0 h-8 w-full"></footer>
    </div>
  )
}
