import { AxiosError } from 'axios'
import { some } from 'lodash'

import { AlunaError } from '../../../lib/core/AlunaError'
import { AlunaHttpErrorCodes } from '../../../lib/errors/AlunaHttpErrorCodes'
import { AlunaKeyErrorCodes } from '../../../lib/errors/AlunaKeyErrorCodes'



export const valrInvalidKeyPatterns: Array<RegExp> = [
  new RegExp('API-key is invalid'),
  new RegExp('API key or secret is invalid'),
  new RegExp('Request has an invalid signature'),
]



export const valrDownErrorPatterns: Array<RegExp | string> = [
  // Add valr exchange down errors
]


export const isValrKeyInvalid = (errorMessage: string) => {

  return some(valrInvalidKeyPatterns, (pattern) => {

    return pattern.test(errorMessage)

  })

}


export interface IHandleValrRequestErrorsParams {
  error: AxiosError | Error
}



export const handleValrRequestError = (
  params: IHandleValrRequestErrorsParams,
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


  if (isValrKeyInvalid(message)) {

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
