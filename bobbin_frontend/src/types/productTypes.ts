export type Product = {
  id: number
  group_name: string
  product_type: string
  customer_name: string
  product_number: string
  product_name: string
  user_name: string
  progress_order: number
  progress_status: string
  files: File[] | []
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
  progress_order: number
  progress_status: string
}
export type ProgressesApiResponse = {
  progresses: ProgressApiResponse[]
}

type File = {
  id: number
  url: string
  content_type: string
}

export type FilterApiResponse = {
  id: number
  filter_name: string
  target_column: string
  target_value: string
}
export type FiltersApiResponse = {
  filters: FilterApiResponse[]
}
