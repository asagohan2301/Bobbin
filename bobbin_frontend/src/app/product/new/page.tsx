'use client'

import { useEffect, useState } from 'react'

export default function New() {
  type ProductType = {
    id: number
    product_type: string
  }
  type Customer = {
    id: number
    customer_name: string
  }
  type User = {
    id: number
    user_name: string
  }
  type Progress = {
    id: number
    progress_status: string
  }

  const [productTypes, setProdoctTypes] = useState<ProductType[]>([])
  const [productTypeId, setProductTypeId] = useState<string>('')
  const [customers, setCustomers] = useState<Customer[]>([])
  const [customerId, setCustomerId] = useState<string>('')
  const [productNumber, setProductNumber] = useState<string>('')
  const [productName, setProductName] = useState<string>('')
  const [users, setUsers] = useState<User[]>([])
  const [userId, setUserId] = useState<string>('')
  const [progresses, setProgresses] = useState<Progress[]>([])
  const [progressId, setProgressId] = useState<string>('')

  const [images, setImages] = useState<File[]>([])

  useEffect(() => {
    getSelectOptions('/api/get-product-types').then((resData) => {
      setProdoctTypes(resData.product_types)
      setProductTypeId(resData.product_types[0].id)
    })
    getSelectOptions('/api/get-customers').then((resData) => {
      setCustomers(resData.customers)
      setCustomerId(resData.customers[0].id)
    })
    getSelectOptions('/api/get-users').then((resData) => {
      setUsers(resData.users)
      setUserId(resData.users[0].id)
    })
    getSelectOptions('/api/get-progresses').then((resData) => {
      setProgresses(resData.progresses)
      setProgressId(resData.progresses[0].id)
    })
  }, [])

  const getSelectOptions = async (endpoint: string) => {
    const res = await fetch(endpoint)
    const resData = await res.json()
    return resData
  }

  // テスト用
  const test = () => {}

  // postProduct
  const postProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const product = new FormData()

    product.append('group_id', '1')
    product.append('product_type_id', productTypeId)
    product.append('customer_id', customerId)
    product.append('product_number', productNumber)
    product.append('product_name', productName)
    product.append('user_id', userId)
    product.append('progress_id', progressId)

    images.forEach((image) => {
      product.append(`images[]`, image)
    })

    // 確認用
    for (const [key, value] of product.entries()) {
      console.log(`${key}: ${value}`)
    }

    const res = await fetch('http://localhost:3001/api/products', {
      method: 'POST',
      body: product,
    })
    const resData = await res.json()
    console.log(resData)
  }

  return (
    <div>
      <h1 className="text-[20px]">製品登録</h1>
      <form onSubmit={postProduct}>
        <div>
          <label htmlFor="productType">種別</label>
          <select
            id="productType"
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
              setProductTypeId(e.target.value)
            }}
          >
            {productTypes.map((productType, index) => {
              return (
                <option value={productType.id} key={index}>
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
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
              setCustomerId(e.target.value)
            }}
          >
            {customers.map((customer, index) => {
              return (
                <option value={customer.id} key={index}>
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
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setProductNumber(e.target.value)
            }}
          />
        </div>
        <div>
          <label htmlFor="productName">品名</label>
          <input
            type="text"
            id="productName"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setProductName(e.target.value)
            }}
          />
        </div>
        <div>
          <label htmlFor="user">担当者</label>
          <select
            id="user"
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
              setUserId(e.target.value)
            }}
          >
            {users.map((user, index) => {
              return (
                <option value={user.id} key={index}>
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
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
              setProgressId(e.target.value)
            }}
          >
            {progresses.map((progress, index) => {
              return (
                <option value={progress.id} key={index}>
                  {progress.progress_status}
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
              setImages(Array.from(e.target.files))
            }
          }}
        />
        <button>登録</button>
      </form>
      <button onClick={test}>test用</button>
    </div>
  )
}
