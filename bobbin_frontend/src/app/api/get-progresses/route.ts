import getSelectOptions from '@/features/product/getSelectOptions'

export async function GET() {
  const data = await getSelectOptions('progresses')
  return Response.json(data)
}
