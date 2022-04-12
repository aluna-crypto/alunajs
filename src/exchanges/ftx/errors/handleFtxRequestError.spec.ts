import { AxiosError } from 'axios'
import { expect } from 'chai'

import { AlunaHttpErrorCodes } from '../../../lib/errors/AlunaHttpErrorCodes'
import * as handleFtxMod from './handleFtxRequestError'



describe('handleFtxRequestError', () => {

  const {
    handleFtxRequestError,
  } = handleFtxMod

  const requestErrorMsg = 'Error while executing request.'


  it('should properly handle Ftx request error', async () => {

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

    let alunaError = handleFtxRequestError({ error: axiosError1 })

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

    alunaError = handleFtxRequestError({ error: axiosError2 })

    expect(alunaError).to.deep.eq({
      code: AlunaHttpErrorCodes.REQUEST_ERROR,
      message: requestErrorMsg,
      httpStatusCode: axiosError2.response!.status,
      metadata: axiosError2.response!.data,
    })


    const axiosError3 = {
      isAxiosError: true,
    } as AxiosError

    alunaError = handleFtxRequestError({ error: axiosError3 })

    expect(alunaError).to.deep.eq({
      code: AlunaHttpErrorCodes.REQUEST_ERROR,
      message: requestErrorMsg,
      httpStatusCode: 500,
      metadata: axiosError3,
    })


    const error = {
      message: dummyError,
    } as Error

    alunaError = handleFtxRequestError({ error })

    expect(alunaError).to.deep.eq({
      code: AlunaHttpErrorCodes.REQUEST_ERROR,
      message: error.message,
      httpStatusCode: 500,
      metadata: error,
    })


    const unknown = {} as any

    alunaError = handleFtxRequestError({ error: unknown })

    expect(alunaError).to.deep.eq({
      code: AlunaHttpErrorCodes.REQUEST_ERROR,
      message: requestErrorMsg,
      httpStatusCode: 500,
      metadata: unknown,
    })

  })

})
