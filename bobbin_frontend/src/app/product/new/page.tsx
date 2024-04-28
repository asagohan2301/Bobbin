'use client'

import ButtonWithIcon from '@/components/ButtonWithIcon'
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
  const [files, setFiles] = useState<File[]>([])
  const [previewUrls, setPreviewUrls] = useState<string[]>([])
  const [errorMessages, setErrorMessages] = useState<string[]>([])

  const fileInputRef = useRef<HTMLInputElement>(null)

  const router = useRouter()

  useEffect(() => {
    handleGetSelectOptions()
  }, [])

  useEffect(() => {
    const newPreviewUrls = files.map((file) => URL.createObjectURL(file))
    setPreviewUrls(newPreviewUrls)

    return () => {
      newPreviewUrls.forEach((url) => URL.revokeObjectURL(url))
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
      setErrorMessages((currentMessages) => {
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
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index))
    URL.revokeObjectURL(previewUrls[index])
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
      setErrorMessages(messages)
      return false
    } else {
      return true
    }
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
        setErrorMessages(error.message.split(','))
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
              {previewUrls.length > 0 && (
                <div className="flex flex-wrap gap-x-2 gap-y-4 p-4">
                  {previewUrls.map((url, index) => {
                    return (
                      <div key={index} className="flex-[0_0_19.1%]">
                        <img
                          src={url}
                          alt={`preview-${index}`}
                          onLoad={() => URL.revokeObjectURL(url)}
                          className="cursor-pointer"
                        />
                        <button
                          onClick={() => {
                            removeFile(index)
                          }}
                        >
                          <X className="size-[28px]" />
                        </button>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
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
                  setFiles((prevFiles) => [...prevFiles, ...newFiles])
                }
              }}
              ref={fileInputRef}
              className="hidden"
            />
          </div>
        </div>
        <div className="flex justify-end gap-4">
          <ButtonWithIcon
            IconComponent={X}
            label="キャンセル"
            onClick={() => {
              console.log('back')
            }}
          />
          <ButtonWithIcon
            IconComponent={Check}
            label="登録"
            onClick={handlePostProduct}
          />
        </div>
        {errorMessages.length > 0 && (
          <ul>
            {errorMessages.map((errorMessage, index) => (
              <li key={index}>{errorMessage}</li>
            ))}
          </ul>
        )}
      </div>
      <footer className="absolute bottom-0 h-8 w-full"></footer>
    </div>
  )
}
