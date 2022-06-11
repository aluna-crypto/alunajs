import { AxiosError } from 'axios'
import { expect } from 'chai'
import { ImportMock } from 'ts-mock-imports'

import { AlunaHttpErrorCodes } from '../../../lib/errors/AlunaHttpErrorCodes'
import { AlunaKeyErrorCodes } from '../../../lib/errors/AlunaKeyErrorCodes'
import * as handleHuobiMod from './handleHuobiRequestError'



describe(__filename, () => {

  const {
    isHuobiKeyInvalid,
    handleHuobiRequestError,
  } = handleHuobiMod

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

    const isHuobiKeyInvalidMock = ImportMock.mockFunction(
      handleHuobiMod,
      'isHuobiKeyInvalid',
      isInvalid,
    )

    return {
      isHuobiKeyInvalidMock,
    }

  }

  it('should return Huobi key invalid error when applicable', async () => {

    const { isHuobiKeyInvalidMock } = mockDeps({ isInvalid: true })

    const dummyError = 'unauthorized'

    const axiosError1 = {
      isAxiosError: true,
      response: {
        status: 400,
        data: {
          'err-msg': dummyError,
        },
      },
    } as AxiosError

    const alunaError = handleHuobiRequestError({ error: axiosError1 })

    expect(isHuobiKeyInvalidMock.callCount).to.be.eq(1)

    expect(alunaError).to.deep.eq({
      code: AlunaKeyErrorCodes.INVALID,
      message: dummyError,
      httpStatusCode: axiosError1.response?.status,
      metadata: axiosError1.response?.data,
    })

    expect(isHuobiKeyInvalidMock.callCount).to.be.eq(1)
    expect(isHuobiKeyInvalidMock.args[0][0]).to.be.eq(dummyError)

  })

  it('should ensure Huobi request error is being handle', async () => {

    const dummyError = 'dummy-error'

    const axiosError1 = {
      isAxiosError: true,
      response: {
        status: 400,
        data: {
          'err-msg': dummyError,
        },
      },
    } as AxiosError

    let alunaError = handleHuobiRequestError({ error: axiosError1 })

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

    alunaError = handleHuobiRequestError({ error: axiosError2 })

    expect(alunaError).to.deep.eq({
      code: AlunaHttpErrorCodes.REQUEST_ERROR,
      message: requestMessage,
      httpStatusCode: axiosError2.response?.status,
      metadata: axiosError2.response?.data,
    })


    const axiosError3 = {
      isAxiosError: true,
    } as AxiosError

    alunaError = handleHuobiRequestError({ error: axiosError3 })

    expect(alunaError).to.deep.eq({
      code: AlunaHttpErrorCodes.REQUEST_ERROR,
      message: requestMessage,
      httpStatusCode: 500,
      metadata: axiosError3,
    })

    const error = {
      message: dummyError,
    } as Error

    alunaError = handleHuobiRequestError({ error })

    expect(alunaError).to.deep.eq({
      code: AlunaHttpErrorCodes.REQUEST_ERROR,
      message: error.message,
      httpStatusCode: 500,
      metadata: error,
    })


    const huobiError = {
      'err-msg': dummyError,
    } as handleHuobiMod.IHuobiErrorSchema

    alunaError = handleHuobiRequestError({ error: huobiError })

    expect(alunaError).to.deep.eq({
      code: AlunaHttpErrorCodes.REQUEST_ERROR,
      message: dummyError,
      httpStatusCode: 500,
      metadata: huobiError,
    })

    const unknown = {} as any

    alunaError = handleHuobiRequestError({ error: unknown })

    expect(alunaError).to.deep.eq({
      code: AlunaHttpErrorCodes.REQUEST_ERROR,
      message: requestMessage,
      httpStatusCode: 500,
      metadata: unknown,
    })

  })

  it(
    'should ensure Huobi invalid api patterns work as expected',
    async () => {

      const message = 'unauthorized'
      expect(isHuobiKeyInvalid(message)).to.be.ok

    },
  )

})
