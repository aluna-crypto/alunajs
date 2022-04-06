import { AxiosError } from 'axios'
import { some } from 'lodash'

import { AlunaError } from '../../../lib/core/AlunaError'
import { AlunaHttpErrorCodes } from '../../../lib/errors/AlunaHttpErrorCodes'
import { AlunaKeyErrorCodes } from '../../../lib/errors/AlunaKeyErrorCodes'



export const bittrexInvalidKeyPatterns: Array<RegExp> = [
  new RegExp(/INVALID_SIGNATURE|APIKEY_INVALID/mi),
]



export const bittrexDownErrorPatterns: Array<RegExp | string> = [
  // Add bittrex exchange down errors
]


export const isBittrexKeyInvalid = (errorMessage: string) => {

  return some(bittrexInvalidKeyPatterns, (pattern) => {

    return pattern.test(errorMessage)

  })

}


export interface IHandleBittrexRequestErrorsParams {
  error: AxiosError | Error
}



export const handleBittrexRequestError = (
  params: IHandleBittrexRequestErrorsParams,
): AlunaError => {

  const { error } = params

  let metadata: any = error

  let code = AlunaHttpErrorCodes.REQUEST_ERROR
  let message = 'Error while executing request.'
  let httpStatusCode = 500

  if ((error as AxiosError).isAxiosError) {

    const { response } = error as AxiosError

    message = response?.data?.code || message

    httpStatusCode = response?.status || httpStatusCode

    metadata = response?.data || metadata

  } else {

    message = error.message || message

  }


  if (isBittrexKeyInvalid(message)) {

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
