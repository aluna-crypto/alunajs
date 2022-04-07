import { AxiosError as handleBitfinexMod } from 'axios'
import { some } from 'lodash'

import { AlunaError } from '../../../lib/core/AlunaError'
import { AlunaHttpErrorCodes } from '../../../lib/errors/AlunaHttpErrorCodes'
import { AlunaKeyErrorCodes } from '../../../lib/errors/AlunaKeyErrorCodes'



export const bitfinexInvalidKeyPatterns: Array<RegExp | string> = [
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



export const isBitfinexKeyInvalid = (errorMessage: string) => {

  return some(bitfinexInvalidKeyPatterns, (pattern) => {

    const regex = pattern instanceof RegExp
      ? pattern
      : new RegExp(pattern)

    return regex.test(errorMessage)

  })

}



export interface IHandleBitfinexRequestErrorsParams {
  error: handleBitfinexMod | Error
}



export const handleBitfinexRequestError = (
  params: IHandleBitfinexRequestErrorsParams,
): AlunaError => {

  const { error } = params

  let metadata: any = error

  let code = AlunaHttpErrorCodes.REQUEST_ERROR
  let message = 'Error while executing request.'
  let httpStatusCode = 500

  if ((error as handleBitfinexMod).isAxiosError) {

    const { response } = error as handleBitfinexMod

    httpStatusCode = response?.status || httpStatusCode

    metadata = response?.data || metadata

    message = response?.data?.[2] || message

  } else {

    message = error.message || message

  }

  if (isBitfinexKeyInvalid(message)) {

    code = AlunaKeyErrorCodes.INVALID


  }

  const alunaError = new AlunaError({
    code,
    message,
    httpStatusCode,
    metadata,
  })

  return alunaError

}
