import { AxiosError } from 'axios'

import { AlunaError } from '../../../lib/core/AlunaError'
import { handleExchangeRequestError } from '../../../utils/errors/handleExchangeRequestError'



export const bitmexInvalidApiKeyErrorPatterns: Array<RegExp | string> = [
  'Invalid API Key',
  'Signature not valid',
  'This key is disabled',
  'Your account has been disabled',
]



export const bitmexDownErrorPatterns: Array<RegExp | string> = [
  'downtime in progress',
  'down for maintenance',
]



export interface IHandleBitmexRequestErrorsParams {
  error: AxiosError | Error
}



export const handleBitmexRequestError = (
  params: IHandleBitmexRequestErrorsParams,
): AlunaError => {

  const { error } = params

  let metadata = error
  let errorMessage: string | undefined
  let httpStatusCode: number | undefined

  if ((error as AxiosError).isAxiosError) {

    const { response } = error as AxiosError

    errorMessage = response?.data?.error?.message

    httpStatusCode = response?.status

    metadata = response?.data || metadata

  }

  const { alunaError } = handleExchangeRequestError({
    metadata,
    errorMessage,
    httpStatusCode,
    exchangeDownErrorPatterns: bitmexDownErrorPatterns,
    exchangeKeyInvalidErrorPatterns: bitmexInvalidApiKeyErrorPatterns,
  })

  return alunaError

}