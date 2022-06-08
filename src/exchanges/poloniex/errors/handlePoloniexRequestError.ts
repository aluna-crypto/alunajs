import { AxiosError } from 'axios'
import { some } from 'lodash'

import { AlunaError } from '../../../lib/core/AlunaError'
import { AlunaHttpErrorCodes } from '../../../lib/errors/AlunaHttpErrorCodes'
import { AlunaKeyErrorCodes } from '../../../lib/errors/AlunaKeyErrorCodes'



export const poloniexInvalidKeyPatterns: Array<RegExp | string> = [
  /Invalid API key\/secret pair|Permission denied/mi,
  'Trading has ended for Poloniex US customers',
  'this account is frozen for trading',
  'needs further verification',
]



export const poloniexDownErrorPatterns: Array<RegExp | string> = [
  // Add poloniex exchange down errors
]


export const isPoloniexKeyInvalid = (errorMessage: string) => {

  return some(poloniexInvalidKeyPatterns, (pattern) => {

    return new RegExp(pattern).test(errorMessage)

  })

}


export interface IHandlePoloniexRequestErrorsParams {
  error: AxiosError | Error
}



export const handlePoloniexRequestError = (
  params: IHandlePoloniexRequestErrorsParams,
): AlunaError => {

  const { error } = params

  let metadata: any = error

  let code = AlunaHttpErrorCodes.REQUEST_ERROR
  let message = 'Error while executing request.'
  let httpStatusCode = 500

  if ((error as AxiosError).isAxiosError) {

    const { response } = error as AxiosError

    message = response?.data?.error || response?.data?.result?.error || message

    httpStatusCode = response?.status || httpStatusCode

    metadata = response?.data || metadata

  } else {

    message = error.message || message

  }


  if (isPoloniexKeyInvalid(message)) {

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
