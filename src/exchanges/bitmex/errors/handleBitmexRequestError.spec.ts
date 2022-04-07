import { AxiosError } from 'axios'
import { expect } from 'chai'
import {
  each,
  random,
} from 'lodash'
import { ImportMock } from 'ts-mock-imports'

import { AlunaExchangeErrorCodes } from '../../../lib/errors/AlunaExchangeErrorCodes'
import { AlunaHttpErrorCodes } from '../../../lib/errors/AlunaHttpErrorCodes'
import { AlunaKeyErrorCodes } from '../../../lib/errors/AlunaKeyErrorCodes'
import * as handleBitmexMod from './handleBitmexRequestError'



describe('handleBitmexRequestError', () => {

  const {
    handleBitmexRequestError,
    bitmexInvalidKeyPatterns,
    isBitmexKeyInvalid,
    bitmexDownPatterns,
    isBitmexDown,
  } = handleBitmexMod

  const requestMessage = 'Error while executing request.'

  const mockDeps = (
    params: {
      isInvalid: boolean,
      isDown: boolean,
    } = {
      isInvalid: false,
      isDown: false,
    },
  ) => {

    const {
      isDown,
      isInvalid,
    } = params

    const isBitmexKeyInvalidMock = ImportMock.mockFunction(
      handleBitmexMod,
      'isBitmexKeyInvalid',
      isInvalid,
    )

    const isBitmexDownMock = ImportMock.mockFunction(
      handleBitmexMod,
      'isBitmexDown',
      isDown,
    )

    return {
      isBitmexKeyInvalidMock,
      isBitmexDownMock,
    }

  }

  it('should return Bitmex key invalid error when applicable', async () => {

    const { isBitmexKeyInvalidMock } = mockDeps({
      isDown: false,
      isInvalid: true,
    })

    const dummyError = 'Key is invalid'

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

    const alunaError = handleBitmexRequestError({ error: axiosError1 })

    expect(alunaError).to.deep.eq({
      code: AlunaKeyErrorCodes.INVALID,
      message: dummyError,
      httpStatusCode: axiosError1.response!.status,
      metadata: axiosError1.response!.data,
    })

    expect(isBitmexKeyInvalidMock.callCount).to.be.eq(1)
    expect(isBitmexKeyInvalidMock.args[0][0]).to.be.eq(dummyError)

  })

  it('should return Bitmex down error when applicable', async () => {

    const { isBitmexDownMock } = mockDeps({
      isDown: true,
      isInvalid: false,
    })

    const dummyError = 'Bitmex is down.'

    const axiosError = {
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

    const alunaError = handleBitmexRequestError({ error: axiosError })

    expect(alunaError).to.deep.eq({
      code: AlunaExchangeErrorCodes.EXCHANGE_IS_DOWN,
      message: dummyError,
      httpStatusCode: axiosError.response!.status,
      metadata: axiosError.response!.data,
    })

    expect(isBitmexDownMock.callCount).to.be.eq(1)
    expect(isBitmexDownMock.args[0][0]).to.be.eq(dummyError)

  })

  it('should properly handle Bitmex request error', async () => {

    mockDeps()

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

    let alunaError = handleBitmexRequestError({ error: axiosError1 })

    expect(alunaError).to.deep.eq({
      code: AlunaHttpErrorCodes.REQUEST_ERROR,
      message: dummyError,
      httpStatusCode: axiosError1.response!.status,
      metadata: axiosError1.response!.data,
    })


    const axiosError2 = {
      isAxiosError: true,
      response: {
        status: 500,
        data: {
          message: {},
        },
      },
    } as AxiosError

    alunaError = handleBitmexRequestError({ error: axiosError2 })

    expect(alunaError).to.deep.eq({
      code: AlunaHttpErrorCodes.REQUEST_ERROR,
      message: requestMessage,
      httpStatusCode: axiosError2.response!.status,
      metadata: axiosError2.response!.data,
    })

    const axiosError3 = {
      isAxiosError: true,
      response: {
        status: 500,
        data: {},
      },
    } as AxiosError

    alunaError = handleBitmexRequestError({ error: axiosError3 })

    expect(alunaError).to.deep.eq({
      code: AlunaHttpErrorCodes.REQUEST_ERROR,
      message: requestMessage,
      httpStatusCode: 500,
      metadata: axiosError3.response!.data,
    })


    const axiosError4 = {
      isAxiosError: true,
    } as AxiosError

    alunaError = handleBitmexRequestError({ error: axiosError4 })

    expect(alunaError).to.deep.eq({
      code: AlunaHttpErrorCodes.REQUEST_ERROR,
      message: requestMessage,
      httpStatusCode: 500,
      metadata: axiosError4,
    })


    const error = {
      message: dummyError,
    } as Error

    alunaError = handleBitmexRequestError({ error })

    expect(alunaError).to.deep.eq({
      code: AlunaHttpErrorCodes.REQUEST_ERROR,
      message: error.message,
      httpStatusCode: 500,
      metadata: error,
    })


    const unknown = {} as any

    alunaError = handleBitmexRequestError({ error: unknown })

    expect(alunaError).to.deep.eq({
      code: AlunaHttpErrorCodes.REQUEST_ERROR,
      message: requestMessage,
      httpStatusCode: 500,
      metadata: unknown,
    })

  })

  it(
    'should ensure Bitmex invalid api patterns work as expected',
    async () => {

      // Testing all string patterns
      const message = 'Lorem Ipsum is simply dummy text of the printing'

      each(bitmexInvalidKeyPatterns, (pattern) => {

        const insertPos = random(0, message.length - 1)

        const msgWithInjectedPattern = message.slice(0, insertPos)
          .concat(pattern as string)
          .concat(message.slice(insertPos))

        expect(isBitmexKeyInvalid(msgWithInjectedPattern)).to.be.ok

      })

    },
  )


  it(
    'should ensure Bitmex exchange down patterns work as expected',
    async () => {

      // Testing all string patterns
      const message = 'Lorem Ipsum is simply dummy text of the printing'

      each(bitmexDownPatterns, (pattern) => {

        const insertPos = random(0, message.length - 1)

        const msgWithInjectedPattern = message.slice(0, insertPos)
          .concat(pattern as string)
          .concat(message.slice(insertPos))

        expect(isBitmexDown(msgWithInjectedPattern)).to.be.ok

      })

    },
  )

})
