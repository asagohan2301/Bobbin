'use client'

import ProductForm from '@/components/ProductForm'
import {
  destroyProduct,
  getProduct,
  updateProduct,
} from '@/services/productService'
import type { Product } from '@/types/productTypes'
import type { Params } from '@/types/routeTypes'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function Edit({ params }: { params: Params }) {
  const [product, setProduct] = useState<Product | undefined>()
  const [productLoadErrorMessages, setProductLoadErrorMessages] = useState<
    string[]
  >([])
  const [responseErrorMessages, setResponseErrorMessages] = useState<string[]>(
    [],
  )

  useEffect(() => {
    getProduct(params.id)
      .then((data) => {
        setProduct(data.product)
      })
      .catch((error) => {
        setProductLoadErrorMessages(error.message.split(','))
      })
  }, [params.id])

  const router = useRouter()

  const handleUpdateProduct = async (
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
      const id = await updateProduct(
        params.id,
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
        setResponseErrorMessages(['編集に失敗しました'])
      }
    }
  }

  const handleDestroyProduct = async () => {
    try {
      await destroyProduct(params.id)
      router.push('/')
    } catch (error) {
      setResponseErrorMessages(['削除に失敗しました'])
    }
  }

  if (productLoadErrorMessages.length > 0) {
    return (
      <ul>
        {productLoadErrorMessages.map((errorMessage, index) => (
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
      <ProductForm
        title="登録情報修正"
        productId={product.id}
        currentProductTypeId={product.product_type_id}
        currentCustomerId={product.customer_id}
        currentProductNumber={product.product_number}
        currentProductName={product.product_name}
        currentUserId={product.user_id}
        currentProgressId={product.progress_id}
        currentExistingFiles={product.files}
        submitButtonTitle="編集内容を確定して保存"
        submitButtonAction={handleUpdateProduct}
        showDestroyButton={true}
        destroyButtonAction={handleDestroyProduct}
        responseErrorMessages={responseErrorMessages}
      />
    </div>
  )
}
