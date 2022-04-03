import { AxiosError } from 'axios'

import { AlunaError } from '../../../lib/core/AlunaError'
import { handleExchangeRequestError } from '../../../utils/errors/handleExchangeRequestError'



export const binanceInvalidApiKeyErrorPatterns: Array<RegExp | string> = [
  /Invalid.+API-key|API-key.+invalid|Signature.+is not valid./mi,
]



export const binanceDownErrorPatterns: Array<RegExp | string> = [
  // Add binance exchange down errors
]



export interface IHandlebinanceRequestErrorsParams {
  error: AxiosError | Error
}



export const handleBinanceRequestError = (
  params: IHandlebinanceRequestErrorsParams,
): AlunaError => {

  const { error } = params

  let metadata: any = error
  let errorMessage: string | undefined
  let httpStatusCode: number | undefined

  if ((error as AxiosError).isAxiosError) {

    const { response } = error as AxiosError

    errorMessage = response?.data?.msg

    httpStatusCode = response?.status

    metadata = response?.data || metadata

  }

  const { alunaError } = handleExchangeRequestError({
    metadata,
    errorMessage,
    httpStatusCode,
    exchangeDownErrorPatterns: binanceDownErrorPatterns,
    exchangeKeyInvalidErrorPatterns: binanceInvalidApiKeyErrorPatterns,
  })

  return alunaError

}
