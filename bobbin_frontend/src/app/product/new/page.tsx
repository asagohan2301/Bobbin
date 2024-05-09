'use client'

import ProductForm from '@/components/ProductForm'
import { postProduct } from '@/services/productService'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function New() {
  const [responseErrorMessages, setResponseErrorMessages] = useState<string[]>(
    [],
  )

  const router = useRouter()

  const handlePostProduct = async (
    groupId: number,
    productTypeId: number,
    customerId: number | null,
    productNumber: string,
    productName: string,
    userId: number | null,
    progressId: number,
    files: File[],
  ) => {
    try {
      const id = await postProduct(
        groupId,
        productTypeId,
        customerId,
        productNumber,
        productName,
        userId,
        progressId,
        files,
      )
      router.push(`/product/${id}`)
    } catch (error) {
      if (error instanceof Error) {
        setResponseErrorMessages(error.message.split(','))
      } else {
        setResponseErrorMessages(['登録に失敗しました'])
      }
    }
  }

  return (
    <ProductForm
      title="製品登録"
      submitButtonTitle="登録"
      submitButtonAction={handlePostProduct}
      responseErrorMessages={responseErrorMessages}
    />
  )
}
