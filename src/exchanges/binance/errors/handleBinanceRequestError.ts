import { AxiosError } from 'axios'
import { some } from 'lodash'

import { AlunaError } from '../../../lib/core/AlunaError'
import { AlunaHttpErrorCodes } from '../../../lib/errors/AlunaHttpErrorCodes'
import { AlunaKeyErrorCodes } from '../../../lib/errors/AlunaKeyErrorCodes'



export const binanceInvalidKeyPatterns: Array<RegExp> = [
  new RegExp(/Invalid.+API-key|API-key.+invalid|Signature.+is not valid./mi),
]



export const binanceDownErrorPatterns: Array<RegExp | string> = [
  // Add binance exchange down errors
]


export const isBinanceKeyInvalid = (errorMessage: string) => {

  return some(binanceInvalidKeyPatterns, (pattern) => {

    return pattern.test(errorMessage)

  })

}


export interface IHandleBinanceRequestErrorsParams {
  error: AxiosError | Error
}



export const handleBinanceRequestError = (
  params: IHandleBinanceRequestErrorsParams,
): AlunaError => {

  const { error } = params

  let metadata: any = error

  let code = AlunaHttpErrorCodes.REQUEST_ERROR
  let message = 'Error while executing request.'
  let httpStatusCode = 500

  if ((error as AxiosError).isAxiosError) {

    const { response } = error as AxiosError

    message = response?.data?.msg || message

    httpStatusCode = response?.status || httpStatusCode

    metadata = response?.data || metadata

  } else {

    message = error.message || message

  }


  if (isBinanceKeyInvalid(message)) {

    code = AlunaKeyErrorCodes.INVALID

  }

  const alunaError = new AlunaError({
    metadata,
    message,
    httpStatusCode,
    code,
  })

  return alunaError

}
