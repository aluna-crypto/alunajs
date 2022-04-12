import { AxiosError } from 'axios'
import { expect } from 'chai'
import {
  each,
  random,
} from 'lodash'
import { ImportMock } from 'ts-mock-imports'

import { AlunaHttpErrorCodes } from '../../../lib/errors/AlunaHttpErrorCodes'
import { AlunaKeyErrorCodes } from '../../../lib/errors/AlunaKeyErrorCodes'
import * as handleValrMod from './handleValrRequestError'



describe('handleValrRequestError', () => {

  const {
    handleValrRequestError,
    isValrKeyInvalid,
    valrInvalidKeyPatterns,
  } = handleValrMod

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

    const isValrKeyInvalidMock = ImportMock.mockFunction(
      handleValrMod,
      'isValrKeyInvalid',
      isInvalid,
    )

    return {
      isValrKeyInvalidMock,
    }

  }

  it('should return Valr key invalid error when applicable', async () => {

    const { isValrKeyInvalidMock } = mockDeps({ isInvalid: true })

    const dummyError = 'Key is invalid'

    const axiosError = {
      isAxiosError: true,
      response: {
        status: 400,
        data: {
          message: dummyError,
        },
      },
    } as AxiosError

    const alunaError = handleValrRequestError({ error: axiosError })

    expect(alunaError).to.deep.eq({
      code: AlunaKeyErrorCodes.INVALID,
      message: dummyError,
      httpStatusCode: axiosError.response!.status,
      metadata: axiosError.response!.data,
    })

    expect(isValrKeyInvalidMock.callCount).to.be.eq(1)
    expect(isValrKeyInvalidMock.args[0][0]).to.be.eq(dummyError)

  })

  it('should ensure Valr request error is being handle', async () => {

    const dummyError = 'dummy-error'

    const axiosError1 = {
      isAxiosError: true,
      response: {
        status: 400,
        data: {
          message: dummyError,
        },
      },
    } as AxiosError

    let alunaError = handleValrRequestError({ error: axiosError1 })

    expect(alunaError).to.deep.eq({
      code: AlunaHttpErrorCodes.REQUEST_ERROR,
      metadata: axiosError1.response!.data,
      message: axiosError1.response!.data!.message,
      httpStatusCode: axiosError1.response!.status,
    })


    const axiosError2 = {
      isAxiosError: true,
      response: {
        status: 500,
        data: {
        },
      },
    } as AxiosError

    alunaError = handleValrRequestError({ error: axiosError2 })

    expect(alunaError).to.deep.eq({
      code: AlunaHttpErrorCodes.REQUEST_ERROR,
      metadata: axiosError2.response!.data,
      message: requestErrorMsg,
      httpStatusCode: axiosError2.response!.status,
    })


    const axiosError3 = {
      isAxiosError: true,
    } as AxiosError

    alunaError = handleValrRequestError({ error: axiosError3 })

    expect(alunaError).to.deep.eq({
      code: AlunaHttpErrorCodes.REQUEST_ERROR,
      metadata: axiosError3,
      message: requestErrorMsg,
      httpStatusCode: 500,
    })


    const error = {
      message: dummyError,
    } as Error

    alunaError = handleValrRequestError({ error })

    expect(alunaError).to.deep.eq({
      code: AlunaHttpErrorCodes.REQUEST_ERROR,
      metadata: error,
      message: dummyError,
      httpStatusCode: 500,
    })


    const unknown = {} as any

    alunaError = handleValrRequestError({ error: unknown })

    expect(alunaError).to.deep.eq({
      code: AlunaHttpErrorCodes.REQUEST_ERROR,
      metadata: unknown,
      message: requestErrorMsg,
      httpStatusCode: 500,
    })

  })

  it(
    'should ensure Valr invalid api patterns work as expected',
    async () => {

      // Testing all string patterns
      const message = 'Lorem Ipsum is simply dummy text of the printing'

      each(valrInvalidKeyPatterns, (pattern) => {

        const insertPos = random(0, message.length - 1)

        const msgWithInjectedPattern = message.slice(0, insertPos)
          .concat(pattern as string)
          .concat(message.slice(insertPos))

        expect(isValrKeyInvalid(msgWithInjectedPattern)).to.be.ok

      })

    },
  )

})
