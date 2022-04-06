import { AxiosError } from 'axios'
import { expect } from 'chai'
import {
  each,
  filter,
  random,
} from 'lodash'
import { ImportMock } from 'ts-mock-imports'

import { AlunaHttpErrorCodes } from '../../../lib/errors/AlunaHttpErrorCodes'
import { AlunaKeyErrorCodes } from '../../../lib/errors/AlunaKeyErrorCodes'
import * as handlePoloniexMod from './handlePoloniexRequestError'



describe('handlePoloniexRequestError', () => {

  const {
    handlePoloniexRequestError,
    isPoloniexKeyInvalid,
    poloniexInvalidKeyPatterns,
  } = handlePoloniexMod

  const requestErrorMsg = 'Error while executing request.'

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

    const isPoloniexKeyInvalidMock = ImportMock.mockFunction(
      handlePoloniexMod,
      'isPoloniexKeyInvalid',
      isInvalid,
    )

    return {
      isPoloniexKeyInvalidMock,
    }

  }

  it('should return Poloniex key invalid error when applicable', async () => {

    const { isPoloniexKeyInvalidMock } = mockDeps({ isInvalid: true })

    const dummyError = 'Key is invalid'

    const axiosError1 = {
      isAxiosError: true,
      response: {
        status: 400,
        data: {
          error: dummyError,
        },
      },
    } as AxiosError

    const alunaError = handlePoloniexRequestError({ error: axiosError1 })

    expect(alunaError).to.deep.eq({
      code: AlunaKeyErrorCodes.INVALID,
      message: dummyError,
      httpStatusCode: axiosError1.response!.status,
      metadata: axiosError1.response!.data,
    })

    expect(isPoloniexKeyInvalidMock.callCount).to.be.eq(1)
    expect(isPoloniexKeyInvalidMock.args[0][0]).to.be.eq(dummyError)

  })

  it('should ensure Poloniex request error is being handle', async () => {

    const dummyError = 'dummy-error'

    const axiosError1 = {
      isAxiosError: true,
      response: {
        status: 400,
        data: {
          error: dummyError,
        },
      },
    } as AxiosError

    let alunaError = handlePoloniexRequestError({ error: axiosError1 })

    expect(alunaError).to.deep.eq({
      code: AlunaHttpErrorCodes.REQUEST_ERROR,
      metadata: axiosError1.response!.data,
      message: axiosError1.response!.data!.error,
      httpStatusCode: axiosError1.response!.status,
    })


    const axiosError2 = {
      isAxiosError: true,
      response: {
        status: 500,
        data: {
          result: {
            error: dummyError,
          },
        },
      },
    } as AxiosError

    alunaError = handlePoloniexRequestError({ error: axiosError2 })

    expect(alunaError).to.deep.eq({
      code: AlunaHttpErrorCodes.REQUEST_ERROR,
      metadata: axiosError2.response!.data,
      message: axiosError2!.response!.data!.result!.error,
      httpStatusCode: axiosError2.response!.status,
    })


    const axiosError3 = {
      isAxiosError: true,
      response: {
        status: 500,
        data: {
        },
      },
    } as AxiosError

    alunaError = handlePoloniexRequestError({ error: axiosError3 })

    expect(alunaError).to.deep.eq({
      code: AlunaHttpErrorCodes.REQUEST_ERROR,
      metadata: axiosError3.response!.data,
      message: requestErrorMsg,
      httpStatusCode: axiosError3.response!.status,
    })


    const axiosError4 = {
      isAxiosError: true,
    } as AxiosError

    alunaError = handlePoloniexRequestError({ error: axiosError4 })

    expect(alunaError).to.deep.eq({
      code: AlunaHttpErrorCodes.REQUEST_ERROR,
      metadata: axiosError4,
      message: requestErrorMsg,
      httpStatusCode: 500,
    })


    const error = {
      message: dummyError,
    } as Error

    alunaError = handlePoloniexRequestError({ error })

    expect(alunaError).to.deep.eq({
      code: AlunaHttpErrorCodes.REQUEST_ERROR,
      metadata: error,
      message: dummyError,
      httpStatusCode: 500,
    })


    const unknown = {} as any

    alunaError = handlePoloniexRequestError({ error: unknown })

    expect(alunaError).to.deep.eq({
      code: AlunaHttpErrorCodes.REQUEST_ERROR,
      metadata: unknown,
      message: requestErrorMsg,
      httpStatusCode: 500,
    })

  })

  it(
    'should ensure Poloniex invalid api patterns work as expected',
    async () => {

      // Testing all string patterns
      let message = 'Lorem Ipsum is simply dummy text of the printing'

      const strPatters = filter(poloniexInvalidKeyPatterns, (p) => {

        return !(p instanceof RegExp)

      })

      each(strPatters, (pattern) => {

        const insertPos = random(0, message.length - 1)

        const msgWithInjectedPattern = message.slice(0, insertPos)
          .concat(pattern as string)
          .concat(message.slice(insertPos))

        message = msgWithInjectedPattern

        expect(isPoloniexKeyInvalid(message)).to.be.ok

      })


      // Manualy testing saved regex patterns
      message = 'Lorem Invalid API key/secret pair Ipsum'
      expect(isPoloniexKeyInvalid(message)).to.be.ok

      message = 'Lorem Ipsum is simply Permission denied'
      expect(isPoloniexKeyInvalid(message)).to.be.ok

    },
  )

})
