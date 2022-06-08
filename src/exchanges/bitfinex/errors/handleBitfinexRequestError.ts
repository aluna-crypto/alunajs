import { AxiosError } from 'axios'
import { some } from 'lodash'

import { AlunaError } from '../../../lib/core/AlunaError'
import { AlunaHttpErrorCodes } from '../../../lib/errors/AlunaHttpErrorCodes'
import { AlunaKeyErrorCodes } from '../../../lib/errors/AlunaKeyErrorCodes'



export const bitfinexInvalidKeyPatterns: Array<RegExp> = [
  /(Invalid X-BFX-SIGNATURE|X-BFX-APIKEY)/mi,
  /apikey: (invalid|digest invalid)/mi,
  /AuthenticationError/mi,
  /Could not find a key matching the given X-BFX-APIKEY/mi,
  /accept the margin trading terms and conditions/mi,
  /does not have permission for this action/mi,
]



export const bitfinexDownErrorPatterns: Array<RegExp | string> = [
  // Add bitfinex exchange down errors
]


export const isBitfinexKeyInvalid = (errorMessage: string) => {

  return some(bitfinexInvalidKeyPatterns, (pattern) => {

    return pattern.test(errorMessage)

  })

}


export interface IHandleBitfinexRequestErrorsParams {
  error: AxiosError | Error
}



export const handleBitfinexRequestError = (
  params: IHandleBitfinexRequestErrorsParams,
): AlunaError => {

  const { error } = params

  let metadata: any = error

  let code = AlunaHttpErrorCodes.REQUEST_ERROR
  let message = 'Error while executing request.'
  let httpStatusCode = 500

  if ((error as AxiosError).isAxiosError) {

    const { response } = error as AxiosError

    httpStatusCode = response?.status || httpStatusCode

    metadata = response?.data || metadata

    message = response?.data?.[2] || message



  } else {

    message = error.message || message

  }


  if (isBitfinexKeyInvalid(message)) {

    code = AlunaKeyErrorCodes.INVALID
    httpStatusCode = 200

  }

  const alunaError = new AlunaError({
    metadata,
    message,
    httpStatusCode,
    code,
  })

  return alunaError

}
