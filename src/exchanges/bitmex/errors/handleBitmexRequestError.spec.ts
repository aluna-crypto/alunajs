import { AxiosError } from 'axios'
import { expect } from 'chai'
import { ImportMock } from 'ts-mock-imports'

import { AlunaHttpErrorCodes } from '../../../lib/errors/AlunaHttpErrorCodes'
import { AlunaKeyErrorCodes } from '../../../lib/errors/AlunaKeyErrorCodes'
import * as handleBitmexMod from './handleBitmexRequestError'



describe(__filename, () => {

  const {
    isBitmexKeyInvalid,
    handleBitmexRequestError,
  } = handleBitmexMod

  const requestMessage = 'Error while executing request.'

  const mockDeps = (
    params: {
      isInvalid: boolean
    } = {
      isInvalid: false,
    },
  ) => {

    const {
      isInvalid,
    } = params

    const isBitmexKeyInvalidMock = ImportMock.mockFunction(
      handleBitmexMod,
      'isBitmexKeyInvalid',
      isInvalid,
    )

    return {
      isBitmexKeyInvalidMock,
    }

  }

  it('should return Bitmex key invalid error when applicable', async () => {

    const { isBitmexKeyInvalidMock } = mockDeps({ isInvalid: true })

    const dummyError = 'Key is invalid'

    const axiosError1 = {
      isAxiosError: true,
      response: {
        status: 400,
        data: {
          exchangeErroMsg: dummyError,
        },
      },
    } as AxiosError

    const alunaError = handleBitmexRequestError({ error: axiosError1 })

    expect(isBitmexKeyInvalidMock.callCount).to.be.eq(1)

    expect(alunaError).to.deep.eq({
      code: AlunaKeyErrorCodes.INVALID,
      message: dummyError,
      httpStatusCode: axiosError1.response?.status,
      metadata: axiosError1.response?.data,
    })

    expect(isBitmexKeyInvalidMock.callCount).to.be.eq(1)
    expect(isBitmexKeyInvalidMock.args[0][0]).to.be.eq(dummyError)

  })

  it('should ensure Bitmex request error is being handle', async () => {

    const dummyError = 'dummy-error'

    const axiosError1 = {
      isAxiosError: true,
      response: {
        status: 400,
        data: {
          exchangeErroMsg: dummyError,
        },
      },
    } as AxiosError

    let alunaError = handleBitmexRequestError({ error: axiosError1 })

    expect(alunaError).to.deep.eq({
      code: AlunaHttpErrorCodes.REQUEST_ERROR,
      message: dummyError,
      httpStatusCode: axiosError1.response?.status,
      metadata: axiosError1.response?.data,
    })


    const axiosError2 = {
      isAxiosError: true,
      response: {
        status: 500,
        data: {
        },
      },
    } as AxiosError

    alunaError = handleBitmexRequestError({ error: axiosError2 })

    expect(alunaError).to.deep.eq({
      code: AlunaHttpErrorCodes.REQUEST_ERROR,
      message: requestMessage,
      httpStatusCode: axiosError2.response?.status,
      metadata: axiosError2.response?.data,
    })


    const axiosError3 = {
      isAxiosError: true,
    } as AxiosError

    alunaError = handleBitmexRequestError({ error: axiosError3 })

    expect(alunaError).to.deep.eq({
      code: AlunaHttpErrorCodes.REQUEST_ERROR,
      message: requestMessage,
      httpStatusCode: 500,
      metadata: axiosError3,
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

      const message = 'api-invalid'
      expect(isBitmexKeyInvalid(message)).to.be.ok

    },
  )

})
