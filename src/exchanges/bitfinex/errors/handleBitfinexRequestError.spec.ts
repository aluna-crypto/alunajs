import { AxiosError } from 'axios'
import { expect } from 'chai'
import {
  each,
  filter,
  random,
} from 'lodash'
import { ImportMock } from 'ts-mock-imports'

import { AlunaError } from '../../../lib/core/AlunaError'
import { AlunaHttpErrorCodes } from '../../../lib/errors/AlunaHttpErrorCodes'
import { AlunaKeyErrorCodes } from '../../../lib/errors/AlunaKeyErrorCodes'
import * as handleBitfinexMod from './handleBitfinexRequestError'



describe('handleBitfinexRequestError', () => {


  const {
    bitfinexInvalidKeyPatterns,
    isBitfinexKeyInvalid,
    handleBitfinexRequestError,
  } = handleBitfinexMod

  const requestErrorMsg = 'Error while executing request.'

  it('should return Bitfinex key invalid error when applicable', async () => {

    const isBitfinexKeyInvalidMock = ImportMock.mockFunction(
      handleBitfinexMod,
      'isBitfinexKeyInvalid',
      true,
    )

    const dummyError = 'dummy-error'

    const axiosError = {
      isAxiosError: true,
      response: {
        status: 401,
        data: ['error', 10010, dummyError],
      },
    } as AxiosError


    const alunaError = handleBitfinexRequestError({ error: axiosError })

    expect(alunaError).to.deep.eq(new AlunaError({
      code: AlunaKeyErrorCodes.INVALID,
      message: dummyError,
      httpStatusCode: axiosError.response!.status,
      metadata: axiosError.response!.data,
    }))

    expect(isBitfinexKeyInvalidMock.callCount).to.be.eq(1)

  })

  it('should properly handle Bitfinex request errors', () => {

    ImportMock.mockFunction(
      handleBitfinexMod,
      'isBitfinexKeyInvalid',
      false,
    )

    const dummyError = 'dummy-error'

    const axiosError1 = {
      isAxiosError: true,
      response: {
        status: 401,
        data: ['error', 10010, dummyError],
      },
    } as AxiosError

    let alunaError = handleBitfinexRequestError({ error: axiosError1 })

    expect(alunaError).to.deep.eq(new AlunaError({
      code: AlunaHttpErrorCodes.REQUEST_ERROR,
      message: axiosError1.response!.data![2],
      httpStatusCode: axiosError1.response!.status,
      metadata: axiosError1.response!.data,
    }))


    const axiosError2 = {
      isAxiosError: true,
      response: {
        status: 500,
        data: [],
      },
    } as AxiosError

    alunaError = handleBitfinexRequestError({ error: axiosError2 })


    expect(alunaError).to.deep.eq(new AlunaError({
      code: AlunaHttpErrorCodes.REQUEST_ERROR,
      metadata: axiosError2.response!.data,
      message: requestErrorMsg,
      httpStatusCode: axiosError2.response!.status,
    }))


    const axiosError3 = {
      isAxiosError: true,
    } as AxiosError

    alunaError = handleBitfinexRequestError({ error: axiosError3 })


    expect(alunaError).to.deep.eq(new AlunaError({
      code: AlunaHttpErrorCodes.REQUEST_ERROR,
      metadata: axiosError3,
      message: requestErrorMsg,
      httpStatusCode: 500,
    }))


    const error = {
      message: dummyError,
    } as Error

    alunaError = handleBitfinexRequestError({ error })


    expect(alunaError).to.deep.eq(new AlunaError({
      code: AlunaHttpErrorCodes.REQUEST_ERROR,
      metadata: error,
      message: dummyError,
      httpStatusCode: 500,
    }))

    const unknown = {} as any

    alunaError = handleBitfinexRequestError({ error: unknown })


    expect(alunaError).to.deep.eq(new AlunaError({
      code: AlunaHttpErrorCodes.REQUEST_ERROR,
      metadata: unknown,
      message: requestErrorMsg,
      httpStatusCode: 500,
    }))

  })

  it(
    'should ensure Bitfinex invalid api patterns work as expected',
    async () => {

      // Testing all string patterns
      const message = 'Lorem Ipsum is simply dummy text of the printing'

      const strPatters = filter(bitfinexInvalidKeyPatterns, (p) => {

        return !(p instanceof RegExp)

      })

      each(strPatters, (pattern) => {

        const insertPos = random(0, message.length - 1)

        const msgWithInjectedPattern = message.slice(0, insertPos)
          .concat(pattern as string)
          .concat(message.slice(insertPos))

        expect(isBitfinexKeyInvalid(msgWithInjectedPattern)).to.be.ok

      })


      // Manualy testing saved regex patterns
      let pattern = 'Lorem Ipsum is simply Invalid X-BFX-SIGNATURE'
      expect(isBitfinexKeyInvalid(pattern)).to.be.ok

      pattern = 'Lorem Ipsum is simply X-BFX-APIKEY'
      expect(isBitfinexKeyInvalid(pattern)).to.be.ok

      pattern = 'Lorem Ipsum is simply apikey: invalid'
      expect(isBitfinexKeyInvalid(pattern)).to.be.ok

      pattern = 'Lorem Ipsum is simply apikey: digest invalid'
      expect(isBitfinexKeyInvalid(pattern)).to.be.ok

    },
  )

})
