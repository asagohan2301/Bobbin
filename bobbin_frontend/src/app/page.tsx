'use client'

import { getProducts } from '@/services/productService'
import type { Product } from '@/types/productTypes'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import {
  ChevronDown,
  FileEarmarkPlus,
  PencilSquare,
  Search,
} from 'react-bootstrap-icons'

export default function Home() {
  const [products, setProducts] = useState<Product[]>([])
  const [errorMessages, setErrorMessages] = useState<string[]>([])

  const progressDoneNum = 2
  const progressNotDoneNum = 6

  useEffect(() => {
    getProducts()
      .then((data) => {
        setProducts(data.products)
      })
      .catch((error) => {
        setErrorMessages(error.message.split(','))
      })
  }, [])

  if (errorMessages.length > 0) {
    return (
      <ul>
        {errorMessages.map((errorMessage, index) => (
          <li key={index}>{errorMessage}</li>
        ))}
      </ul>
    )
  }

  if (products.length === 0) {
    return <p>loading...</p>
  }

  return (
    <div className="h-screen">
      <div className="mx-auto h-full max-w-[1440px] px-14 py-5">
        <h1 className="text-2xl">製品一覧</h1>
        <div className="mb-7 flex items-end justify-between">
          <div className="flex items-center gap-x-12">
            <ul className="flex gap-x-8 text-gray-400">
              <li className="relative cursor-pointer font-bold text-[#FFA471]">
                <div>すべて</div>
                <div className="absolute top-7 h-1.5 w-full bg-[#FFA471]"></div>
              </li>
              <li className="cursor-pointer">進行中</li>
              <li className="cursor-pointer">入荷済み</li>
              <li className="cursor-pointer">担当モデル</li>
            </ul>
            <div className="cursor-pointer">
              <PencilSquare className="size-[21px] text-gray-700" />
            </div>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2">
                <Search className="size-[19px] text-gray-500" />
              </div>
              <input
                type="text"
                placeholder="品番："
                className="rounded-3xl border-2 border-gray-300 py-1.5 pl-9"
              />
            </div>
          </div>
          <div>
            <div className="mb-1">ABC design</div>
            <div className="flex items-center">
              <Image
                src="/bobbin_icon.png"
                width={27}
                height={27}
                alt="bobbin-icon"
                className="mr-2"
              />
              <div className="mr-6 cursor-pointer">山田</div>
              <ChevronDown className="cursor-pointer" />
            </div>
          </div>
        </div>
        <main>
          <ul className="flex rounded-lg bg-[#EDEDED] py-3 pl-[24px] pr-[30px] text-sm font-semibold text-gray-500">
            <li className="flex-[4_4_0%]">種別</li>
            <li className="flex-[5_5_0%]">お客様名</li>
            <li className="flex-[5_5_0%]">品番</li>
            <li className="flex-[5_5_0%]">品名</li>
            <li className="flex-[4_4_0%]">担当者</li>
            <li className="flex-[5_5_0%]">進捗</li>
            <li className="flex-[3_3_0%]"></li>
          </ul>
          <ul className="custom-scrollbar h-[calc(100vh-180px-32px)] overflow-y-auto">
            {products.map((product) => {
              return (
                <li
                  key={product.id}
                  className="flex items-center border-b-2 border-gray-300 p-6"
                >
                  <div className="flex-[4_4_0%]">{product.product_type}</div>
                  <div className="flex-[5_5_0%]">{product.customer_name}</div>
                  <div className="flex-[5_5_0%]">{product.product_number}</div>
                  <div className="flex flex-[5_5_0%] items-center">
                    <div className="mr-2 size-[44px] rounded-full border-2 border-gray-400 bg-yellow-50"></div>
                    <div>{product.product_name}</div>
                  </div>
                  <div className="flex flex-[4_4_0%] items-center">
                    <Image
                      src="/bobbin_icon.png"
                      width={36}
                      height={36}
                      alt="bobbin-icon"
                      className="mr-2"
                    />
                    <div>{product.user_name}</div>
                  </div>
                  <div className="flex-[5_5_0%]">
                    <div className="mb-2 flex items-center">
                      <div className="mr-2">{product.progress_status}</div>
                      <ChevronDown className="cursor-pointer" />
                    </div>
                    <div className="flex">
                      {Array.from({ length: progressDoneNum }, (_, index) => (
                        <div
                          className="mr-1 size-4 bg-[#FFA471]"
                          key={index}
                        ></div>
                      ))}
                      {Array.from(
                        { length: progressNotDoneNum },
                        (_, index) => (
                          <div
                            className="mr-1 size-4 bg-[#FFE6CF]"
                            key={index}
                          ></div>
                        ),
                      )}
                    </div>
                  </div>
                  <div className="flex flex-[3_3_0%] cursor-pointer justify-end gap-x-4">
                    <PencilSquare className="size-[21px] text-gray-700" />
                    <FileEarmarkPlus className="size-[21px] text-gray-700" />
                  </div>
                </li>
              )
            })}
          </ul>
        </main>
      </div>
      <footer className="absolute bottom-0 h-8 w-full"></footer>
    </div>
  )
}
