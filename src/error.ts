interface ErrorResponse {
  error: string
  error_description: string
  error_uri: string
}

export const isErrorResponse = (obj: any): obj is ErrorResponse =>
  obj !== null &&
  obj !== undefined &&
  typeof obj.error === 'string' &&
  typeof obj.error_description === 'string' &&
  typeof obj.error_uri === 'string'
