export type Product = {
  id: number
  group_name: string
  product_type: string
  customer_name: string
  product_number: string
  product_name: string
  user_name: string
  progress_status: string
  file_urls: string[]
}
export type ProductApiResponse = {
  product: Product
}
export type ProductsApiResponse = {
  products: Product[]
}

export type ProductTypeApiResponse = {
  id: number
  product_type: string
}
export type ProductTypesApiResponse = {
  product_types: ProductTypeApiResponse[]
}

export type CustomerApiResponse = {
  id: number
  customer_name: string
}
export type CustomersApiResponse = {
  customers: CustomerApiResponse[]
}

export type UserApiResponse = {
  id: number
  user_name: string
}
export type UsersApiResponse = {
  users: UserApiResponse[]
}

export type ProgressApiResponse = {
  id: number
  progress_status: string
}
export type ProgressesApiResponse = {
  progresses: ProgressApiResponse[]
}
