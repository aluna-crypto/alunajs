import { AxiosError } from 'axios'
import {
  each,
  isArray,
  some,
} from 'lodash'

import { AlunaError } from '../../../lib/core/AlunaError'
import { AlunaHttpErrorCodes } from '../../../lib/errors/AlunaHttpErrorCodes'
import { AlunaKeyErrorCodes } from '../../../lib/errors/AlunaKeyErrorCodes'



export const okxInvalidKeyPatterns: Array<RegExp> = [
  /Request header “OK_ACCESS_PASSPHRASE“ incorrect./mi,
  /Invalid OK-ACCESS-KEY/mi,
  /Invalid Sign/mi,
]

export const okxInvalidKeyCodes: Array<string> = [
  '50103',
  '50113',
]



export const okxDownErrorPatterns: Array<RegExp | string> = [
  // Add okx exchange down errors
]


export const isOkxKeyInvalid = (errorMessage: string, code?: string) => {

  const isInvalidRegex = some(okxInvalidKeyPatterns, (pattern) => {

    return pattern.test(errorMessage)

  })

  if (isInvalidRegex) {

    return true

  }

  if (code) {

    return some(okxInvalidKeyCodes, (sCode) => {

      return sCode === code

    })

  }

}


export interface IOkxErrorSchema {
  sCode: string
  code: string
  msg: string
  sMsg: string
}

export interface IHandleOkxRequestErrorsParams {
  error: AxiosError | Error | IOkxErrorSchema | IOkxErrorSchema[]
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

    message = response?.data?.msg || message

    httpStatusCode = response?.status || httpStatusCode

    metadata = response?.data || metadata

  } else if (isArray(error)) {

    message = ''

    each(error, (err) => {

      message = err.sMsg
        ? message.concat(`${err.sMsg}. `)
        : message

    })

  } else if ((error as IOkxErrorSchema).msg) {

    const { msg, sMsg } = error as IOkxErrorSchema

    message = sMsg || msg

  } else {

    const { message: errorMsg } = error as Error

    message = errorMsg || message

  }


  if (isOkxKeyInvalid(
    message,
    (error as IOkxErrorSchema).code
      || metadata.code
      || (error as IOkxErrorSchema).sCode,
  )) {

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
