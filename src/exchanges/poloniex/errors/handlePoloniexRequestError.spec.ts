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
  handlePoloniexRequestError,
  poloniexDownErrorPatterns,
  poloniexInvalidApiKeyErrorPatterns,
} from './handlePoloniexRequestError'



describe('handleBittexRequestError', () => {

  it('should ensure request error is being handle', async () => {

    const { handleExchangeRequestErrorMock } = mockHandleExchangeRequestError()

    const dummyError = 'dummy-error'

    const axiosError1 = {
      isAxiosError: true,
      response: {
        status: 400,
        data: {
          error: dummyError,
        },
      },
    } as AxiosError

    let alunaError = handlePoloniexRequestError({ error: axiosError1 })

    expect(handleExchangeRequestErrorMock.args[0][0]).to.deep.eq({
      metadata: axiosError1.response!.data,
      errorMessage: axiosError1.response!.data!.error,
      httpStatusCode: axiosError1.response!.status,
      exchangeDownErrorPatterns: poloniexDownErrorPatterns,
      exchangeKeyInvalidErrorPatterns: poloniexInvalidApiKeyErrorPatterns,
    })

    expect(alunaError instanceof AlunaError).to.be.ok

    const axiosError2 = {
      isAxiosError: true,
      response: {
        status: 500,
        data: {
          result: {
            error: dummyError,
          },
        },
      },
    } as AxiosError

    alunaError = handlePoloniexRequestError({ error: axiosError2 })

    expect(handleExchangeRequestErrorMock.args[1][0]).to.deep.eq({
      metadata: axiosError2.response!.data,
      errorMessage: axiosError2!.response!.data!.result!.error,
      httpStatusCode: axiosError2.response!.status,
      exchangeDownErrorPatterns: poloniexDownErrorPatterns,
      exchangeKeyInvalidErrorPatterns: poloniexInvalidApiKeyErrorPatterns,
    })

    expect(alunaError instanceof AlunaError).to.be.ok


    const axiosError3 = {
      isAxiosError: true,
      response: {
        status: 500,
        data: {
        },
      },
    } as AxiosError

    alunaError = handlePoloniexRequestError({ error: axiosError3 })

    expect(handleExchangeRequestErrorMock.args[2][0]).to.deep.eq({
      metadata: axiosError3.response!.data,
      errorMessage: undefined,
      httpStatusCode: axiosError3.response!.status,
      exchangeDownErrorPatterns: poloniexDownErrorPatterns,
      exchangeKeyInvalidErrorPatterns: poloniexInvalidApiKeyErrorPatterns,
    })

    expect(alunaError instanceof AlunaError).to.be.ok


    const axiosError4 = {
      isAxiosError: true,
    } as AxiosError

    alunaError = handlePoloniexRequestError({ error: axiosError4 })

    expect(handleExchangeRequestErrorMock.args[3][0]).to.deep.eq({
      metadata: axiosError4,
      errorMessage: undefined,
      httpStatusCode: undefined,
      exchangeDownErrorPatterns: poloniexDownErrorPatterns,
      exchangeKeyInvalidErrorPatterns: poloniexInvalidApiKeyErrorPatterns,
    })

    expect(alunaError instanceof AlunaError).to.be.ok


    const error = {
      message: dummyError,
    } as Error

    alunaError = handlePoloniexRequestError({ error })

    expect(handleExchangeRequestErrorMock.args[4][0]).to.deep.eq({
      metadata: error,
      errorMessage: undefined,
      httpStatusCode: undefined,
      exchangeDownErrorPatterns: poloniexDownErrorPatterns,
      exchangeKeyInvalidErrorPatterns: poloniexInvalidApiKeyErrorPatterns,
    })

    expect(alunaError instanceof AlunaError).to.be.ok


    const unknown = {} as any

    alunaError = handlePoloniexRequestError({ error: unknown })

    expect(handleExchangeRequestErrorMock.args[5][0]).to.deep.eq({
      metadata: unknown,
      errorMessage: undefined,
      httpStatusCode: undefined,
      exchangeDownErrorPatterns: poloniexDownErrorPatterns,
      exchangeKeyInvalidErrorPatterns: poloniexInvalidApiKeyErrorPatterns,
    })

    expect(alunaError instanceof AlunaError).to.be.ok

  })

  it(
    'should ensure Bittrex invalid api patterns work as expected',
    async () => {


      let alunaError: AlunaError
      const error = {
        isAxiosError: true,
        response: {
          status: 401,
          data: {
            error: '',
          },
        },
      } as AxiosError


      // Testing all string patterns
      const message = 'Lorem Ipsum is simply dummy text of the printing'

      const strPatters = filter(poloniexInvalidApiKeyErrorPatterns, (p) => {

        return !(p instanceof RegExp)

      })

      each(strPatters, (pattern) => {

        const insertPos = random(0, message.length - 1)

        const msgWithInjectedPattern = message.slice(0, insertPos)
          .concat(pattern as string)
          .concat(message.slice(insertPos))

        error.response!.data!.error = msgWithInjectedPattern

        alunaError = handlePoloniexRequestError({ error })

        expect(alunaError.code).to.be.eq(AlunaKeyErrorCodes.INVALID)
        expect(alunaError.message).to.be.eq(EXCHANGE_INVALID_KEY_ERROR_MESSAGE)
        expect(alunaError.httpStatusCode).to.be.eq(error.response!.status)
        expect(alunaError.metadata).to.be.eq(error.response!.data)

      })


      // Manualy testing saved regex patterns
      error.response!.data!.error = 'Lorem Invalid API key/secret pair Ipsum'

      alunaError = handlePoloniexRequestError({ error })

      expect(alunaError.code).to.be.eq(AlunaKeyErrorCodes.INVALID)
      expect(alunaError.message).to.be.eq(EXCHANGE_INVALID_KEY_ERROR_MESSAGE)
      expect(alunaError.httpStatusCode).to.be.eq(error.response!.status)
      expect(alunaError.metadata).to.be.eq(error.response!.data)


      error.response!.data!.error = 'Lorem Ipsum is simply Permission denied'

      alunaError = handlePoloniexRequestError({ error })

      expect(alunaError.code).to.be.eq(AlunaKeyErrorCodes.INVALID)
      expect(alunaError.message).to.be.eq(EXCHANGE_INVALID_KEY_ERROR_MESSAGE)
      expect(alunaError.httpStatusCode).to.be.eq(error.response!.status)
      expect(alunaError.metadata).to.be.eq(error.response!.data)

    },
  )

})
