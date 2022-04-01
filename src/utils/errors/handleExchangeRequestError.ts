import { some } from 'lodash'

import { AlunaError } from '../../lib/core/AlunaError'
import { AlunaExchangeErrorCodes } from '../../lib/errors/AlunaExchangeErrorCodes'
import { AlunaHttpErrorCodes } from '../../lib/errors/AlunaHttpErrorCodes'
import { AlunaKeyErrorCodes } from '../../lib/errors/AlunaKeyErrorCodes'



export interface IHandleExchangeRequestErrorParams {
  metadata: any
  errorMessage?: string
  httpStatusCode?: number
  exchangeDownErrorPatterns: Array<string | RegExp>
  exchangeKeyInvalidErrorPatterns: Array<string | RegExp>
}



export interface IHandleExchangeRequestErrorReturns {
  alunaError: AlunaError
}



export const handleExchangeRequestError = (
  params: IHandleExchangeRequestErrorParams,
): IHandleExchangeRequestErrorReturns => {

  const {
    metadata,
    httpStatusCode = 400,
    exchangeDownErrorPatterns,
    exchangeKeyInvalidErrorPatterns,
  } = params

  let {
    errorMessage = 'Error while trying to execute Axios request',
  } = params


  let code = AlunaHttpErrorCodes.REQUEST_ERROR

  const keyInvalid = testRegexPatterns({
    message: errorMessage,
    patterns: exchangeKeyInvalidErrorPatterns,
  })

  if (keyInvalid) {

    code = AlunaKeyErrorCodes.INVALID
    errorMessage = 'Api key/secret is invalid'

  } else {

    const exchangeDown = testRegexPatterns({
      message: errorMessage,
      patterns: exchangeDownErrorPatterns,
    })

    if (exchangeDown) {

      code = AlunaExchangeErrorCodes.EXCHANGE_IS_DOWN
      errorMessage = 'Exchange is down'

    }

  }

  const alunaError = new AlunaError({
    code,
    httpStatusCode,
    message: errorMessage,
    metadata,
  })

  return { alunaError }

}



export interface ITestRegexPatternsParams {
  message: string
  patterns: Array<string | RegExp>
}



export const testRegexPatterns = (
  params: ITestRegexPatternsParams,
): boolean => {

  const {
    message,
    patterns,
  } = params

  return some(patterns, (pattern) => {

    const regexp = pattern instanceof RegExp
      ? pattern
      : new RegExp(pattern, 'mi')

    return regexp.test(message)

  })

}
