import { AxiosError } from 'axios'
import { some } from 'lodash'

import { AlunaError } from '../../../lib/core/AlunaError'
import { AlunaHttpErrorCodes } from '../../../lib/errors/AlunaHttpErrorCodes'
import { AlunaKeyErrorCodes } from '../../../lib/errors/AlunaKeyErrorCodes'



export const okxInvalidKeyPatterns: Array<RegExp> = [
  /api-invalid/mi,
]



export const okxDownErrorPatterns: Array<RegExp | string> = [
  // Add okx exchange down errors
]


export const isOkxKeyInvalid = (errorMessage: string) => {

  return some(okxInvalidKeyPatterns, (pattern) => {

    return pattern.test(errorMessage)

  })

}


export interface IOkxErrorSchema {
  sCode: string
  sMsg: string
}

export interface IHandleOkxRequestErrorsParams {
  error: AxiosError | Error | IOkxErrorSchema
}

export const handleOkxRequestError = (
  params: IHandleOkxRequestErrorsParams,
): AlunaError => {

  const { error } = params

  let metadata: any = error

  let code = AlunaHttpErrorCodes.REQUEST_ERROR
  let message = 'Error while executing request.'
  let httpStatusCode = 500

  if ((error as AxiosError).isAxiosError) {

    const { response } = error as AxiosError

    message = response?.data?.sMsg || message

    httpStatusCode = response?.status || httpStatusCode

    metadata = response?.data || metadata

  } else if ((error as IOkxErrorSchema).sMsg) {

    const { sMsg } = error as IOkxErrorSchema

    message = sMsg

  } else {

    const { message: errorMsg } = error as Error

    message = errorMsg || message

  }


  if (isOkxKeyInvalid(message)) {

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
