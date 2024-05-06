'use client'

import ButtonWithIcon from '@/components/ButtonWithIcon'
import UserInfo from '@/components/UserInfo'
import { getProduct } from '@/services/productService'
import type { Product } from '@/types/productTypes'
import type { Params } from '@/types/routeTypes'
import { useEffect, useState } from 'react'
import {
  ChevronLeft,
  ChevronRight,
  FileEarmarkPlus,
  PencilSquare,
} from 'react-bootstrap-icons'

import { Document, Page, pdfjs } from 'react-pdf'

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.js',
  import.meta.url,
).toString()

const options = {
  cMapUrl: `https://unpkg.com/pdfjs-dist@${pdfjs.version}/cmaps/`,
}

const apiEndpoint = process.env.NEXT_PUBLIC_API_ENDPOINT

export default function Product({ params }: { params: Params }) {
  const [product, setProduct] = useState<Product | undefined>()
  const [errorMessages, setErrorMessages] = useState<string[]>([])
  const [numPages, setNumPages] = useState<number>()
  const [pageNumber, setPageNumber] = useState<number>(1)

  useEffect(() => {
    getProduct(params.id)
      .then((data) => {
        setProduct(data.product)
      })
      .catch((error) => {
        setErrorMessages(error.message.split(','))
      })
  }, [params.id])

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }): void => {
    setNumPages(numPages)
  }

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
          {product.files.length > 0 && (
            <>
              {product.files.map((file, index) => {
                if (
                  ['image/jpeg', 'image/png', 'image/gif'].includes(file.type)
                ) {
                  return (
                    <div
                      className={`img-container ${index === 0 ? 'w-120 mr-2' : 'mb-2 w-60'}`}
                      key={file.id}
                    >
                      <img src={file.url} alt={`file-${file.id}`} />
                    </div>
                  )
                } else if (file.type === 'application/pdf') {
                  return (
                    <div key={file.id}>
                      <div className="mb-2 border-2 border-gray-400">
                        <Document
                          file={`${apiEndpoint}/api/products/${params.id}/files/${file.id}/proxy`}
                          options={options}
                          onLoadSuccess={onDocumentLoadSuccess}
                        >
                          <Page
                            width={400}
                            renderTextLayer={false}
                            renderAnnotationLayer={false}
                            pageNumber={pageNumber}
                          />
                        </Document>
                      </div>
                      <div className="flex justify-center gap-6">
                        <button
                          onClick={() => {
                            if (pageNumber === 1) {
                              return
                            }
                            setPageNumber((current) => current - 1)
                          }}
                        >
                          <ChevronLeft />
                        </button>
                        <p>{`${pageNumber} / ${numPages}`}</p>
                        <button
                          onClick={() => {
                            if (pageNumber === numPages) {
                              return
                            }
                            setPageNumber((current) => current + 1)
                          }}
                        >
                          <ChevronRight />
                        </button>
                      </div>
                    </div>
                  )
                }
              })}
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
