import { AxiosError } from 'axios'
import { expect } from 'chai'
import { each } from 'lodash'

import { AlunaExchangeErrorCodes } from '../../../lib/errors/AlunaExchangeErrorCodes'
import { AlunaHttpErrorCodes } from '../../../lib/errors/AlunaHttpErrorCodes'
import { AlunaKeyErrorCodes } from '../../../lib/errors/AlunaKeyErrorCodes'
import * as handleBitmexMod from './handleBitmexRequestError'



describe(__filename, () => {

  const {
    handleBitmexRequestError,
  } = handleBitmexMod

  const requestMessage = 'Error while executing request.'


  it('should return Bitmex key invalid error when applicable', async () => {

    // preparing data
    const matchingString = [
      'Invalid API Key',
      'Signature not valid',
      'This key is disabled',
      'Your account has been disabled',
      'Missing API key',
    ]

    each(matchingString, (string) => {

      const message = 'Lorem Ipsum is simply '.concat(string)

      const axiosError = {
        isAxiosError: true,
        response: {
          status: 400,
          data: {
            error: {
              message,
            },
          },
        },
      } as AxiosError


      // executing
      const alunaError = handleBitmexRequestError({ error: axiosError })


      // validating
      expect(alunaError).to.deep.eq({
        code: AlunaKeyErrorCodes.INVALID,
        message,
        httpStatusCode: 200,
        metadata: axiosError.response!.data,
      })

    })

  })

  it('should return Bitmex down error when applicable', async () => {

    // preparing data
    const matchingString = [
      'downtime in progress',
      'down for maintenance',
    ]

    each(matchingString, (string) => {

      const message = 'Lorem Ipsum is simply '.concat(string)

      const axiosError = {
        isAxiosError: true,
        response: {
          status: 400,
          data: {
            error: {
              message,
            },
          },
        },
      } as AxiosError


      // executing
      const alunaError = handleBitmexRequestError({ error: axiosError })


      // validating
      expect(alunaError).to.deep.eq({
        code: AlunaExchangeErrorCodes.EXCHANGE_IS_DOWN,
        message,
        httpStatusCode: 200,
        metadata: axiosError.response!.data,
      })

    })

  })

  it('should ensure Bitmex request error is being handle', async () => {

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

})
