export type Product = {
  id: number
  group_name: string
  product_type_id: number
  product_type: string
  customer_id: number | null
  customer_name: string | null
  product_number: string
  product_name: string
  user_id: number | null
  user_name: string | null
  progress_id: number
  progress_order: number
  progress_status: string
  files: FileApiResponse[] | []
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

export type FileApiResponse = {
  id: number
  url: string
  name: string
  type: string
  size: number
}

export type PreviewFile = {
  url: string
  name: string
  type: string
  size: number
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
