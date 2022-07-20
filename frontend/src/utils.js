export function extractErrorMessage(error) {
  return error.response?.data?.message || error.message || error.toString()
}
