import { AxiosError } from 'axios'
import { expect } from 'chai'
import { ImportMock } from 'ts-mock-imports'

import { AlunaHttpErrorCodes } from '../../../lib/errors/AlunaHttpErrorCodes'
import { AlunaKeyErrorCodes } from '../../../lib/errors/AlunaKeyErrorCodes'
import * as handleBinanceMod from './handleBinanceRequestError'



describe('handleBinanceRequestError', () => {

  const {
    isBinanceKeyInvalid,
    handleBinanceRequestError,
  } = handleBinanceMod

  const requestErrorMsg = 'Error while executing request.'

  it('should return Binance key invalid error when applicable', async () => {

    const isBinanceKeyInvalidMock = ImportMock.mockFunction(
      handleBinanceMod,
      'isBinanceKeyInvalid',
      true,
    )

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

    const alunaError = handleBinanceRequestError({ error: axiosError1 })

    expect(alunaError).to.deep.eq({
      code: AlunaKeyErrorCodes.INVALID,
      message: dummyError,
      httpStatusCode: axiosError1.response!.status,
      metadata: axiosError1.response!.data,
    })

    expect(isBinanceKeyInvalidMock.callCount).to.be.eq(1)

  })

  it('should properly handle Binance request error', async () => {

    ImportMock.mockFunction(
      handleBinanceMod,
      'isBinanceKeyInvalid',
      false,
    )

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

    alunaError = handleBinanceRequestError({ error: axiosError2 })

    expect(alunaError).to.deep.eq({
      code: AlunaHttpErrorCodes.REQUEST_ERROR,
      message: requestErrorMsg,
      httpStatusCode: axiosError2.response!.status,
      metadata: axiosError2.response!.data,
    })


    const axiosError3 = {
      isAxiosError: true,
    } as AxiosError

    alunaError = handleBinanceRequestError({ error: axiosError3 })

    expect(alunaError).to.deep.eq({
      code: AlunaHttpErrorCodes.REQUEST_ERROR,
      message: requestErrorMsg,
      httpStatusCode: 500,
      metadata: axiosError3,
    })


    const error = {
      message: dummyError,
    } as Error

    alunaError = handleBinanceRequestError({ error })

    expect(alunaError).to.deep.eq({
      code: AlunaHttpErrorCodes.REQUEST_ERROR,
      message: error.message,
      httpStatusCode: 500,
      metadata: error,
    })


    const unknown = {} as any

    alunaError = handleBinanceRequestError({ error: unknown })

    expect(alunaError).to.deep.eq({
      code: AlunaHttpErrorCodes.REQUEST_ERROR,
      message: requestErrorMsg,
      httpStatusCode: 500,
      metadata: unknown,
    })

  })

  it(
    'should ensure Binance invalid api patterns work as expected',
    async () => {

      // Manually testing Binance Invalid Api Key regex pattern
      let pattern = 'Invalid API-key, IP, or permissions for action.'
      expect(isBinanceKeyInvalid(pattern)).to.be.ok

      pattern = 'Signature for this request is not valid.'
      expect(isBinanceKeyInvalid(pattern)).to.be.ok

      pattern = 'API-key format invalid.'
      expect(isBinanceKeyInvalid(pattern)).to.be.ok


    },
  )

})
