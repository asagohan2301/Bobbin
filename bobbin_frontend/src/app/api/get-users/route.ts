import getSelectOptions from '@/features/product/getSelectOptions'

export async function GET() {
  const data = await getSelectOptions('users')
  return Response.json(data)
}
