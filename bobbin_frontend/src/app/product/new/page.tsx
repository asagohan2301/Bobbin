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
  const [productTypeId, setProductTypeId] = useState<number>()
  const [customers, setCustomers] = useState<Customer[]>([])
  const [customerId, setCustomerId] = useState<number>()
  const [productNumber, setProductNumber] = useState<string>('')
  const [productName, setProductName] = useState<string>('')
  const [users, setUsers] = useState<User[]>([])
  const [userId, setUserId] = useState<number>()
  const [progresses, setProgresses] = useState<Progress[]>([])
  const [progressId, setProgressId] = useState<number>()

  useEffect(() => {
    getSelectOptions('/api/get-product-types').then((resData) => {
      setProdoctTypes(resData.product_types)
    })
    getSelectOptions('/api/get-customers').then((resData) => {
      setCustomers(resData.customers)
    })
    getSelectOptions('/api/get-users').then((resData) => {
      setUsers(resData.users)
    })
    getSelectOptions('/api/get-progresses').then((resData) => {
      setProgresses(resData.progresses)
    })
  }, [])

  const getSelectOptions = async (endpoint: string) => {
    const res = await fetch(endpoint)
    const resData = await res.json()
    return resData
  }

  const test = () => {
    console.dir(productTypes)
  }

  const postProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const reqData = {
      product: {
        group_id: 1,
        product_type_id: productTypeId,
        customer_id: customerId,
        product_number: productNumber,
        product_name: productName,
        user_id: userId,
        progress_id: progressId,
        // document_path: 'test',
      },
    }
    const res = await fetch('/api/post-product', {
      method: 'POST',
      body: JSON.stringify(reqData),
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
              setProductTypeId(Number(e.target.value))
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
              setCustomerId(Number(e.target.value))
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
              setUserId(Number(e.target.value))
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
              setProgressId(Number(e.target.value))
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
        <button>登録</button>
      </form>
      <button onClick={test}>test用</button>
    </div>
  )
}
