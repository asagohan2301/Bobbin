'use client'

import ButtonWithIcon from '@/components/ButtonWithIcon'
import ProductForm from '@/components/ProductForm'
import { destroyProduct, getProduct } from '@/services/productService'
import type { Product } from '@/types/productTypes'
import type { Params } from '@/types/routeTypes'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Trash3 } from 'react-bootstrap-icons'

export default function Edit({ params }: { params: Params }) {
  const router = useRouter()
  const [product, setProduct] = useState<Product | undefined>()
  const [errorMessages, setErrorMessages] = useState<string[]>([])

  useEffect(() => {
    getProduct(params.id)
      .then((data) => {
        setProduct(data.product)
      })
      .catch((error) => {
        setErrorMessages(error.message.split(','))
      })
  }, [params.id])

  if (!product) {
    return <p>loading...</p>
  }

  return (
    <div>
      <ProductForm
        title="登録情報修正"
        currentProductType={product.product_type}
        currentCustomerName={product.customer_name}
        currentProductNumber={product.product_number}
        currentProductName={product.product_name}
        currentUserName={product.user_name}
        currentProgressStatus={product.progress_status}
      />
      <p>製品ID {params.id} の編集ページ</p>
      <ButtonWithIcon
        IconComponent={Trash3}
        label="削除"
        onClick={() => {
          destroyProduct(params.id)
            .then(() => {
              router.push('/')
            })
            .catch((error) => {
              setErrorMessages(error.message.split(','))
            })
        }}
      />
    </div>
  )
}
