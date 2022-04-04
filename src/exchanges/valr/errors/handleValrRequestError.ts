import { AxiosError } from 'axios'

import { AlunaError } from '../../../lib/core/AlunaError'
import { handleExchangeRequestError } from '../../../utils/errors/handleExchangeRequestError'



export const valrInvalidApiKeyErrorPatterns: Array<RegExp | string> = [
  'API-key is invalid',
]



export const valrDownErrorPatterns: Array<RegExp | string> = [
  // Add valr exchange down errors
]



export interface IHandleValrRequestErrorsParams {
  error: AxiosError | Error
}



export const handleValrRequestError = (
  params: IHandleValrRequestErrorsParams,
): AlunaError => {

  const { error } = params

  let metadata: any = error
  let errorMessage: string | undefined
  let httpStatusCode: number | undefined

  if ((error as AxiosError).isAxiosError) {

    const { response } = error as AxiosError

    errorMessage = response?.data?.message

    httpStatusCode = response?.status

    metadata = response?.data || metadata

  }

  const { alunaError } = handleExchangeRequestError({
    metadata,
    errorMessage,
    httpStatusCode,
    exchangeDownErrorPatterns: valrDownErrorPatterns,
    exchangeKeyInvalidErrorPatterns: valrInvalidApiKeyErrorPatterns,
  })

  return alunaError

}
