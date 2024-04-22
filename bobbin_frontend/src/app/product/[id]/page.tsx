'use client'

import { destroyProduct, getProduct } from '@/services/productService'
import type { Product } from '@/types/productTypes'
import type { Params } from '@/types/routeTypes'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function Product({ params }: { params: Params }) {
  const [product, setProduct] = useState<Product | undefined>()
  const [errorMessages, setErrorMessages] = useState<string[]>([])

  const router = useRouter()

  useEffect(() => {
    getProduct(params.id)
      .then((data) => {
        setProduct(data.product)
      })
      .catch((error) => {
        setErrorMessages(error.message.split(','))
      })
  }, [params.id])

  if (errorMessages.length > 0) {
    return (
      <ul>
        {errorMessages.map((errorMessage, index) => (
          <li key={index}>{errorMessage}</li>
        ))}
      </ul>
    )
  }

  if (!product) {
    return <p>loading...</p>
  }

  return (
    <div>
      <h1>製品詳細</h1>
      <div>{product.product_type}</div>
      <div>{product.customer_name}</div>
      <div>{product.product_number}</div>
      <div>{product.product_name}</div>
      <div>{product.user_name}</div>
      <div>{product.progress_status}</div>
      {product.file_urls &&
        product.file_urls.map((fileUrl) => {
          return <img src={fileUrl} alt={fileUrl} key={fileUrl} />
        })}
      <button
        onClick={() => {
          destroyProduct(params.id)
            .then(() => {
              router.push('/')
            })
            .catch((error) => {
              setErrorMessages(error.message.split(','))
            })
        }}
      >
        削除
      </button>
    </div>
  )
}
