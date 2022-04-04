import { AxiosError } from 'axios'

import { AlunaError } from '../../../lib/core/AlunaError'
import { handleExchangeRequestError } from '../../../utils/errors/handleExchangeRequestError'



export const poloniexInvalidApiKeyErrorPatterns: Array<RegExp | string> = [
  new RegExp(/Invalid API key\/secret pair|Permission denied/mi),
  'Trading has ended for Poloniex US customers',
  'this account is frozen for trading',
  'needs further verification',
]



export const poloniexDownErrorPatterns: Array<RegExp | string> = [
  // Add poloniex exchange down errors
]



export interface IHandlePoloniexRequestErrorsParams {
  error: AxiosError | Error
}



export const handlePoloniexRequestError = (
  params: IHandlePoloniexRequestErrorsParams,
): AlunaError => {

  const { error } = params

  let metadata: any = error
  let errorMessage: string | undefined
  let httpStatusCode: number | undefined

  if ((error as AxiosError).isAxiosError) {

    const { response } = error as AxiosError

    errorMessage = response?.data?.error || response?.data?.result?.error

    httpStatusCode = response?.status

    metadata = response?.data || metadata

  }

  const { alunaError } = handleExchangeRequestError({
    metadata,
    errorMessage,
    httpStatusCode,
    exchangeDownErrorPatterns: poloniexDownErrorPatterns,
    exchangeKeyInvalidErrorPatterns: poloniexInvalidApiKeyErrorPatterns,
  })

  return alunaError

}
