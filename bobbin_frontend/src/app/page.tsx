'use client'

import ButtonWithIcon from '@/components/ButtonWithIcon'
import UserInfo from '@/components/UserInfo'
import {
  getProducts,
  getSelectOptions,
  updateProgressStatus,
} from '@/services/productService'
import type {
  FilterApiResponse,
  FiltersApiResponse,
  Product,
  ProgressApiResponse,
  ProgressesApiResponse,
} from '@/types/productTypes'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import {
  ChevronDown,
  ChevronRight,
  PencilSquare,
  PlusLg,
  X,
} from 'react-bootstrap-icons'

export default function Home() {
  const [products, setProducts] = useState<Product[]>([])
  const [errorMessages, setErrorMessages] = useState<string[]>([])
  const [hoveredProductId, setHoveredProductId] = useState<number | null>(null)
  const [clickedProductId, setClickedProductId] = useState<number | null>(null)
  const [progresses, setProgresses] = useState<ProgressApiResponse[]>([])
  const [filters, setFilters] = useState<FilterApiResponse[]>([])
  const [filterName, setFilterName] = useState<string>('すべて')

  useEffect(() => {
    getProducts()
      .then((data) => {
        setProducts(data.products)
      })
      .catch((error) => {
        setErrorMessages(error.message.split(','))
      })

    getProgressData()
    getFilterData()
  }, [])

  const filteredProducts = products.filter((product) => {
    if (filterName === 'すべて') {
      return true
    }

    const currentFilter = filters.find((filter) => {
      return filter.filter_name === filterName
    })
    if (!currentFilter) {
      return true
    } else {
      return (
        product[currentFilter.target_column as keyof Product] ===
        currentFilter.target_value
      )
    }
  })

  const getProgressData = async () => {
    const progressData =
      await getSelectOptions<ProgressesApiResponse>('progresses')
    setProgresses(progressData.progresses)
  }

  const getFilterData = async () => {
    const filterData = await getSelectOptions<FiltersApiResponse>('filters')
    setFilters(filterData.filters)
  }

  const handleUpdateProgressStatus = async (
    productId: number,
    progressId: number,
  ) => {
    updateProgressStatus(productId, progressId)
      .then((data) => {
        const updatedProductData = data.product
        const updatedProducts = products.map((product) =>
          updatedProductData.id === product.id
            ? { ...product, ...updatedProductData }
            : product,
        )
        setProducts(updatedProducts)
      })
      .catch((error) => {
        console.log(error.message)
      })
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
              <li
                className={
                  filterName === 'すべて'
                    ? 'relative cursor-pointer font-bold text-[#FFA471]'
                    : 'cursor-pointer'
                }
                onClick={() => {
                  setFilterName('すべて')
                }}
              >
                <p>すべて</p>
                {filterName === 'すべて' && (
                  <div className="absolute top-7 h-1.5 w-full bg-[#FFA471]"></div>
                )}
              </li>
              {filters.map((filter) => {
                return (
                  <li
                    key={filter.id}
                    className={
                      filterName === filter.filter_name
                        ? 'relative cursor-pointer font-bold text-[#FFA471]'
                        : 'cursor-pointer'
                    }
                    onClick={() => {
                      setFilterName(filter.filter_name)
                    }}
                  >
                    <p>{filter.filter_name}</p>
                    {filterName === filter.filter_name && (
                      <div className="absolute top-7 h-1.5 w-full bg-[#FFA471]"></div>
                    )}
                  </li>
                )
              })}
            </ul>
            {/* <div className="cursor-pointer">
              <PencilSquare className="size-[21px] text-gray-700" />
            </div> */}
            {/* <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2">
                <Search className="size-[19px] text-gray-500" />
              </div>
              <input
                type="text"
                placeholder="品番："
                className="rounded-3xl border-2 border-gray-300 py-1.5 pl-9"
              />
            </div> */}
          </div>
          <div className="flex items-end gap-12">
            <ButtonWithIcon
              IconComponent={PlusLg}
              label="製品登録"
              href="product/new"
              isRegular={true}
            />
            <UserInfo />
          </div>
        </div>
        <main>
          <ul className="flex rounded-lg bg-[#EDEDED] py-3 pl-[24px] pr-[30px] text-sm font-semibold text-gray-500">
            <li className="flex-[5_5_0%]">品名</li>
            <li className="flex-[4_4_0%]">品番</li>
            <li className="flex-[3_3_0%]">種別</li>
            <li className="flex-[3_3_0%]">お客様名</li>
            <li className="flex-[3_3_0%]">担当者</li>
            <li className="flex-[4_4_0%]">進捗</li>
            <li className="flex-[3_3_0%]"></li>
          </ul>
          <ul className="custom-scrollbar h-[calc(100vh-180px-32px)] overflow-y-auto">
            {filteredProducts.map((product) => {
              const isHoverd = product.id === hoveredProductId
              const isClicked = product.id === clickedProductId
              return (
                <li
                  key={product.id}
                  onMouseEnter={() => {
                    setHoveredProductId(product.id)
                  }}
                  onMouseLeave={() => {
                    setHoveredProductId(null)
                  }}
                  className={`box-border flex items-center border-b border-gray-400 p-6 transition ${isHoverd ? 'bg-[#FFF6ED]' : ''}`}
                >
                  <div className="flex-[5_5_0%] ">
                    <Link
                      href={`/product/${product.id}`}
                      className="flex items-center"
                    >
                      <div className="mr-2 size-[44px] rounded-full border border-gray-400 bg-yellow-50"></div>
                      <div className={isHoverd ? 'underline' : ''}>
                        {product.product_name}
                      </div>
                    </Link>
                  </div>
                  <div className="flex-[4_4_0%]">{product.product_number}</div>
                  <div className="flex-[3_3_0%]">{product.product_type}</div>
                  <div className="flex-[3_3_0%]">
                    {product.customer_name ? product.customer_name : '-'}
                  </div>
                  {product.user_id ? (
                    <div className="flex flex-[3_3_0%] items-center">
                      <Image
                        src="/bobbin_icon.png"
                        width={36}
                        height={36}
                        alt="bobbin-icon"
                        className="mr-2"
                      />
                      <div>{`${product.user_last_name} ${product.user_first_name}`}</div>
                    </div>
                  ) : (
                    <div className="flex-[3_3_0%]">未定</div>
                  )}
                  <div className="relative flex-[4_4_0%]">
                    <div
                      className="mb-2 flex cursor-pointer items-center"
                      onClick={() => {
                        setClickedProductId(product.id)
                      }}
                    >
                      <div className="mr-2 text-sm">
                        {`${product.progress_order}: ${product.progress_status}`}
                      </div>
                      <ChevronDown />
                    </div>
                    <div
                      className="flex"
                      onClick={(e) => {
                        e.preventDefault()
                      }}
                    >
                      {Array.from(
                        { length: product.progress_order },
                        (_, index) => (
                          <div
                            className="mr-1 size-4 bg-[#FFA471]"
                            key={index}
                          ></div>
                        ),
                      )}
                      {Array.from(
                        { length: 5 - product.progress_order },
                        (_, index) => (
                          <div
                            className="mr-1 size-4 bg-[#FFE6CF]"
                            key={index}
                          ></div>
                        ),
                      )}
                    </div>
                    <div
                      className={
                        isClicked
                          ? 'absolute top-0 z-10 block rounded-lg border border-gray-400 bg-white px-4 pb-2 pt-6 text-sm'
                          : 'hidden'
                      }
                    >
                      <div className="absolute right-2 top-2">
                        <X
                          className="align-right mb-2 size-[24px] cursor-pointer "
                          onClick={() => {
                            setClickedProductId(null)
                          }}
                        />
                      </div>
                      <ul>
                        {progresses.map((progress) => {
                          return (
                            <li
                              key={progress.id}
                              className="my-2 cursor-pointer"
                              onClick={(e) => {
                                e.stopPropagation()
                                e.preventDefault()
                                handleUpdateProgressStatus(
                                  product.id,
                                  progress.id,
                                )
                                setClickedProductId(null)
                              }}
                            >
                              {`${progress.progress_order}: ${progress.progress_status}`}
                            </li>
                          )
                        })}
                      </ul>
                    </div>
                  </div>
                  <div className="flex flex-[3_3_0%] justify-end gap-x-6">
                    <div className="hover-info-wrapper relative">
                      <Link href={`/product/${product.id}/edit`}>
                        <PencilSquare className="size-[21px] text-gray-700" />
                      </Link>
                      <div className="hover-info absolute -top-7 left-1/2 hidden w-[44px] -translate-x-1/2 rounded-lg border border-gray-400 bg-white p-1 text-center text-xs">
                        編集
                      </div>
                    </div>
                    <div className="hover-info-wrapper relative">
                      <Link href={`/product/${product.id}`}>
                        <ChevronRight className="size-[21px] text-gray-700" />
                      </Link>
                      <div className="hover-info absolute -top-7 left-1/2 hidden w-[44px] -translate-x-1/2 rounded-lg border border-gray-400 bg-white p-1 text-center text-xs">
                        詳細
                      </div>
                    </div>
                    {/* <FileEarmarkPlus className="size-[21px] cursor-pointer text-gray-700" /> */}
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
