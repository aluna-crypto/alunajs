import { AxiosError } from 'axios'
import { expect } from 'chai'

import { AlunaHttpErrorCodes } from '../../../lib/errors/AlunaHttpErrorCodes'
import { AlunaKeyErrorCodes } from '../../../lib/errors/AlunaKeyErrorCodes'
import * as handleOkxMod from './handleOkxRequestError'



describe('handleOkxRequestError', () => {

  const {
    handleOkxRequestError,
    isInvalidApiKeyError,
  } = handleOkxMod

  const requestErrorMsg = 'Error while executing request.'

  it('should properly handle Okx request error', async () => {

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

    let alunaError = handleOkxRequestError({ error: axiosError1 })

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

    alunaError = handleOkxRequestError({ error: axiosError2 })

    expect(alunaError).to.deep.eq({
      code: AlunaHttpErrorCodes.REQUEST_ERROR,
      message: requestErrorMsg,
      httpStatusCode: axiosError2.response!.status,
      metadata: axiosError2.response!.data,
    })


    const axiosError3 = {
      isAxiosError: true,
    } as AxiosError

    alunaError = handleOkxRequestError({ error: axiosError3 })

    expect(alunaError).to.deep.eq({
      code: AlunaHttpErrorCodes.REQUEST_ERROR,
      message: requestErrorMsg,
      httpStatusCode: 500,
      metadata: axiosError3,
    })

    const axiosError4 = {
      isAxiosError: true,
      response: {
        status: 500,
        data: {
          code: '50111',
        },
      },
    } as AxiosError

    alunaError = handleOkxRequestError({ error: axiosError4 })

    expect(alunaError).to.deep.eq({
      code: AlunaKeyErrorCodes.INVALID,
      message: requestErrorMsg,
      httpStatusCode: 500,
      metadata: axiosError4.response?.data,
    })


    const error = {
      message: dummyError,
    } as Error

    alunaError = handleOkxRequestError({ error })

    expect(alunaError).to.deep.eq({
      code: AlunaHttpErrorCodes.REQUEST_ERROR,
      message: error.message,
      httpStatusCode: 500,
      metadata: error,
    })


    const unknown = {} as any

    alunaError = handleOkxRequestError({ error: unknown })

    expect(alunaError).to.deep.eq({
      code: AlunaHttpErrorCodes.REQUEST_ERROR,
      message: requestErrorMsg,
      httpStatusCode: 500,
      metadata: unknown,
    })

  })

  it(
    'should ensure Okx invalid api patterns work as expected',
    async () => {

      const INVALID_KEY_CODE = '50111'

      expect(isInvalidApiKeyError({
        code: INVALID_KEY_CODE,
      })).to.be.ok

    },
  )

})
