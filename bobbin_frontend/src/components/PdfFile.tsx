'use client'

import type { FileApiResponse } from '@/types/productTypes'
import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'react-bootstrap-icons'
import { Document, Page, pdfjs } from 'react-pdf'

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.js',
  import.meta.url,
).toString()

const options = {
  cMapUrl: `https://unpkg.com/pdfjs-dist@${pdfjs.version}/cmaps/`,
}

const apiEndpoint = process.env.NEXT_PUBLIC_API_ENDPOINT

type PdfFileProps = {
  file: FileApiResponse
  productId: string
  width: number
  isMain: boolean
}

export default function ImageFile(props: PdfFileProps) {
  const { file, productId, width, isMain } = props
  const [numPages, setNumPages] = useState<number>()
  const [pageNumber, setPageNumber] = useState<number>(1)

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }): void => {
    setNumPages(numPages)
  }

  return (
    <div>
      <div className="mb-1 border">
        <Document
          file={`${apiEndpoint}/api/products/${productId}/files/${file.id}/proxy`}
          options={options}
          onLoadSuccess={onDocumentLoadSuccess}
        >
          <Page
            width={width}
            renderTextLayer={false}
            renderAnnotationLayer={false}
            pageNumber={pageNumber}
          />
        </Document>
      </div>
      <p className="text-xs">{file.name}</p>
      {/* ページネーション */}
      {isMain && (
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
      )}
    </div>
  )
}
