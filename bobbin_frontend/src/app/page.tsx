'use client'

import { useEffect, useState } from 'react'

export default function Home() {
  type product = {
    id: number
    group_name: string
    product_type: string
    customer_name: string
    product_number: string
    product_name: string
    user_name: string
    progress_status: string
    file_urls: string[]
  }

  const apiEndpoint = process.env.NEXT_PUBLIC_API_ENDPOINT

  const [products, setProducts] = useState<product[]>([])

  useEffect(() => {
    fetch(`${apiEndpoint}/api/products`)
      .then((res) => {
        return res.json()
      })
      .then(({ products }) => {
        setProducts(products)
      })
  }, [])

  return (
    <div>
      <main>
        <div>tags</div>
        <div>titles</div>
        <ul>
          {products.map((product, index) => {
            return (
              <li key={index} className="flex">
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
