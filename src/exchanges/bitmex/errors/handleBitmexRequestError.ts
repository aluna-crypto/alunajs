import { AxiosError } from 'axios'
import { some } from 'lodash'

import { AlunaError } from '../../../lib/core/AlunaError'
import { AlunaExchangeErrorCodes } from '../../../lib/errors/AlunaExchangeErrorCodes'
import { AlunaHttpErrorCodes } from '../../../lib/errors/AlunaHttpErrorCodes'
import { AlunaKeyErrorCodes } from '../../../lib/errors/AlunaKeyErrorCodes'



export const bitmexInvalidKeyPatterns: Array<RegExp> = [
  /Invalid API Key/mi,
  /Signature not valid/mi,
  /This key is disabled/mi,
  /Your account has been disabled/mi,
]



export const bitmexDownErrorPatterns: Array<RegExp> = [
  /downtime in progress/mi,
  /down for maintenance/mi,
]



export const isBitmexKeyInvalid = (errorMessage: string) => {

  return some(bitmexInvalidKeyPatterns, (pattern) => {

    return pattern.test(errorMessage)

  })

}

export const isBitmexDown = (errorMessage: string) => {

  return some(bitmexDownErrorPatterns, (pattern) => {

    return pattern.test(errorMessage)

  })

}


export interface IHandleBitmexRequestErrorsParams {
  error: AxiosError | Error
}



export const handleBitmexRequestError = (
  params: IHandleBitmexRequestErrorsParams,
): AlunaError => {

  const { error } = params

  let metadata: any = error

  let code = AlunaHttpErrorCodes.REQUEST_ERROR
  let message = 'Error while executing request.'
  let httpStatusCode = 500

  if ((error as AxiosError).isAxiosError) {

    const { response } = error as AxiosError

    message = response?.data?.error?.message || message

    httpStatusCode = response?.status || httpStatusCode

    metadata = response?.data || metadata

  } else {

    message = error.message || message

  }


  if (isBitmexKeyInvalid(message)) {

    code = AlunaKeyErrorCodes.INVALID

  } else if (isBitmexDown(message)) {

    code = AlunaExchangeErrorCodes.EXCHANGE_IS_DOWN

  }

  const alunaError = new AlunaError({
    metadata,
    message,
    httpStatusCode,
    code,
  })

  return alunaError

}
