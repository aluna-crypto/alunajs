import { AxiosError } from 'axios'
import { expect } from 'chai'
import { ImportMock } from 'ts-mock-imports'

import { AlunaHttpErrorCodes } from '../../../lib/errors/AlunaHttpErrorCodes'
import { AlunaKeyErrorCodes } from '../../../lib/errors/AlunaKeyErrorCodes'
import * as handleBittrexMod from './handleBittrexRequestError'



describe('handleBittexRequestError', () => {

  const {
    isBittrexKeyInvalid,
    handleBittrexRequestError,
  } = handleBittrexMod

  const requestMessage = 'Error while executing request.'

  const mockDeps = (
    params: {
      isInvalid: boolean,
    } = {
      isInvalid: false,
    },
  ) => {

    const {
      isInvalid,
    } = params

    const isBittrexKeyInvalidMock = ImportMock.mockFunction(
      handleBittrexMod,
      'isBittrexKeyInvalid',
      isInvalid,
    )

    return {
      isBittrexKeyInvalidMock,
    }

  }

  it('should return Bittrex key invalid error when applicable', async () => {

    const { isBittrexKeyInvalidMock } = mockDeps({ isInvalid: true })

    const dummyError = 'Key is invalid'

    const axiosError1 = {
      isAxiosError: true,
      response: {
        status: 400,
        data: {
          code: dummyError,
        },
      },
    } as AxiosError

    const alunaError = handleBittrexRequestError({ error: axiosError1 })

    expect(isBittrexKeyInvalidMock.callCount).to.be.eq(1)

    expect(alunaError).to.deep.eq({
      code: AlunaKeyErrorCodes.INVALID,
      message: dummyError,
      httpStatusCode: axiosError1.response!.status,
      metadata: axiosError1.response!.data,
    })

    expect(isBittrexKeyInvalidMock.callCount).to.be.eq(1)
    expect(isBittrexKeyInvalidMock.args[0][0]).to.be.eq(dummyError)

  })

  it('should ensure Bittrex request error is being handle', async () => {

    const dummyError = 'dummy-error'

    const axiosError1 = {
      isAxiosError: true,
      response: {
        status: 400,
        data: {
          code: dummyError,
        },
      },
    } as AxiosError

    let alunaError = handleBittrexRequestError({ error: axiosError1 })

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
        },
      },
    } as AxiosError

    alunaError = handleBittrexRequestError({ error: axiosError2 })

    expect(alunaError).to.deep.eq({
      code: AlunaHttpErrorCodes.REQUEST_ERROR,
      message: requestMessage,
      httpStatusCode: axiosError2.response!.status,
      metadata: axiosError2.response!.data,
    })


    const axiosError3 = {
      isAxiosError: true,
    } as AxiosError

    alunaError = handleBittrexRequestError({ error: axiosError3 })

    expect(alunaError).to.deep.eq({
      code: AlunaHttpErrorCodes.REQUEST_ERROR,
      message: requestMessage,
      httpStatusCode: 500,
      metadata: axiosError3,
    })

    const error = {
      message: dummyError,
    } as Error

    alunaError = handleBittrexRequestError({ error })

    expect(alunaError).to.deep.eq({
      code: AlunaHttpErrorCodes.REQUEST_ERROR,
      message: error.message,
      httpStatusCode: 500,
      metadata: error,
    })


    const unknown = {} as any

    alunaError = handleBittrexRequestError({ error: unknown })

    expect(alunaError).to.deep.eq({
      code: AlunaHttpErrorCodes.REQUEST_ERROR,
      message: requestMessage,
      httpStatusCode: 500,
      metadata: unknown,
    })

  })

  it(
    'should ensure Bittrex invalid api patterns work as expected',
    async () => {

      let message = 'Lorem Ipsum is simply dummy INVALID_SIGNATURE'
      expect(isBittrexKeyInvalid(message)).to.be.ok

      message = 'APIKEY_INVALID Lorem Ipsum is simply'
      expect(isBittrexKeyInvalid(message)).to.be.ok

    },
  )

})
