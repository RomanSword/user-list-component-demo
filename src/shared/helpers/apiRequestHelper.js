const apiRequestHelper = async ({
  method = 'GET',
  url = ''
}) => {
  const response = await fetch(url, { method })

  return response.json()
}

export default apiRequestHelper
