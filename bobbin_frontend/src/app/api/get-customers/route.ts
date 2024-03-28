import getSelectOptions from '@/features/product/getSelectOptions'

export async function GET() {
  const data = await getSelectOptions('customers')
  return Response.json(data)
}
