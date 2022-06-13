import { AxiosError } from 'axios'
import { expect } from 'chai'
import { each } from 'lodash'

import { AlunaHttpErrorCodes } from '../../../lib/errors/AlunaHttpErrorCodes'
import { AlunaKeyErrorCodes } from '../../../lib/errors/AlunaKeyErrorCodes'
import * as handleOkxMod from './handleOkxRequestError'



describe(__filename, () => {

  const { handleOkxRequestError } = handleOkxMod

  const requestMessage = 'Error while executing request.'

  it('should return Okx key invalid error when applicable', async () => {

    // preparing data
    const matchingString = [
      'Request header “OK_ACCESS_PASSPHRASE“ incorrect.',
      'Invalid OK-ACCESS-KEY',
      'Invalid Sign',
    ]

    each(matchingString, (string) => {

      const msg = 'Lorem Ipsum is simply '.concat(string)

      const axiosError = {
        isAxiosError: true,
        response: {
          status: 400,
          data: {
            msg,
          },
        },
      } as AxiosError


      // executing
      const alunaError = handleOkxRequestError({ error: axiosError })


      // validating
      expect(alunaError).to.deep.eq({
        code: AlunaKeyErrorCodes.INVALID,
        message: msg,
        httpStatusCode: axiosError.response!.status,
        metadata: axiosError.response!.data,
      })

    })

  })

  it('should ensure Okx request error is being handle', async () => {

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

    alunaError = handleOkxRequestError({ error: axiosError2 })

    expect(alunaError).to.deep.eq({
      code: AlunaHttpErrorCodes.REQUEST_ERROR,
      message: requestMessage,
      httpStatusCode: axiosError2.response?.status,
      metadata: axiosError2.response?.data,
    })


    const axiosError3 = {
      isAxiosError: true,
    } as AxiosError

    alunaError = handleOkxRequestError({ error: axiosError3 })

    expect(alunaError).to.deep.eq({
      code: AlunaHttpErrorCodes.REQUEST_ERROR,
      message: requestMessage,
      httpStatusCode: 500,
      metadata: axiosError3,
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


    const okxError = {
      sCode: '51000',
      sMsg: requestMessage,
    } as handleOkxMod.IOkxErrorSchema

    alunaError = handleOkxRequestError({ error: okxError })

    expect(alunaError).to.deep.eq({
      code: AlunaHttpErrorCodes.REQUEST_ERROR,
      message: requestMessage,
      httpStatusCode: 500,
      metadata: okxError,
    })

    const okxError2 = {
      code: '51000',
      msg: requestMessage,
    } as handleOkxMod.IOkxErrorSchema

    alunaError = handleOkxRequestError({ error: okxError2 })

    expect(alunaError).to.deep.eq({
      code: AlunaHttpErrorCodes.REQUEST_ERROR,
      message: requestMessage,
      httpStatusCode: 500,
      metadata: okxError2,
    })


    const okxErrors = [
      {
        sCode: '51000',
        sMsg: requestMessage,
      },
      {
        sCode: '666',
      },
    ] as handleOkxMod.IOkxErrorSchema[]

    alunaError = handleOkxRequestError({ error: okxErrors })

    const expectedErrMsgs = `${requestMessage}. `

    expect(alunaError).to.deep.eq({
      code: AlunaHttpErrorCodes.REQUEST_ERROR,
      message: expectedErrMsgs,
      httpStatusCode: 500,
      metadata: okxErrors,
    })

    const unknown = {} as any

    alunaError = handleOkxRequestError({ error: unknown })

    expect(alunaError).to.deep.eq({
      code: AlunaHttpErrorCodes.REQUEST_ERROR,
      message: requestMessage,
      httpStatusCode: 500,
      metadata: unknown,
    })

  })

})
