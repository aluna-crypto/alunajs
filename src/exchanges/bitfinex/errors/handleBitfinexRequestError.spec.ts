import { AxiosError } from 'axios'
import { expect } from 'chai'
import {
  each,
  filter,
  random,
} from 'lodash'

import { AlunaError } from '../../../lib/core/AlunaError'
import { AlunaKeyErrorCodes } from '../../../lib/errors/AlunaKeyErrorCodes'
import { EXCHANGE_INVALID_KEY_ERROR_MESSAGE } from '../../../utils/errors/handleExchangeRequestError'
import { mockHandleExchangeRequestError } from '../../../utils/errors/handleExchangeRequestError.mock'
import {
  bitfinexDownErrorPatterns,
  bitfinexInvalidApiKeyErrorPatterns,
  handleBitfinexRequestError,
} from './handleBitfinexRequestError'



describe('handleBitfinexRequestError', () => {

  it('should properly handle Bitfinex request error', () => {

    const { handleExchangeRequestErrorMock } = mockHandleExchangeRequestError()

    const dummyError = 'dummy-error'

    const axiosError1 = {
      isAxiosError: true,
      response: {
        request: {
          path: 'v1/getPositions',
        },
        data: { message: dummyError },
      },
    } as AxiosError

    handleBitfinexRequestError({ error: axiosError1 })

    expect(handleExchangeRequestErrorMock.callCount).to.be.eq(1)

    expect(handleExchangeRequestErrorMock.args[0][0]).to.deep.eq({
      metadata: axiosError1.response!.data,
      errorMessage: axiosError1.response!.data!.message,
      httpStatusCode: undefined,
      exchangeDownErrorPatterns: bitfinexDownErrorPatterns,
      exchangeKeyInvalidErrorPatterns: bitfinexInvalidApiKeyErrorPatterns,
    })


    const axiosError2 = {
      isAxiosError: true,
      response: {
        status: 401,
        data: ['error', 10010, dummyError],
      },
    } as AxiosError

    handleBitfinexRequestError({ error: axiosError2 })

    expect(handleExchangeRequestErrorMock.callCount).to.be.eq(2)

    expect(handleExchangeRequestErrorMock.args[1][0]).to.deep.eq({
      metadata: axiosError2.response!.data,
      errorMessage: axiosError2.response!.data![2],
      httpStatusCode: axiosError2.response!.status,
      exchangeDownErrorPatterns: bitfinexDownErrorPatterns,
      exchangeKeyInvalidErrorPatterns: bitfinexInvalidApiKeyErrorPatterns,
    })


    const axiosError3 = {
      isAxiosError: true,
      response: {
        status: 500,
        data: [],
      },
    } as AxiosError

    handleBitfinexRequestError({ error: axiosError3 })

    expect(handleExchangeRequestErrorMock.callCount).to.be.eq(3)

    expect(handleExchangeRequestErrorMock.args[2][0]).to.deep.eq({
      metadata: axiosError3.response!.data,
      errorMessage: undefined,
      httpStatusCode: axiosError3.response!.status,
      exchangeDownErrorPatterns: bitfinexDownErrorPatterns,
      exchangeKeyInvalidErrorPatterns: bitfinexInvalidApiKeyErrorPatterns,
    })


    const axiosError4 = {
      isAxiosError: true,
    } as AxiosError

    handleBitfinexRequestError({ error: axiosError4 })

    expect(handleExchangeRequestErrorMock.callCount).to.be.eq(4)

    expect(handleExchangeRequestErrorMock.args[3][0]).to.deep.eq({
      metadata: axiosError4,
      errorMessage: undefined,
      httpStatusCode: undefined,
      exchangeDownErrorPatterns: bitfinexDownErrorPatterns,
      exchangeKeyInvalidErrorPatterns: bitfinexInvalidApiKeyErrorPatterns,
    })


    const error = {
      message: dummyError,
    } as Error

    handleBitfinexRequestError({ error })

    expect(handleExchangeRequestErrorMock.callCount).to.be.eq(5)

    expect(handleExchangeRequestErrorMock.args[4][0]).to.deep.eq({
      metadata: error,
      errorMessage: undefined,
      httpStatusCode: undefined,
      exchangeDownErrorPatterns: bitfinexDownErrorPatterns,
      exchangeKeyInvalidErrorPatterns: bitfinexInvalidApiKeyErrorPatterns,
    })

    const unknown = {} as any

    handleBitfinexRequestError({ error: unknown })

    expect(handleExchangeRequestErrorMock.callCount).to.be.eq(6)

    expect(handleExchangeRequestErrorMock.args[5][0]).to.deep.eq({
      metadata: unknown,
      errorMessage: undefined,
      httpStatusCode: undefined,
      exchangeDownErrorPatterns: bitfinexDownErrorPatterns,
      exchangeKeyInvalidErrorPatterns: bitfinexInvalidApiKeyErrorPatterns,
    })

  })

  it(
    'should ensure Bitfinex invalid api patterns work as expected',
    async () => {

      let alunaError: AlunaError
      const error = {
        isAxiosError: true,
        response: {
          status: 401,
          data: [-12, 'error', 'reason'],
        },
      } as AxiosError


      // Testing all string patterns
      const message = 'Lorem Ipsum is simply dummy text of the printing'

      const strPatters = filter(bitfinexInvalidApiKeyErrorPatterns, (p) => {

        return !(p instanceof RegExp)

      })

      each(strPatters, (pattern) => {

        const insertPos = random(0, message.length - 1)

        const msgWithInjectedPattern = message.slice(0, insertPos)
          .concat(pattern as string)
          .concat(message.slice(insertPos))

        error.response!.data![2] = msgWithInjectedPattern

        alunaError = handleBitfinexRequestError({ error })

        expect(alunaError.code).to.be.eq(AlunaKeyErrorCodes.INVALID)
        expect(alunaError.message).to.be.eq(EXCHANGE_INVALID_KEY_ERROR_MESSAGE)
        expect(alunaError.httpStatusCode).to.be.eq(error.response!.status)
        expect(alunaError.metadata).to.be.eq(error.response!.data)

      })


      // Manualy testing saved regex patterns
      error.response!.data![2] = 'Lorem Ipsum is simply Invalid X-BFX-SIGNATURE'

      alunaError = handleBitfinexRequestError({ error })

      expect(alunaError.code).to.be.eq(AlunaKeyErrorCodes.INVALID)
      expect(alunaError.message).to.be.eq(EXCHANGE_INVALID_KEY_ERROR_MESSAGE)
      expect(alunaError.httpStatusCode).to.be.eq(error.response!.status)
      expect(alunaError.metadata).to.be.eq(error.response!.data)


      error.response!.data![2] = 'Lorem Ipsum is simply X-BFX-APIKEY'

      alunaError = handleBitfinexRequestError({ error })

      expect(alunaError.code).to.be.eq(AlunaKeyErrorCodes.INVALID)
      expect(alunaError.message).to.be.eq(EXCHANGE_INVALID_KEY_ERROR_MESSAGE)
      expect(alunaError.httpStatusCode).to.be.eq(error.response!.status)
      expect(alunaError.metadata).to.be.eq(error.response!.data)

    },
  )

})
