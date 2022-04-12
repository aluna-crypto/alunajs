import { AxiosError } from 'axios'

import { AlunaError } from '../../../lib/core/AlunaError'
import { AlunaHttpErrorCodes } from '../../../lib/errors/AlunaHttpErrorCodes'
import { FtxLog } from '../FtxLog'



export interface IHandlebinanceRequestErrorsParams {
  error: AxiosError | Error
}

export const handleFtxRequestError = (
  params: IHandlebinanceRequestErrorsParams,
): AlunaError => {

  const { error } = params

  let metadata: any = error

  const code = AlunaHttpErrorCodes.REQUEST_ERROR
  let message = 'Error while executing request.'
  let httpStatusCode = 500

  if ((error as AxiosError).isAxiosError) {

    const { response } = error as AxiosError

    message = response?.data?.msg || message

    httpStatusCode = response?.status || httpStatusCode

    metadata = response?.data || metadata

  } else {

    message = error.message || message

  }

  FtxLog.error(error)


  const alunaError = new AlunaError({
    code,
    message,
    httpStatusCode,
    metadata,
  })

  return alunaError

}
