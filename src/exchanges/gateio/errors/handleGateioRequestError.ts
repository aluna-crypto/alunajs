import { AxiosError } from 'axios'
import { some } from 'lodash'

import { AlunaError } from '../../../lib/core/AlunaError'
import { AlunaHttpErrorCodes } from '../../../lib/errors/AlunaHttpErrorCodes'
import { AlunaKeyErrorCodes } from '../../../lib/errors/AlunaKeyErrorCodes'



export const gateioInvalidKeyPatterns: Array<string> = [
  'Signature mismatch',
  'Invalid key provided',
]



export const gateioDownErrorPatterns: Array<RegExp | string> = [
  // Add gateio exchange down errors
]



export const isGateioKeyInvalid = (errorMessage: string) => {

  return some(gateioInvalidKeyPatterns, (pattern) => {

    return new RegExp(pattern).test(errorMessage)

  })

}


export interface IHandlegateioRequestErrorsParams {
  error: AxiosError | Error
}



export const handleGateioRequestError = (
  params: IHandlegateioRequestErrorsParams,
): AlunaError => {

  const { error } = params

  let metadata: any = error

  let code = AlunaHttpErrorCodes.REQUEST_ERROR
  let message = 'Error while executing request.'
  let httpStatusCode = 500

  if ((error as AxiosError).isAxiosError) {

    const { response } = error as AxiosError

    message = response?.data?.message || message

    httpStatusCode = response?.status || httpStatusCode

    metadata = response?.data || metadata

  } else {

    message = error.message || message

  }

  if (isGateioKeyInvalid(message)) {

    code = AlunaKeyErrorCodes.INVALID

  }

  const alunaError = new AlunaError({
    code,
    metadata,
    message,
    httpStatusCode,
  })

  return alunaError

}
