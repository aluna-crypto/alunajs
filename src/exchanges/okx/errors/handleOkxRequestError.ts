import { AxiosError } from 'axios'

import { AlunaError } from '../../../lib/core/AlunaError'
import { AlunaHttpErrorCodes } from '../../../lib/errors/AlunaHttpErrorCodes'
import { AlunaKeyErrorCodes } from '../../../lib/errors/AlunaKeyErrorCodes'



export interface IHandleokxRequestErrorsParams {
  error: AxiosError | Error
}

export interface IOkxInvalidCodeError {
  code: string
}

export const isInvalidApiKeyError = (
  params: IOkxInvalidCodeError,
): boolean => {

  const INVALID_KEY_CODE = '50111'

  return params.code === INVALID_KEY_CODE

}



export const handleOkxRequestError = (
  params: IHandleokxRequestErrorsParams,
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

    if (isInvalidApiKeyError({ code: response?.data?.code })) {

      code = AlunaKeyErrorCodes.INVALID

    }

  } else {

    message = error.message || message

  }

  const alunaError = new AlunaError({
    code,
    message,
    httpStatusCode,
    metadata,
  })

  return alunaError

}
