import { AxiosError } from 'axios'
import { expect } from 'chai'

import { AlunaError } from '../../../lib/core/AlunaError'
import { AlunaKeyErrorCodes } from '../../../lib/errors/AlunaKeyErrorCodes'
import { EXCHANGE_INVALID_KEY_ERROR_MESSAGE } from '../../../utils/errors/handleExchangeRequestError'
import { mockHandleExchangeRequestError } from '../../../utils/errors/handleExchangeRequestError.mock'
import {
  gateioDownErrorPatterns,
  gateioInvalidApiKeyErrorPatterns,
  handleGateioRequestError,
} from './handleGateioRequestError'



describe('handleBittexRequestError', () => {

  it('should ensure request error is being handle', async () => {

    const { handleExchangeRequestErrorMock } = mockHandleExchangeRequestError()

    const dummyError = 'dummy-error'

    const axiosError1 = {
      isAxiosError: true,
      response: {
        status: 400,
        data: {
          message: dummyError,
        },
      },
    } as AxiosError

    let alunaError = handleGateioRequestError({ error: axiosError1 })

    expect(handleExchangeRequestErrorMock.args[0][0]).to.deep.eq({
      metadata: axiosError1.response!.data,
      errorMessage: axiosError1.response!.data!.message,
      httpStatusCode: axiosError1.response!.status,
      exchangeDownErrorPatterns: gateioDownErrorPatterns,
      exchangeKeyInvalidErrorPatterns: gateioInvalidApiKeyErrorPatterns,
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

    alunaError = handleGateioRequestError({ error: axiosError2 })

    expect(handleExchangeRequestErrorMock.args[1][0]).to.deep.eq({
      metadata: axiosError2.response!.data,
      errorMessage: undefined,
      httpStatusCode: axiosError2.response!.status,
      exchangeDownErrorPatterns: gateioDownErrorPatterns,
      exchangeKeyInvalidErrorPatterns: gateioInvalidApiKeyErrorPatterns,
    })

    expect(alunaError instanceof AlunaError).to.be.ok


    const axiosError3 = {
      isAxiosError: true,
    } as AxiosError

    alunaError = handleGateioRequestError({ error: axiosError3 })

    expect(handleExchangeRequestErrorMock.args[2][0]).to.deep.eq({
      metadata: axiosError3,
      errorMessage: undefined,
      httpStatusCode: undefined,
      exchangeDownErrorPatterns: gateioDownErrorPatterns,
      exchangeKeyInvalidErrorPatterns: gateioInvalidApiKeyErrorPatterns,
    })

    expect(alunaError instanceof AlunaError).to.be.ok


    const error = {
      message: dummyError,
    } as Error

    alunaError = handleGateioRequestError({ error })

    expect(handleExchangeRequestErrorMock.args[3][0]).to.deep.eq({
      metadata: error,
      errorMessage: undefined,
      httpStatusCode: undefined,
      exchangeDownErrorPatterns: gateioDownErrorPatterns,
      exchangeKeyInvalidErrorPatterns: gateioInvalidApiKeyErrorPatterns,
    })

    expect(alunaError instanceof AlunaError).to.be.ok


    const unknown = {} as any

    alunaError = handleGateioRequestError({ error: unknown })

    expect(handleExchangeRequestErrorMock.args[4][0]).to.deep.eq({
      metadata: unknown,
      errorMessage: undefined,
      httpStatusCode: undefined,
      exchangeDownErrorPatterns: gateioDownErrorPatterns,
      exchangeKeyInvalidErrorPatterns: gateioInvalidApiKeyErrorPatterns,
    })

    expect(alunaError instanceof AlunaError).to.be.ok

  })

  it(
    'should ensure Bittrex invalid api patterns work as expected',
    async () => {

      const error = {
        isAxiosError: true,
        response: {
          status: 401,
          data: {
            message: 'Lorem Ipsum Signature mismatch is simply dummy',
          },
        },
      } as AxiosError

      let alunaError = handleGateioRequestError({ error })

      expect(alunaError.code).to.be.eq(AlunaKeyErrorCodes.INVALID)
      expect(alunaError.message).to.be.eq(EXCHANGE_INVALID_KEY_ERROR_MESSAGE)
      expect(alunaError.httpStatusCode).to.be.eq(error.response!.status)
      expect(alunaError.metadata).to.be.eq(error.response!.data)


      error.response!.data!.message = 'Invalid key provided Lorem Ipsum is Simp'
      error.response!.status = 400

      alunaError = handleGateioRequestError({ error })

      expect(alunaError.code).to.be.eq(AlunaKeyErrorCodes.INVALID)
      expect(alunaError.message).to.be.eq(EXCHANGE_INVALID_KEY_ERROR_MESSAGE)
      expect(alunaError.httpStatusCode).to.be.eq(error.response!.status)
      expect(alunaError.metadata).to.be.eq(error.response!.data)

    },
  )

})
