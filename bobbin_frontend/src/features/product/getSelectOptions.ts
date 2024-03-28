export default async function getSelectOptions(resource: string) {
  const apiEndpoint = process.env.API_ENDPOINT
  const res = await fetch(`${apiEndpoint}/api/${resource}`)
  return await res.json()
}
