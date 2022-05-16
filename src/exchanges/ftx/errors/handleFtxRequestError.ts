import { AxiosError } from 'axios'
import { some } from 'lodash'

import { AlunaError } from '../../../lib/core/AlunaError'
import { AlunaHttpErrorCodes } from '../../../lib/errors/AlunaHttpErrorCodes'
import { AlunaKeyErrorCodes } from '../../../lib/errors/AlunaKeyErrorCodes'



export const ftxInvalidKeyPatterns: Array<RegExp> = [
  // TODO: Review exchange invalid api key error patterns
  /api-invalid/mi,
]



export const ftxDownErrorPatterns: Array<RegExp | string> = [
  // Add ftx exchange down errors
]


export const isFtxKeyInvalid = (errorMessage: string) => {

  return some(ftxInvalidKeyPatterns, (pattern) => {

    return pattern.test(errorMessage)

  })

}


export interface IHandleFtxRequestErrorsParams {
  error: AxiosError | Error
}



export const handleFtxRequestError = (
  params: IHandleFtxRequestErrorsParams,
): AlunaError => {

  const { error } = params

  let metadata: any = error

  let code = AlunaHttpErrorCodes.REQUEST_ERROR
  let message = 'Error while executing request.'
  let httpStatusCode = 500

  if ((error as AxiosError).isAxiosError) {

    const { response } = error as AxiosError

    // TODO: Review property `exchangeErroMsg` on request response
    message = response?.data?.exchangeErroMsg || message

    httpStatusCode = response?.status || httpStatusCode

    metadata = response?.data || metadata

  } else {

    message = error.message || message

  }


  if (isFtxKeyInvalid(message)) {

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
