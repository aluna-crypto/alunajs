import { AxiosError } from 'axios'

import { AlunaError } from '../../../lib/core/AlunaError'
import { handleExchangeRequestError } from '../../../utils/errors/handleExchangeRequestError'



export const bitfinexInvalidApiKeyErrorPatterns: Array<RegExp | string> = [
  /(Invalid X-BFX-SIGNATURE|X-BFX-APIKEY)/mi,
  /apikey: (invalid|digest invalid)/mi,
  'AuthenticationError',
  'Could not find a key matching the given X-BFX-APIKEY',
  'accept the margin trading terms and conditions',
  'does not have permission for this action',
]



export const bitfinexDownErrorPatterns: Array<RegExp | string> = [
  // Add Bitfinex exchange down errors
]



export interface IHandleBitfinexRequestErrorsParams {
  error: AxiosError | Error
}



export const handleBitfinexRequestError = (
  params: IHandleBitfinexRequestErrorsParams,
): AlunaError => {

  const { error } = params

  let metadata: any = error
  let errorMessage: string | undefined
  let httpStatusCode: number | undefined

  if ((error as AxiosError).isAxiosError) {

    const { response } = error as AxiosError

    httpStatusCode = response?.status

    metadata = response?.data || metadata


    if (response?.request?.path.match(new RegExp(/v1/))) {

      errorMessage = response.data.message

    } else {

      errorMessage = response?.data?.[2]

    }

  }

  const { alunaError } = handleExchangeRequestError({
    metadata,
    errorMessage,
    httpStatusCode,
    exchangeDownErrorPatterns: bitfinexDownErrorPatterns,
    exchangeKeyInvalidErrorPatterns: bitfinexInvalidApiKeyErrorPatterns,
  })

  return alunaError

}
