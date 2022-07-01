import { AxiosError } from 'axios'
import { some } from 'lodash'

import { AlunaError } from '../../../lib/core/AlunaError'
import { AlunaHttpErrorCodes } from '../../../lib/errors/AlunaHttpErrorCodes'
import { AlunaKeyErrorCodes } from '../../../lib/errors/AlunaKeyErrorCodes'



export const huobiInvalidKeyPatterns: Array<RegExp> = [
  // TODO: Review exchange invalid api key error patterns
  new RegExp('unauthorized'),
]



export const huobiDownErrorPatterns: Array<RegExp | string> = [
  // Add huobi exchange down errors
]


export const isHuobiKeyInvalid = (errorMessage: string) => {

  return some(huobiInvalidKeyPatterns, (pattern) => {

    return pattern.test(errorMessage)

  })

}

export interface IHuobiErrorSchema {
  status: string
  'err-code': string
  'err-msg': string
}

export interface IHandleHuobiRequestErrorsParams {
  error: AxiosError | Error | IHuobiErrorSchema
}


export const handleHuobiRequestError = (
  params: IHandleHuobiRequestErrorsParams,
): AlunaError => {

  const { error } = params

  let metadata: any = error

  let code = AlunaHttpErrorCodes.REQUEST_ERROR
  let message = 'Error while executing request.'
  let httpStatusCode = 500

  if ((error as AxiosError).isAxiosError) {

    const { response } = error as AxiosError

    message = response?.data?.['err-msg'] || response?.data?.message || message

    httpStatusCode = response?.status || httpStatusCode

    metadata = response?.data || metadata

  } else if ((error as IHuobiErrorSchema)['err-msg']) {

    message = error['err-msg']

    metadata = error

  } else {

    const { message: errorMessage } = error as Error

    message = errorMessage || message

  }


  if (isHuobiKeyInvalid(message)) {

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
