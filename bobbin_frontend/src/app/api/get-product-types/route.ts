import getSelectOptions from '@/features/product/getSelectOptions'

export async function GET() {
  const data = await getSelectOptions('product-types')
  return Response.json(data)
}
