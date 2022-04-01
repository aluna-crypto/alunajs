import { some } from 'lodash'

import { AlunaError } from '../../lib/core/AlunaError'
import { AlunaExchangeErrorCodes } from '../../lib/errors/AlunaExchangeErrorCodes'
import { AlunaHttpErrorCodes } from '../../lib/errors/AlunaHttpErrorCodes'
import { AlunaKeyErrorCodes } from '../../lib/errors/AlunaKeyErrorCodes'



export interface IHandleExchangeRequestErrorParams {
  metadata: any
  errorMessage?: string
  httpStatusCode: number
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
    errorMessage,
    httpStatusCode,
    exchangeDownErrorPatterns,
    exchangeKeyInvalidErrorPatterns,
  } = params


  let code = AlunaHttpErrorCodes.REQUEST_ERROR
  let message = errorMessage || 'Error while trying to execute Axios request'

  const keyInvalid = testRegexPatterns({
    message,
    patterns: exchangeKeyInvalidErrorPatterns,
  })

  if (keyInvalid) {

    code = AlunaKeyErrorCodes.INVALID
    message = 'Api key/secret is invalid'

  } else {

    const exchangeDown = testRegexPatterns({
      message,
      patterns: exchangeDownErrorPatterns,
    })

    if (exchangeDown) {

      code = AlunaExchangeErrorCodes.EXCHANGE_IS_DOWN
      message = 'Exchange is down'

    }

  }

  const alunaError = new AlunaError({
    code,
    message,
    httpStatusCode,
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
