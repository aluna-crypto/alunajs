import { AxiosError } from 'axios'
import { expect } from 'chai'
import {
  each,
  filter,
  random,
} from 'lodash'

import { AlunaError } from '../../../lib/core/AlunaError'
import { AlunaExchangeErrorCodes } from '../../../lib/errors/AlunaExchangeErrorCodes'
import { AlunaKeyErrorCodes } from '../../../lib/errors/AlunaKeyErrorCodes'
import {
  EXCHANGE_DOWN_ERROR_MESSAGE,
  EXCHANGE_INVALID_KEY_ERROR_MESSAGE,
} from '../../../utils/errors/handleExchangeRequestError'
import { mockHandleExchangeRequestError } from '../../../utils/errors/handleExchangeRequestError.mock'
import {
  bitmexDownErrorPatterns,
  bitmexInvalidApiKeyErrorPatterns,
  handleBitmexRequestError,
} from './handleBitmexRequestError'



describe('handleBitmexRequestError', () => {

  it('should properly handle Bitmex request error', () => {

    const { handleExchangeRequestErrorMock } = mockHandleExchangeRequestError()

    const dummyError = 'dummy-error'

    const axiosError1 = {
      isAxiosError: true,
      response: {
        status: 400,
        data: {
          error: {
            message: dummyError,
          },
        },
      },
    } as AxiosError

    handleBitmexRequestError({ error: axiosError1 })

    expect(handleExchangeRequestErrorMock.callCount).to.be.eq(1)

    expect(handleExchangeRequestErrorMock.args[0][0]).to.deep.eq({
      metadata: axiosError1.response!.data,
      errorMessage: axiosError1.response!.data!.error!.message,
      httpStatusCode: axiosError1.response!.status,
      exchangeDownErrorPatterns: bitmexDownErrorPatterns,
      exchangeKeyInvalidErrorPatterns: bitmexInvalidApiKeyErrorPatterns,
    })


    const axiosError2 = {
      isAxiosError: true,
      response: {
        data: {
        },
      },
    } as AxiosError

    handleBitmexRequestError({ error: axiosError2 })

    expect(handleExchangeRequestErrorMock.callCount).to.be.eq(2)

    expect(handleExchangeRequestErrorMock.args[1][0]).to.deep.eq({
      metadata: axiosError2.response!.data,
      errorMessage: undefined,
      httpStatusCode: undefined,
      exchangeDownErrorPatterns: bitmexDownErrorPatterns,
      exchangeKeyInvalidErrorPatterns: bitmexInvalidApiKeyErrorPatterns,
    })


    const axiosError3 = {
      isAxiosError: true,
      response: {
      },
    } as AxiosError

    handleBitmexRequestError({ error: axiosError3 })

    expect(handleExchangeRequestErrorMock.callCount).to.be.eq(3)

    expect(handleExchangeRequestErrorMock.args[2][0]).to.deep.eq({
      metadata: axiosError3,
      errorMessage: undefined,
      httpStatusCode: undefined,
      exchangeDownErrorPatterns: bitmexDownErrorPatterns,
      exchangeKeyInvalidErrorPatterns: bitmexInvalidApiKeyErrorPatterns,
    })


    const axiosError4 = {
      isAxiosError: true,
    } as AxiosError

    handleBitmexRequestError({ error: axiosError4 })

    expect(handleExchangeRequestErrorMock.callCount).to.be.eq(4)

    expect(handleExchangeRequestErrorMock.args[3][0]).to.deep.eq({
      metadata: axiosError4,
      errorMessage: undefined,
      httpStatusCode: undefined,
      exchangeDownErrorPatterns: bitmexDownErrorPatterns,
      exchangeKeyInvalidErrorPatterns: bitmexInvalidApiKeyErrorPatterns,
    })


    const error = {
      message: dummyError,
    } as Error

    handleBitmexRequestError({ error })

    expect(handleExchangeRequestErrorMock.callCount).to.be.eq(5)

    expect(handleExchangeRequestErrorMock.args[4][0]).to.deep.eq({
      metadata: error,
      errorMessage: undefined,
      httpStatusCode: undefined,
      exchangeDownErrorPatterns: bitmexDownErrorPatterns,
      exchangeKeyInvalidErrorPatterns: bitmexInvalidApiKeyErrorPatterns,
    })

    const unknown = {} as any

    handleBitmexRequestError({ error: unknown })

    expect(handleExchangeRequestErrorMock.callCount).to.be.eq(6)

    expect(handleExchangeRequestErrorMock.args[5][0]).to.deep.eq({
      metadata: unknown,
      errorMessage: undefined,
      httpStatusCode: undefined,
      exchangeDownErrorPatterns: bitmexDownErrorPatterns,
      exchangeKeyInvalidErrorPatterns: bitmexInvalidApiKeyErrorPatterns,
    })

  })

  it(
    'should ensure Bitmex invalid api patterns work as expected',
    async () => {

      let alunaError: AlunaError

      const error = {
        isAxiosError: true,
        response: {
          status: 400,
          data: {
            error: {
              message: '',
            },
          },
        },
      } as AxiosError


      // Testing all string patterns
      const message = 'Lorem Ipsum is simply dummy text of the printing'

      const strPatters = filter(bitmexInvalidApiKeyErrorPatterns, (p) => {

        return !(p instanceof RegExp)

      })

      each(strPatters, (pattern) => {

        const insertPos = random(0, message.length - 1)

        const msgWithInjectedPattern = message.slice(0, insertPos)
          .concat(pattern as string)
          .concat(message.slice(insertPos))

        error.response!.data!.error!.message = msgWithInjectedPattern

        alunaError = handleBitmexRequestError({ error })

        expect(alunaError.code).to.be.eq(AlunaKeyErrorCodes.INVALID)
        expect(alunaError.message).to.be.eq(EXCHANGE_INVALID_KEY_ERROR_MESSAGE)
        expect(alunaError.httpStatusCode).to.be.eq(error.response!.status)
        expect(alunaError.metadata).to.be.eq(error.response!.data)

      })

    },
  )

  it(
    'should ensure Bitmex exchange down patterns work as expected',
    async () => {

      let alunaError: AlunaError

      const error = {
        isAxiosError: true,
        response: {
          status: 400,
          data: {
            error: {
              message: '',
            },
          },
        },
      } as AxiosError


      // Testing all string patterns
      const message = 'Lorem Ipsum is simply dummy text of the printing'

      const strPatters = filter(bitmexDownErrorPatterns, (p) => {

        return !(p instanceof RegExp)

      })

      each(strPatters, (pattern) => {

        const insertPos = random(0, message.length - 1)

        const msgWithInjectedPattern = message.slice(0, insertPos)
          .concat(pattern as string)
          .concat(message.slice(insertPos))

        error.response!.data!.error!.message = msgWithInjectedPattern

        alunaError = handleBitmexRequestError({ error })

        const {
          code,
          metadata,
          httpStatusCode,
        } = alunaError

        expect(code).to.be.eq(AlunaExchangeErrorCodes.EXCHANGE_IS_DOWN)
        expect(alunaError.message).to.be.eq(EXCHANGE_DOWN_ERROR_MESSAGE)
        expect(httpStatusCode).to.be.eq(error.response!.status)
        expect(metadata).to.be.eq(error.response!.data)

      })

    },
  )

})
