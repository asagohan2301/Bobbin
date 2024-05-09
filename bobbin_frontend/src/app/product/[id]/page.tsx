'use client'

import ButtonWithIcon from '@/components/ButtonWithIcon'
import ImageFile from '@/components/ImageFile'
import PdfFile from '@/components/PdfFile'
import UserInfo from '@/components/UserInfo'
import { getProduct } from '@/services/productService'
import type { Product } from '@/types/productTypes'
import type { Params } from '@/types/routeTypes'
import { useEffect, useState } from 'react'
import { ChevronLeft, PencilSquare } from 'react-bootstrap-icons'

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
    <div>
      <div className="mx-auto max-w-[1440px] px-14 py-5">
        <div className="mb-10 flex items-center justify-between border-b border-gray-400">
          <div>
            <h1 className="text-2xl">{product.product_name}</h1>
            <h2 className="mb-2 text-xl">{product.product_number}</h2>
            <ul className="mb-2 flex gap-10">
              <li>
                <span className="text-sm">種別：</span>
                {product.product_type}
              </li>
              {product.customer_name && (
                <li>
                  <span className="text-sm">お客様名：</span>
                  {product.customer_name}
                </li>
              )}
              <li>
                <span className="text-sm">担当者：</span>
                {product.user_id
                  ? `${product.user_last_name} ${product.user_first_name}`
                  : '未定'}
              </li>
              <li>
                <span className="text-sm">進捗：</span>
                {product.progress_status}
              </li>
            </ul>
          </div>
          <UserInfo />
        </div>
        <div className="mb-4 flex items-start gap-8">
          {/* ファイル 1 枚目 */}
          {product.files.length > 0 &&
            (['image/jpeg', 'image/png', 'image/gif'].includes(
              product.files[0].type,
            ) ? (
              <ImageFile file={product.files[0]} width="max-w-[800px]" />
            ) : product.files[0].type === 'application/pdf' ? (
              <PdfFile
                file={product.files[0]}
                productId={params.id}
                width={700}
                isMain={true}
              />
            ) : null)}
          {/* ファイル 2 枚目以降 */}
          {product.files.length > 1 && (
            <div className="flex flex-wrap gap-x-2 gap-y-4">
              {product.files
                .slice(1)
                .map((file) =>
                  ['image/jpeg', 'image/png', 'image/gif'].includes(
                    file.type,
                  ) ? (
                    <ImageFile file={file} width="w-48" key={file.id} />
                  ) : file.type === 'application/pdf' ? (
                    <PdfFile
                      file={file}
                      productId={params.id}
                      width={200}
                      isMain={false}
                      key={file.id}
                    />
                  ) : null,
                )}
            </div>
          )}
        </div>
        <div className="flex justify-between">
          <ButtonWithIcon
            IconComponent={ChevronLeft}
            label="一覧ページへ"
            href="/"
            isRegular={true}
          />
          <div className="flex gap-4">
            <ButtonWithIcon
              IconComponent={PencilSquare}
              label="編集"
              href={`/product/${product.id}/edit`}
              isRegular={true}
            />
            {/* <ButtonWithIcon
              IconComponent={FileEarmarkPlus}
              label="ファイル追加"
            /> */}
          </div>
        </div>
      </div>
      <footer className="h-8 w-full"></footer>
    </div>
  )
}
