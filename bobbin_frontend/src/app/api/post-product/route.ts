export async function POST(req: Request) {
  const apiEndpoint = process.env.API_ENDPOINT
  const reqData = await req.json()
  const res = await fetch(`${apiEndpoint}/api/products`, {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
    },
    body: JSON.stringify(reqData),
  })
  const resData = await res.json()
  return Response.json(resData)
}
