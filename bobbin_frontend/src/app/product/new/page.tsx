'use client'

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
import { useEffect, useState } from 'react'

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
  const [errorMessages, setErrorMessages] = useState<string[]>([])

  const router = useRouter()

  useEffect(() => {
    handleGetSelectOptions()
  }, [])

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
    <div>
      <h1>製品登録</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          handlePostProduct()
        }}
      >
        <div>
          <label htmlFor="productType">種別</label>
          <select
            id="productType"
            onChange={(e) => {
              setProductTypeId(parseInt(e.target.value))
            }}
          >
            <option>選択してください</option>
            {productTypes.map((productType) => {
              return (
                <option value={productType.id} key={productType.id}>
                  {productType.product_type}
                </option>
              )
            })}
          </select>
        </div>
        <div>
          <label htmlFor="customer">お客様名</label>
          <select
            id="customer"
            onChange={(e) => {
              setCustomerId(parseInt(e.target.value))
            }}
            disabled={productTypeId === 1}
          >
            <option>選択してください</option>
            {customers.map((customer) => {
              return (
                <option value={customer.id} key={customer.id}>
                  {customer.customer_name}
                </option>
              )
            })}
          </select>
        </div>
        <div>
          <label htmlFor="productNumber">品番</label>
          <input
            type="text"
            id="productNumber"
            onChange={(e) => {
              setProductNumber(e.target.value)
            }}
          />
        </div>
        <div>
          <label htmlFor="productName">品名</label>
          <input
            type="text"
            id="productName"
            onChange={(e) => {
              setProductName(e.target.value)
            }}
          />
        </div>
        <div>
          <label htmlFor="user">担当者</label>
          <select
            id="user"
            onChange={(e) => {
              setUserId(parseInt(e.target.value))
            }}
          >
            <option>未定</option>
            {users.map((user) => {
              return (
                <option value={user.id} key={user.id}>
                  {user.user_name}
                </option>
              )
            })}
          </select>
        </div>
        <div>
          <label htmlFor="progress">進捗</label>
          <select
            id="progress"
            onChange={(e) => {
              setProgressId(parseInt(e.target.value))
            }}
          >
            <option>未定</option>
            {progresses.map((progress) => {
              return (
                <option value={progress.id} key={progress.id}>
                  {`${progress.progress_order}: ${progress.progress_status}`}
                </option>
              )
            })}
          </select>
        </div>
        <input
          type="file"
          multiple
          onChange={(e) => {
            if (e.target.files) {
              setFiles(Array.from(e.target.files))
            }
          }}
        />
        <button>登録</button>
      </form>
      {errorMessages.length > 0 && (
        <ul>
          {errorMessages.map((errorMessage, index) => (
            <li key={index}>{errorMessage}</li>
          ))}
        </ul>
      )}
    </div>
  )
}
