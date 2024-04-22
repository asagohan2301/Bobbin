'use client'

import { getProducts } from '@/services/productService'
import type { Product } from '@/types/productTypes'
import { useEffect, useState } from 'react'

export default function Home() {
  const [products, setProducts] = useState<Product[]>([])
  const [errorMessages, setErrorMessages] = useState<string[]>([])

  useEffect(() => {
    getProducts()
      .then((data) => {
        setProducts(data.products)
      })
      .catch((error) => {
        setErrorMessages(error.message.split(','))
      })
  }, [])

  if (errorMessages.length > 0) {
    return (
      <ul>
        {errorMessages.map((errorMessage, index) => (
          <li key={index}>{errorMessage}</li>
        ))}
      </ul>
    )
  }

  if (products.length === 0) {
    return <p>loading...</p>
  }

  return (
    <div>
      <main>
        <h1>製品一覧</h1>
        <ul className="flex">
          <li>種別</li>
          <li>お客様名</li>
          <li>品番</li>
          <li>品名</li>
          <li>担当者</li>
          <li>進捗</li>
        </ul>
        <ul>
          {products.map((product) => {
            return (
              <li key={product.id} className="flex">
                <div>{product.product_type}</div>
                <div>{product.customer_name}</div>
                <div>{product.product_number}</div>
                <div>{product.product_name}</div>
                <div>{product.user_name}</div>
                <div>{product.progress_status}</div>
              </li>
            )
          })}
        </ul>
      </main>
    </div>
  )
}
