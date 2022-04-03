import { AxiosError } from 'axios'
import { expect } from 'chai'

import { AlunaError } from '../../../lib/core/AlunaError'
import { AlunaKeyErrorCodes } from '../../../lib/errors/AlunaKeyErrorCodes'
import { EXCHANGE_INVALID_KEY_ERROR_MESSAGE } from '../../../utils/errors/handleExchangeRequestError'
import { mockHandleExchangeRequestError } from '../../../utils/errors/handleExchangeRequestError.mock'
import {
  bittrexDownErrorPatterns,
  bittrexInvalidApiKeyErrorPatterns,
  handleBittrexRequestError,
} from './handleBittrexRequestError'



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

    let alunaError = handleBittrexRequestError({ error: axiosError1 })

    expect(handleExchangeRequestErrorMock.args[0][0]).to.deep.eq({
      metadata: axiosError1.response!.data,
      errorMessage: axiosError1.response!.data!.message,
      httpStatusCode: axiosError1.response!.status,
      exchangeDownErrorPatterns: bittrexDownErrorPatterns,
      exchangeKeyInvalidErrorPatterns: bittrexInvalidApiKeyErrorPatterns,
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

    alunaError = handleBittrexRequestError({ error: axiosError2 })

    expect(handleExchangeRequestErrorMock.args[1][0]).to.deep.eq({
      metadata: axiosError2.response!.data,
      errorMessage: undefined,
      httpStatusCode: axiosError2.response!.status,
      exchangeDownErrorPatterns: bittrexDownErrorPatterns,
      exchangeKeyInvalidErrorPatterns: bittrexInvalidApiKeyErrorPatterns,
    })

    expect(alunaError instanceof AlunaError).to.be.ok


    const axiosError3 = {
      isAxiosError: true,
    } as AxiosError

    alunaError = handleBittrexRequestError({ error: axiosError3 })

    expect(handleExchangeRequestErrorMock.args[2][0]).to.deep.eq({
      metadata: axiosError3,
      errorMessage: undefined,
      httpStatusCode: undefined,
      exchangeDownErrorPatterns: bittrexDownErrorPatterns,
      exchangeKeyInvalidErrorPatterns: bittrexInvalidApiKeyErrorPatterns,
    })

    expect(alunaError instanceof AlunaError).to.be.ok


    const error = {
      message: dummyError,
    } as Error

    alunaError = handleBittrexRequestError({ error })

    expect(handleExchangeRequestErrorMock.args[3][0]).to.deep.eq({
      metadata: error,
      errorMessage: undefined,
      httpStatusCode: undefined,
      exchangeDownErrorPatterns: bittrexDownErrorPatterns,
      exchangeKeyInvalidErrorPatterns: bittrexInvalidApiKeyErrorPatterns,
    })

    expect(alunaError instanceof AlunaError).to.be.ok


    const unknown = {} as any

    alunaError = handleBittrexRequestError({ error: unknown })

    expect(handleExchangeRequestErrorMock.args[4][0]).to.deep.eq({
      metadata: unknown,
      errorMessage: undefined,
      httpStatusCode: undefined,
      exchangeDownErrorPatterns: bittrexDownErrorPatterns,
      exchangeKeyInvalidErrorPatterns: bittrexInvalidApiKeyErrorPatterns,
    })

    expect(alunaError instanceof AlunaError).to.be.ok

    // it('should ensure request error is being handle', async () => {

    //   const dummyError = 'dummy-error'

    //   const axiosError1 = {
    //     isAxiosError: true,
    //     response: {
    //       status: 400,
    //       data: {
    //         message: dummyError,
    //       },
    //     },
    //   }

    //   const error1 = BittrexHttpMod.handleRequ
    // estError(axiosError1 as AxiosError)

    //   expect(error1 instanceof AlunaError).to.be.ok
    //   expect(error1.message).to.be.eq(dummyError)
    //   expect(error1.httpStatusCode).to.be.eq(400)

    //   const axiosError2 = {
    //     isAxiosError: true,
    //     response: {
    //       data: {
    //       },
    //     },
    //   }

    //   const error2 = BittrexHttpMod.handleRequestE
    // rror(axiosError2 as AxiosError)

    //   expect(error2 instanceof AlunaError).to.be.ok
    //   expect(
    //     error2.message,
    //   ).to.be.eq('Error while trying to execute Axios request')
    //   expect(error2.httpStatusCode).to.be.eq(400)

    //   const axiosError3 = {
    //     isAxiosError: true,
    //   }

    //   const error3 = BittrexHttpMod.handleRequ
    // estError(axiosError3 as AxiosError)

    //   expect(error3 instanceof AlunaError).to.be.ok
    //   expect(
    //     error3.message,
    //   ).to.be.eq('Error while trying to execute Axios request')
    //   expect(error3.httpStatusCode).to.be.eq(400)

    //   const error = {
    //     message: dummyError,
    //   }

    //   const error4 = BittrexHttpMod.handleRequestError(error as Error)

    //   expect(error4 instanceof AlunaError).to.be.ok
    //   expect(error4.message).to.be.eq(dummyError)
    //   expect(error4.httpStatusCode).to.be.eq(400)

    //   const unknown = {}

    //   const error5 = BittrexHttpMod.handleRequestError(unknown as any)

    //   expect(error5 instanceof AlunaError).to.be.ok
    //   expect(
    //     error5.message,
    //   ).to.be.eq('Error while trying to execute Axios request')
    //   expect(error5.httpStatusCode).to.be.eq(400)

    // })

  })

  it(
    'should ensure Bittrex invalid api patterns work as expected',
    async () => {

      const error = {
        isAxiosError: true,
        response: {
          status: 401,
          data: {
            message: 'Lorem Ipsum is simply dummy INVALID_SIGNATURE',
          },
        },
      } as AxiosError

      let alunaError = handleBittrexRequestError({ error })

      expect(alunaError.code).to.be.eq(AlunaKeyErrorCodes.INVALID)
      expect(alunaError.message).to.be.eq(EXCHANGE_INVALID_KEY_ERROR_MESSAGE)
      expect(alunaError.httpStatusCode).to.be.eq(error.response!.status)
      expect(alunaError.metadata).to.be.eq(error.response!.data)


      error.response!.data!.message = 'APIKEY_INVALID Lorem Ipsum is simply'
      error.response!.status = 400

      alunaError = handleBittrexRequestError({ error })

      expect(alunaError.code).to.be.eq(AlunaKeyErrorCodes.INVALID)
      expect(alunaError.message).to.be.eq(EXCHANGE_INVALID_KEY_ERROR_MESSAGE)
      expect(alunaError.httpStatusCode).to.be.eq(error.response!.status)
      expect(alunaError.metadata).to.be.eq(error.response!.data)

    },
  )

})
