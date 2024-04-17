'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

type Params = {
  id: string
}

export default function Product({ params }: { params: Params }) {
  const [productType, setProductType] = useState<string>('')
  const [customerName, setCustomerName] = useState<string>('')
  const [productNumber, setProductNumber] = useState<string>('')
  const [productName, setProductName] = useState<string>('')
  const [userName, setUserName] = useState<string>('')
  const [progressStatus, setProgressStatus] = useState<string>('')
  const [fileUrls, setFileUrls] = useState<string[]>([])

  const router = useRouter()

  const apiEndpoint = process.env.NEXT_PUBLIC_API_ENDPOINT

  useEffect(() => {
    fetch(`${apiEndpoint}/api/products/${params.id}`)
      .then((res) => {
        return res.json()
      })
      .then(({ product }) => {
        setProductType(product.product_type)
        setCustomerName(product.customer_name)
        setProductNumber(product.product_number)
        setProductName(product.product_name)
        setUserName(product.user_name)
        setProgressStatus(product.progress_status)
        setFileUrls(product.file_urls)
      })
  }, [])

  // destroyProduct
  const destroyProduct = async () => {
    const res = await fetch(`${apiEndpoint}/api/products/${params.id}`, {
      method: 'DELETE',
    })

    if (res.ok) {
      router.push('/')
    } else {
      const message = await res.json()
      console.log(message)
    }
  }

  return (
    <div>
      <h1>製品詳細</h1>
      <h2>{productType}</h2>
      <h2>{customerName}</h2>
      <h2>{productNumber}</h2>
      <h2>{productName}</h2>
      <h2>{userName}</h2>
      <h2>状態:{progressStatus}</h2>
      {fileUrls &&
        fileUrls.map((fileUrl, index) => {
          return <img src={fileUrl} alt="" key={index} />
        })}
      <button onClick={destroyProduct}>削除</button>
    </div>
  )
}
