import { AxiosError } from 'axios'
import { expect } from 'chai'

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
      metadata: axiosError1.response,
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
      metadata: axiosError2.response,
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
      metadata: axiosError3.response,
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

})
