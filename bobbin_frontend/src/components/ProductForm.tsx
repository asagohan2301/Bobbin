'use client'

import BobbinIcon from '@/components/BobbinIcon.svg'
import ButtonWithIcon from '@/components/ButtonWithIcon'
import ErrorMessage from '@/components/ErrorMessage'
import Input from '@/components/Input'
import PreviewFileInfo from '@/components/PreviewFileInfo'
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
import { getCookie } from '@/utils/cookieUtils'
import { getCroppedImg } from '@/utils/cropUtils'
import {
  calculateFilesTotalSize,
  checkFilesErrors,
  generatePreviewFiles,
  removeNewFile,
} from '@/utils/fileUtils'
import { validateProductForm } from '@/utils/validateUtils'
import { useRouter } from 'next/navigation'
import type { ChangeEvent } from 'react'
import { useEffect, useRef, useState } from 'react'
import {
  Check,
  FileEarmarkPlus,
  PencilSquare,
  Trash3,
  X,
} from 'react-bootstrap-icons'

import type { Crop, PixelCrop } from 'react-image-crop'
import ReactCrop from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'

type ProductFormProps = {
  title: string
  productId?: number
  currentProductTypeId?: number
  currentCustomerId?: number | null
  currentProductNumber?: string
  currentProductName?: string
  currentUserId?: number | null
  currentProgressId?: number
  currentExistingFiles?: FileApiResponse[] | []
  currentProductIconUrl?: string | null
  submitButtonTitle: string
  submitButtonAction: (
    productTypeId: number,
    customerId: number | null,
    productNumber: string,
    productName: string,
    userId: number | null,
    progressId: number,
    files: File[],
    productIconBlob: Blob | undefined,
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
    currentProductIconUrl,
    submitButtonTitle,
    submitButtonAction,
    showDestroyButton,
    destroyButtonAction,
    responseErrorMessages,
  } = props

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

  const [crop, setCrop] = useState<Crop | undefined>(undefined)
  const [productIconBlob, setProductIconBlob] = useState<Blob>()
  const [productIconPendingImageUrl, setProductIconPendingImageUrl] =
    useState<string>()
  const [productIconCroppedImageUrl, setProductIconCroppedImageUrl] =
    useState<string>(currentProductIconUrl || '')

  const [loading, setLoading] = useState(true)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const productIconImgRef = useRef<HTMLImageElement>(null)
  const productIconInputRef = useRef<HTMLInputElement>(null)

  const router = useRouter()

  // トークンが Cookie に存在しているか検証
  useEffect(() => {
    const checkToken = async () => {
      const token = await getCookie('token')
      if (!token) {
        router.push('/login')
      } else {
        setLoading(false)
      }
    }
    checkToken()
  }, [router])

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

  // productIcon の URL を解放
  useEffect(() => {
    return () => {
      if (productIconPendingImageUrl) {
        URL.revokeObjectURL(productIconPendingImageUrl)
      }
      if (productIconCroppedImageUrl) {
        URL.revokeObjectURL(productIconCroppedImageUrl)
      }
    }
  }, [productIconPendingImageUrl, productIconCroppedImageUrl])

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
      productTypeId as number,
      customerId,
      productNumber,
      productName,
      userId,
      progressId as number,
      newFiles,
      productIconBlob,
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
        setProgressId(progressesData.progresses[0].id)
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

  // 製品サムネイル用画像が選択されたときの処理
  const handleChangeCrop = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0]
      if (!['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
        alert('画像ファイル (JPEG, PNG, GIF) を選択してください')
        return
      }
      const newUrl = URL.createObjectURL(file)

      if (productIconPendingImageUrl) {
        URL.revokeObjectURL(productIconPendingImageUrl)
      }

      setProductIconPendingImageUrl(newUrl)
      e.target.value = ''
    }
  }

  // 画像がトリミングされたときの処理
  const handleCompleteCrop = async (c: PixelCrop) => {
    if (productIconImgRef.current) {
      try {
        const newBlob = await getCroppedImg(productIconImgRef.current, c)
        const newUrl = URL.createObjectURL(newBlob)

        if (productIconCroppedImageUrl) {
          URL.revokeObjectURL(productIconCroppedImageUrl)
        }

        setProductIconBlob(newBlob)
        setProductIconCroppedImageUrl(newUrl)
      } catch (error) {
        console.error(error)
      }
    }
  }

  if (loading) {
    return <p>loading...</p>
  }

  return (
    <div>
      <div className="relative mx-auto max-w-[1440px] px-14 py-5">
        <h1 className="mb-8 text-2xl">{title}</h1>
        <div className="flex gap-20">
          <div className="flex-[3_3_0%]">
            {/* productIcon 表示 */}
            <div>
              <p className="mb-2">製品サムネイル</p>
              <div className="mb-4 flex items-center gap-4">
                <div className="size-[120px] border border-gray-500">
                  {productIconCroppedImageUrl ? (
                    <img src={productIconCroppedImageUrl} alt="product-icon" />
                  ) : (
                    <BobbinIcon fill="#FFD7BC" />
                  )}
                </div>
                {/* productIcon選択 */}
                <div className="flex-1">
                  <ButtonWithIcon
                    IconComponent={PencilSquare}
                    label="編集"
                    onClick={() => {
                      if (productIconInputRef.current) {
                        productIconInputRef.current.click()
                      }
                    }}
                    isRegular={true}
                  />
                  <p className="mt-2 text-xs">
                    ・画像ファイル (JPEG, PNG, GIF) を選択してください
                  </p>
                  <input
                    type="file"
                    aria-label="製品のサムネイル用画像を選択してください"
                    ref={productIconInputRef}
                    className="hidden"
                    onChange={handleChangeCrop}
                  />
                </div>
              </div>
            </div>
            {/* productIcon モーダル */}
            {productIconPendingImageUrl && (
              <div className="absolute left-1/2 top-1/2 z-10 w-1/3 -translate-x-1/2 -translate-y-1/2 border border-gray-500 bg-white p-4">
                <p className="mb-2 text-sm">
                  ドラッグして画像をトリミングしてください
                </p>
                <div className="mx-auto mb-2 min-h-[120px] min-w-[120px]">
                  <ReactCrop
                    crop={crop}
                    onChange={(c) => setCrop(c)}
                    aspect={1}
                    onComplete={handleCompleteCrop}
                  >
                    <img
                      src={productIconPendingImageUrl}
                      alt="pending-product-icon"
                      ref={productIconImgRef}
                      className=""
                    />
                  </ReactCrop>
                </div>
                <div className="flex justify-end">
                  <ButtonWithIcon
                    IconComponent={Check}
                    label="決定"
                    onClick={() => {
                      setProductIconPendingImageUrl('')
                      setCrop(undefined)
                    }}
                    isRegular={true}
                  />
                </div>
                <div className="absolute -right-3 -top-4 flex size-[36px] items-center justify-center rounded-full border border-gray-400 bg-white">
                  <X
                    className="cursor-pointer"
                    onClick={() => {
                      setProductIconCroppedImageUrl('')
                      setProductIconPendingImageUrl('')
                      setCrop(undefined)
                    }}
                  />
                </div>
              </div>
            )}
            {/* 製品情報入力フォーム */}
            <form>
              <Select<ProductTypeApiResponse>
                title="種別"
                onChange={(e) => {
                  if (e.target.value === 'null') {
                    setProductTypeId(null)
                  } else {
                    setProductTypeId(parseInt(e.target.value))
                  }
                  if (parseInt(e.target.value) === 1) {
                    setCustomerId(null)
                  }
                }}
                initialValue="選択してください"
                objects={productTypes}
                propertyName="product_type"
                currentSelectedId={productTypeId}
              />
              <Select<CustomerApiResponse>
                title="お客様名"
                onChange={(e) => {
                  if (e.target.value === 'null') {
                    setCustomerId(null)
                  } else {
                    setCustomerId(parseInt(e.target.value))
                  }
                }}
                initialValue="-"
                objects={customers}
                propertyName="customer_name"
                currentSelectedId={customerId}
                disabled={productTypeId === 1}
              />
              <Input
                type="text"
                title="品番"
                onChange={(e) => {
                  setProductNumber(e.target.value)
                }}
                currentValue={currentProductNumber}
              />
              <Input
                type="text"
                title="品名"
                onChange={(e) => {
                  setProductName(e.target.value)
                }}
                currentValue={currentProductName}
              />
              <Select<UserApiResponse>
                title="担当者"
                onChange={(e) => {
                  if (e.target.value === 'null') {
                    setUserId(null)
                  } else {
                    setUserId(parseInt(e.target.value))
                  }
                }}
                initialValue="未定"
                objects={users}
                propertyName="first_name"
                propertyName2="last_name"
                currentSelectedId={userId}
              />
              <Select<ProgressApiResponse>
                title="進捗"
                onChange={(e) => {
                  setProgressId(parseInt(e.target.value))
                }}
                objects={progresses}
                propertyName="progress_status"
                propertyName2="progress_order"
                currentSelectedId={progressId}
              />
            </form>
          </div>
          <div className="flex-[5_5_0%]">
            <p className="mb-2">ファイル一覧</p>
            <div className="mb-3 h-auto min-h-[200px] border border-gray-400">
              {existingFiles.length > 0 && (
                <div className="flex flex-wrap gap-x-2 gap-y-4 p-4">
                  {existingFiles.map((file) =>
                    ['image/jpeg', 'image/png', 'image/gif'].includes(
                      file.type,
                    ) ? (
                      <div key={file.id} className="flex-[0_0_19.1%]">
                        <img
                          src={file.url}
                          alt=""
                          className="mb-1 cursor-pointer border border-gray-300"
                        />
                        <PreviewFileInfo
                          file={file}
                          onClick={handleDestroyExistingFile}
                          onClickTarget={file.id}
                        />
                      </div>
                    ) : file.type === 'application/pdf' ? (
                      <div key={file.id} className="flex-[0_0_19.1%]">
                        <div className="mb-1 min-h-[80px] border border-gray-300 p-2">
                          PDF file
                        </div>
                        <PreviewFileInfo
                          file={file}
                          onClick={handleDestroyExistingFile}
                          onClickTarget={file.id}
                        />
                      </div>
                    ) : null,
                  )}
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
                            className="mb-1 cursor-pointer border border-gray-300"
                          />
                          <PreviewFileInfo
                            file={file}
                            onClick={handleRemoveNewFile}
                            onClickTarget={index}
                          />
                        </div>
                      )
                    } else if (file.type === 'application/pdf') {
                      return (
                        <div key={index} className="flex-[0_0_19.1%]">
                          <div className="mb-1 min-h-[80px] border border-gray-300 p-2">
                            PDF file
                          </div>
                          <PreviewFileInfo
                            file={file}
                            onClick={handleRemoveNewFile}
                            onClickTarget={index}
                          />
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
                isRegular={true}
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
          <ButtonWithIcon
            IconComponent={X}
            label="キャンセル"
            href="/"
            isCancel={true}
          />
          <ButtonWithIcon
            IconComponent={Check}
            label={submitButtonTitle}
            onClick={handleSubmit}
            isConfirm={true}
          />
        </div>
        {showDestroyButton && (
          <div className="mt-4 flex justify-end">
            <div
              onClick={destroyButtonAction}
              className="flex cursor-pointer items-center gap-1 text-[14px] text-gray-400 hover:text-red-500"
            >
              <Trash3 />
              <p>製品を削除</p>
            </div>
          </div>
        )}
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
      <footer className="h-8 w-full"></footer>
    </div>
  )
}
