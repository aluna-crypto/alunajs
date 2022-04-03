import { AxiosError } from 'axios'
import { expect } from 'chai'

import { AlunaError } from '../../../lib/core/AlunaError'
import { AlunaKeyErrorCodes } from '../../../lib/errors/AlunaKeyErrorCodes'
import { EXCHANGE_INVALID_KEY_ERROR_MESSAGE } from '../../../utils/errors/handleExchangeRequestError'
import { mockHandleExchangeRequestError } from '../../../utils/errors/handleExchangeRequestError.mock'
import {
  binanceDownErrorPatterns,
  binanceInvalidApiKeyErrorPatterns,
  handleBinanceRequestError,
} from './handleBinanceRequestError'



describe('handleBinanceRequestError', () => {

  it('should ensure request error is being handle', async () => {

    const { handleExchangeRequestErrorMock } = mockHandleExchangeRequestError()

    const dummyError = 'dummy-error'

    const axiosError1 = {
      isAxiosError: true,
      response: {
        status: 400,
        data: {
          msg: dummyError,
        },
      },
    } as AxiosError

    let alunaError = handleBinanceRequestError({ error: axiosError1 })

    expect(handleExchangeRequestErrorMock.args[0][0]).to.deep.eq({
      metadata: axiosError1.response!.data,
      errorMessage: axiosError1.response!.data!.msg,
      httpStatusCode: axiosError1.response!.status,
      exchangeDownErrorPatterns: binanceDownErrorPatterns,
      exchangeKeyInvalidErrorPatterns: binanceInvalidApiKeyErrorPatterns,
    })

    expect(alunaError instanceof AlunaError).to.be.ok

    const axiosError2 = {
      isAxiosError: true,
      response: {
        status: 500,
        data: {
        },
      },
    } as AxiosError

    alunaError = handleBinanceRequestError({ error: axiosError2 })

    expect(handleExchangeRequestErrorMock.args[1][0]).to.deep.eq({
      metadata: axiosError2.response!.data,
      errorMessage: undefined,
      httpStatusCode: axiosError2.response!.status,
      exchangeDownErrorPatterns: binanceDownErrorPatterns,
      exchangeKeyInvalidErrorPatterns: binanceInvalidApiKeyErrorPatterns,
    })

    expect(alunaError instanceof AlunaError).to.be.ok


    const axiosError3 = {
      isAxiosError: true,
    } as AxiosError

    alunaError = handleBinanceRequestError({ error: axiosError3 })

    expect(handleExchangeRequestErrorMock.args[2][0]).to.deep.eq({
      metadata: axiosError3,
      errorMessage: undefined,
      httpStatusCode: undefined,
      exchangeDownErrorPatterns: binanceDownErrorPatterns,
      exchangeKeyInvalidErrorPatterns: binanceInvalidApiKeyErrorPatterns,
    })

    expect(alunaError instanceof AlunaError).to.be.ok


    const error = {
      message: dummyError,
    } as Error

    alunaError = handleBinanceRequestError({ error })

    expect(handleExchangeRequestErrorMock.args[3][0]).to.deep.eq({
      metadata: error,
      errorMessage: undefined,
      httpStatusCode: undefined,
      exchangeDownErrorPatterns: binanceDownErrorPatterns,
      exchangeKeyInvalidErrorPatterns: binanceInvalidApiKeyErrorPatterns,
    })

    expect(alunaError instanceof AlunaError).to.be.ok


    const unknown = {} as any

    alunaError = handleBinanceRequestError({ error: unknown })

    expect(handleExchangeRequestErrorMock.args[4][0]).to.deep.eq({
      metadata: unknown,
      errorMessage: undefined,
      httpStatusCode: undefined,
      exchangeDownErrorPatterns: binanceDownErrorPatterns,
      exchangeKeyInvalidErrorPatterns: binanceInvalidApiKeyErrorPatterns,
    })

    expect(alunaError instanceof AlunaError).to.be.ok

  })

  it(
    'should ensure Binance invalid api patterns work as expected',
    async () => {

      const error = {
        isAxiosError: true,
        response: {
          status: 401,
          data: {
            msg: 'Invalid API-key, IP, or permissions for action.',
          },
        },
      } as AxiosError

      let alunaError = handleBinanceRequestError({ error })

      expect(alunaError.code).to.be.eq(AlunaKeyErrorCodes.INVALID)
      expect(alunaError.message).to.be.eq(EXCHANGE_INVALID_KEY_ERROR_MESSAGE)
      expect(alunaError.httpStatusCode).to.be.eq(error.response!.status)
      expect(alunaError.metadata).to.be.eq(error.response!.data)


      error.response!.data!.msg = 'Signature for this request is not valid.'
      error.response!.status = 400

      alunaError = handleBinanceRequestError({ error })

      expect(alunaError.code).to.be.eq(AlunaKeyErrorCodes.INVALID)
      expect(alunaError.message).to.be.eq(EXCHANGE_INVALID_KEY_ERROR_MESSAGE)
      expect(alunaError.httpStatusCode).to.be.eq(error.response!.status)
      expect(alunaError.metadata).to.be.eq(error.response!.data)


      error.response!.data!.msg = 'API-key format invalid.'
      error.response!.status = 401

      alunaError = handleBinanceRequestError({ error })

      expect(alunaError.code).to.be.eq(AlunaKeyErrorCodes.INVALID)
      expect(alunaError.message).to.be.eq(EXCHANGE_INVALID_KEY_ERROR_MESSAGE)
      expect(alunaError.httpStatusCode).to.be.eq(error.response!.status)
      expect(alunaError.metadata).to.be.eq(error.response!.data)

    },
  )

})
