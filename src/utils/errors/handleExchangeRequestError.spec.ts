import { expect } from 'chai'

import { AlunaExchangeErrorCodes } from '../../lib/errors/AlunaExchangeErrorCodes'
import { AlunaHttpErrorCodes } from '../../lib/errors/AlunaHttpErrorCodes'
import { AlunaKeyErrorCodes } from '../../lib/errors/AlunaKeyErrorCodes'
import {
  handleExchangeRequestError,
  testRegexPatterns,
} from './handleExchangeRequestError'
import { mockTestRegexPatterns } from './handleExchangeRequestError.mock'



describe('handleExchangeRequestError', () => {

  it('should properly handle exchange request error for invalid key', () => {

    const { testRegexPatternsMock } = mockTestRegexPatterns(true)

    const httpStatusCode = 500
    const message = 'this api key was disabled'
    const exchangeKeyInvalidErrorPatterns = [message]

    const metadata = {
      errors: [
        message,
        httpStatusCode,
      ],
    }

    const { alunaError } = handleExchangeRequestError({
      metadata,
      errorMessage: message,
      httpStatusCode,
      exchangeDownErrorPatterns: [],
      exchangeKeyInvalidErrorPatterns,
    })

    const msg = 'Api key/secret is invalid'

    expect(alunaError.code).to.be.eq(AlunaKeyErrorCodes.INVALID)
    expect(alunaError.message).to.be.eq(msg)
    expect(alunaError.httpStatusCode).to.be.eq(httpStatusCode)
    expect(alunaError.metadata).to.deep.eq(metadata)

    expect(testRegexPatternsMock.callCount).to.be.eq(1)

    expect(testRegexPatternsMock.args[0][0]).to.deep.eq({
      message,
      patterns: exchangeKeyInvalidErrorPatterns,
    })

  })

  it('should properly handle exchange request error for exchange down', () => {

    const { testRegexPatternsMock } = mockTestRegexPatterns(false)

    testRegexPatternsMock.onCall(1).returns(true)

    const message = 'server is offline'
    const exchangeDownErrorPatterns = [message]


    const metadata = {
      error: {
        httpError: message,
      },
    }

    const { alunaError } = handleExchangeRequestError({
      metadata,
      errorMessage: message,
      exchangeDownErrorPatterns,
      exchangeKeyInvalidErrorPatterns: [],
    })

    const msg = 'Exchange is down'

    expect(alunaError.code).to.be.eq(AlunaExchangeErrorCodes.EXCHANGE_IS_DOWN)
    expect(alunaError.message).to.be.eq(msg)
    expect(alunaError.httpStatusCode).to.be.eq(400)
    expect(alunaError.metadata).to.deep.eq(metadata)

    expect(testRegexPatternsMock.callCount).to.be.eq(2)

    expect(testRegexPatternsMock.args[0][0]).to.deep.eq({
      message,
      patterns: [],
    })

    expect(testRegexPatternsMock.args[1][0]).to.deep.eq({
      message,
      patterns: exchangeDownErrorPatterns,
    })

  })

  it(
    'should add a request error default message if message is not available',
    () => {

      const { testRegexPatternsMock } = mockTestRegexPatterns(false)

      const httpStatusCode = 400

      const metadata = {
        error: [],
      }

      const { alunaError } = handleExchangeRequestError({
        metadata,
        httpStatusCode,
        exchangeDownErrorPatterns: [],
        exchangeKeyInvalidErrorPatterns: [],
      })

      const msg = 'Error while trying to execute Axios request'

      expect(alunaError.code).to.be.eq(AlunaHttpErrorCodes.REQUEST_ERROR)
      expect(alunaError.message).to.be.eq(msg)
      expect(alunaError.httpStatusCode).to.be.eq(httpStatusCode)
      expect(alunaError.metadata).to.deep.eq(metadata)

      expect(testRegexPatternsMock.callCount).to.be.eq(2)

    },
  )

  it('should properly test regex patterns for a given message', () => {

    const message = 'Paul is a software engineer.'
    let patterns: Array<RegExp | string> = ['paul']

    let result = testRegexPatterns({
      message,
      patterns,
    })

    expect(result).to.be.ok


    patterns = ['paul likes to take hikes']

    result = testRegexPatterns({
      message,
      patterns,
    })

    expect(result).not.to.be.ok


    patterns = [new RegExp(/\b(paul)\b/i)]

    result = testRegexPatterns({
      message,
      patterns,
    })

    expect(result).to.be.ok


    patterns = [new RegExp(/\b(pablo)\b/i)]

    result = testRegexPatterns({
      message,
      patterns,
    })

    expect(result).not.to.be.ok

  })

})
