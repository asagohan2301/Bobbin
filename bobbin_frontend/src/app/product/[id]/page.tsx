'use client'

import ButtonWithIcon from '@/components/ButtonWithIcon'
import UserInfo from '@/components/UserInfo'
import { getProduct } from '@/services/productService'
import type { Product } from '@/types/productTypes'
import type { Params } from '@/types/routeTypes'
import { useEffect, useState } from 'react'
import {
  ChevronLeft,
  FileEarmarkPlus,
  PencilSquare,
} from 'react-bootstrap-icons'

export default function Product({ params }: { params: Params }) {
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
    <div className="h-screen">
      <div className="mx-auto h-full max-w-[1440px] px-14 py-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl">{product.product_name}</h1>
            <h2 className="mb-2 text-xl">{product.product_number}</h2>
            <ul className="mb-2 flex gap-10">
              <li>
                <span className="text-sm">種別：</span>
                {product.product_type}
              </li>
              <li>
                <span className="text-sm">お客様名：</span>
                {product.customer_name}
              </li>
              <li>
                <span className="text-sm">担当者：</span>
                {product.user_name}
              </li>
              <li>
                <span className="text-sm">進捗：</span>
                {product.progress_status}
              </li>
            </ul>
          </div>
          <UserInfo />
        </div>
        <div className="mb-4 flex">
          {product.file_urls && (
            <>
              <div className="mr-3">
                <img src={product.file_urls[0]} alt="file-1" />
              </div>
              <div>
                {product.file_urls.slice(1).map((fileUrl, index) => {
                  return (
                    <img
                      width="200px"
                      src={fileUrl}
                      alt={`file-${index + 2}`}
                      className="mb-3"
                      key={fileUrl}
                    />
                  )
                })}
              </div>
            </>
          )}
        </div>
        <div className="flex justify-between">
          <ButtonWithIcon
            IconComponent={ChevronLeft}
            label="一覧ページへ"
            href="/"
          />
          <div className="flex gap-4">
            <ButtonWithIcon
              IconComponent={PencilSquare}
              label="編集"
              href={`/product/${product.id}/edit`}
            />
            <ButtonWithIcon
              IconComponent={FileEarmarkPlus}
              label="ファイル追加"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
