import type { ErrorsApiResponse } from '@/types/errorTypes'
import type {
  ProductApiResponse,
  ProductsApiResponse,
} from '@/types/productTypes'

const apiEndpoint = process.env.NEXT_PUBLIC_API_ENDPOINT

export const getProducts = async (): Promise<ProductsApiResponse> => {
  const res = await fetch(`${apiEndpoint}/api/products`)
  if (res.ok) {
    const data: ProductsApiResponse = await res.json()
    return data
  } else {
    throw new Error('製品一覧の取得に失敗しました')
  }
}

export const getProduct = async (id: string): Promise<ProductApiResponse> => {
  const res = await fetch(`${apiEndpoint}/api/products/${id}`)
  if (res.ok) {
    const data: ProductApiResponse = await res.json()
    return data
  } else {
    const data: ErrorsApiResponse = await res.json()
    throw new Error(data.errors.join(','))
  }
}

export const postProduct = async (
  groupId: number,
  productTypeId: number,
  customerId: number | null,
  productNumber: string,
  productName: string,
  userId: number | null,
  progressId: number | null,
  files: File[],
): Promise<string> => {
  const productFormData = makeFormData(
    groupId,
    productTypeId,
    customerId,
    productNumber,
    productName,
    userId,
    progressId,
    files,
  )

  const res = await fetch(`${apiEndpoint}/api/products`, {
    method: 'POST',
    body: productFormData,
  })
  if (res.ok) {
    const { id } = await res.json()
    return id
  } else {
    const data: ErrorsApiResponse = await res.json()
    throw new Error(data.errors.join(','))
  }
}

export const updateProduct = async (
  productId: string,
  groupId: number,
  productTypeId: number,
  customerId: number | null,
  productNumber: string,
  productName: string,
  userId: number | null,
  progressId: number | null,
  files: File[],
): Promise<string> => {
  const productFormData = makeFormData(
    groupId,
    productTypeId,
    customerId,
    productNumber,
    productName,
    userId,
    progressId,
    files,
  )

  const res = await fetch(`${apiEndpoint}/api/products/${productId}`, {
    method: 'PUT',
    body: productFormData,
  })
  if (res.ok) {
    const data = await res.json()
    return data.product.id
  } else {
    const data: ErrorsApiResponse = await res.json()
    throw new Error(data.errors.join(','))
  }
}

export const destroyProduct = async (id: string): Promise<boolean> => {
  const res = await fetch(`${apiEndpoint}/api/products/${id}`, {
    method: 'DELETE',
  })
  if (res.ok) {
    return true
  } else {
    const data: ErrorsApiResponse = await res.json()
    throw new Error(data.errors.join(','))
  }
}

export const getSelectOptions = async <T>(resource: string): Promise<T> => {
  const apiEndpoint = process.env.NEXT_PUBLIC_API_ENDPOINT
  const res = await fetch(`${apiEndpoint}/api/${resource}`)
  if (res.ok) {
    const data = (await res.json()) as T
    return data
  } else {
    throw new Error('データの取得に失敗しました')
  }
}

export const updateProgressStatus = async (
  productId: number,
  progressId: number,
): Promise<ProductApiResponse> => {
  const productFormData = new FormData()
  productFormData.append('progress_id', progressId.toString())
  const res = await fetch(`${apiEndpoint}/api/products/${productId}`, {
    method: 'PUT',
    body: productFormData,
  })
  if (res.ok) {
    const data: ProductApiResponse = await res.json()
    return data
  } else {
    throw new Error('進捗の更新に失敗しました')
  }
}

export const destroyFile = async (productId: number, fileId: number) => {
  const res = await fetch(
    `${apiEndpoint}/api/products/${productId}/files/${fileId}`,
    {
      method: 'DELETE',
    },
  )
  if (res.ok) {
    return true
  } else {
    const data: ErrorsApiResponse = await res.json()
    throw new Error(data.errors.join(','))
  }
}

const makeFormData = (
  groupId: number,
  productTypeId: number,
  customerId: number | null,
  productNumber: string,
  productName: string,
  userId: number | null,
  progressId: number | null,
  files: File[],
) => {
  const productFormData = new FormData()

  productFormData.append('group_id', groupId.toString())
  productFormData.append('product_type_id', productTypeId.toString())
  if (customerId === null) {
    productFormData.append('customer_id', 'null')
  } else {
    productFormData.append('customer_id', customerId.toString())
  }
  productFormData.append('product_number', productNumber)
  productFormData.append('product_name', productName)
  console.log(userId)
  if (userId === null) {
    productFormData.append('user_id', 'null')
  } else {
    productFormData.append('user_id', userId.toString())
  }
  progressId && productFormData.append('progress_id', progressId.toString())

  if (files.length > 0) {
    files.forEach((file) => {
      productFormData.append(`files[]`, file)
    })
  }

  return productFormData
}
