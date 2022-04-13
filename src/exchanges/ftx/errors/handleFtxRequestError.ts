import { AxiosError } from 'axios'
import { some } from 'lodash'

import { AlunaError } from '../../../lib/core/AlunaError'
import { AlunaHttpErrorCodes } from '../../../lib/errors/AlunaHttpErrorCodes'
import { AlunaKeyErrorCodes } from '../../../lib/errors/AlunaKeyErrorCodes'
import { FtxLog } from '../FtxLog'



export const ftxNotLoggedInPatterns: Array<string> = [
  'Not logged in: Invalid signature',
  'Not logged in: Invalid API key',
  'Not logged in: Timestamp too far from current time',
]


export interface IHandleFtxRequestErrorsParams {
  error: AxiosError | Error
}

export const isFtxKeyInvalid = (errorMessage: string) => {

  return some(ftxNotLoggedInPatterns, (pattern) => {

    const regex = new RegExp(pattern)

    return regex.test(errorMessage)

  })

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

    message = response?.data?.error || message

    httpStatusCode = response?.status || httpStatusCode

    metadata = response?.data || metadata

    metadata = response?.data

  } else {

    message = error.message || message

  }

  if (isFtxKeyInvalid(message)) {

    code = AlunaKeyErrorCodes.INVALID

  }

  const alunaError = new AlunaError({
    code,
    message,
    httpStatusCode,
    metadata,
  })

  FtxLog.error(alunaError)

  return alunaError

}
