import { AxiosError } from 'axios'

import { AlunaError } from '../../../lib/core/AlunaError'
import { handleExchangeRequestError } from '../../../utils/errors/handleExchangeRequestError'



export const gateioInvalidApiKeyErrorPatterns: Array<RegExp | string> = [
  'Signature mismatch',
  'Invalid key provided',
]



export const gateioDownErrorPatterns: Array<RegExp | string> = [
  // Add gateio exchange down errors
]



export interface IHandlegateioRequestErrorsParams {
  error: AxiosError | Error
}



export const handleGateioRequestError = (
  params: IHandlegateioRequestErrorsParams,
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
    exchangeDownErrorPatterns: gateioDownErrorPatterns,
    exchangeKeyInvalidErrorPatterns: gateioInvalidApiKeyErrorPatterns,
  })

  return alunaError

}
