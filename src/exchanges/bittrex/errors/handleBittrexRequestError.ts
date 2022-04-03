import { AxiosError } from 'axios'

import { AlunaError } from '../../../lib/core/AlunaError'
import { handleExchangeRequestError } from '../../../utils/errors/handleExchangeRequestError'



export const bittrexInvalidApiKeyErrorPatterns: Array<RegExp | string> = [
  new RegExp(/INVALID_SIGNATURE|APIKEY_INVALID/mi),
]



export const bittrexDownErrorPatterns: Array<RegExp | string> = [
  // Add bittrex exchange down errors
]



export interface IHandleBittrexRequestErrorsParams {
  error: AxiosError | Error
}



export const handleBittrexRequestError = (
  params: IHandleBittrexRequestErrorsParams,
): AlunaError => {

  const { error } = params

  let metadata: any = error
  let errorMessage: string | undefined
  let httpStatusCode: number | undefined

  if ((error as AxiosError).isAxiosError) {

    const { response } = error as AxiosError

    errorMessage = response?.data?.message

    httpStatusCode = response?.status

    metadata = response?.data || metadata

  }

  const { alunaError } = handleExchangeRequestError({
    metadata,
    errorMessage,
    httpStatusCode,
    exchangeDownErrorPatterns: bittrexDownErrorPatterns,
    exchangeKeyInvalidErrorPatterns: bittrexInvalidApiKeyErrorPatterns,
  })

  return alunaError

}
