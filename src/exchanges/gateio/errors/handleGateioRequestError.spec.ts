import { AxiosError } from 'axios'
import { expect } from 'chai'
import {
  each,
  random,
} from 'lodash'
import { ImportMock } from 'ts-mock-imports'

import { AlunaHttpErrorCodes } from '../../../lib/errors/AlunaHttpErrorCodes'
import { AlunaKeyErrorCodes } from '../../../lib/errors/AlunaKeyErrorCodes'
import * as handleGateioMod from './handleGateioRequestError'



describe('handleGateioRequestError', () => {

  const {
    isGateioKeyInvalid,
    handleGateioRequestError,
    gateioInvalidKeyPatterns,
  } = handleGateioMod

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

    const isGateioKeyInvalidMock = ImportMock.mockFunction(
      handleGateioMod,
      'isGateioKeyInvalid',
      isInvalid,
    )

    return {
      isGateioKeyInvalidMock,
    }

  }

  it('should return Gateio key invalid error when applicable', async () => {

    const { isGateioKeyInvalidMock } = mockDeps({ isInvalid: true })

    const dummyError = 'Key is invalid'

    const axiosError1 = {
      isAxiosError: true,
      response: {
        status: 400,
        data: {
          message: dummyError,
        },
      },
    } as AxiosError

    const alunaError = handleGateioRequestError({ error: axiosError1 })

    expect(alunaError).to.deep.eq({
      code: AlunaKeyErrorCodes.INVALID,
      message: dummyError,
      httpStatusCode: axiosError1.response!.status,
      metadata: axiosError1.response!.data,
    })

    expect(isGateioKeyInvalidMock.callCount).to.be.eq(1)
    expect(isGateioKeyInvalidMock.args[0][0]).to.be.eq(dummyError)

  })

  it('should ensure Gateio request error is being handle', async () => {

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

    let alunaError = handleGateioRequestError({ error: axiosError1 })

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

    alunaError = handleGateioRequestError({ error: axiosError2 })

    expect(alunaError).to.deep.eq({
      code: AlunaHttpErrorCodes.REQUEST_ERROR,
      metadata: axiosError2.response!.data,
      message: requestErrorMsg,
      httpStatusCode: axiosError2.response!.status,
    })


    const axiosError3 = {
      isAxiosError: true,
    } as AxiosError

    alunaError = handleGateioRequestError({ error: axiosError3 })

    expect(alunaError).to.deep.eq({
      code: AlunaHttpErrorCodes.REQUEST_ERROR,
      metadata: axiosError3,
      message: requestErrorMsg,
      httpStatusCode: 500,
    })


    const error = {
      message: dummyError,
    } as Error

    alunaError = handleGateioRequestError({ error })

    expect(alunaError).to.deep.eq({
      code: AlunaHttpErrorCodes.REQUEST_ERROR,
      metadata: error,
      message: dummyError,
      httpStatusCode: 500,
    })


    const unknown = {} as any

    alunaError = handleGateioRequestError({ error: unknown })

    expect(alunaError).to.deep.eq({
      code: AlunaHttpErrorCodes.REQUEST_ERROR,
      metadata: unknown,
      message: requestErrorMsg,
      httpStatusCode: 500,
    })

  })

  it(
    'should ensure Gateio invalid api patterns work as expected',
    async () => {

      // Testing all string patterns
      const message = 'Lorem Ipsum is simply dummy text of the printing'

      each(gateioInvalidKeyPatterns, (pattern) => {

        const insertPos = random(0, message.length - 1)

        const msgWithInjectedPattern = message.slice(0, insertPos)
          .concat(pattern as string)
          .concat(message.slice(insertPos))

        expect(isGateioKeyInvalid(msgWithInjectedPattern)).to.be.ok

      })

    },
  )

})
