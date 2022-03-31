import { expect } from 'chai'
import { ImportMock } from 'ts-mock-imports'

import { AlunaError } from '../../../lib/core/AlunaError'
import { IAlunaExchange } from '../../../lib/core/IAlunaExchange'
import { AlunaHttpErrorCodes } from '../../../lib/errors/AlunaHttpErrorCodes'
import { BittrexHttp } from '../BittrexHttp'
import { IBittrexKeySchema } from '../schemas/IBittrexKeySchema'
import { BittrexKeyModule } from './BittrexKeyModule'



describe('BittrexKeyModule', () => {

  const bittrexKeyModule = BittrexKeyModule.prototype

  const dummyAccountId = 'dummy-id'

  it('should get permissions from Bittrex API key just fine', async () => {

    ImportMock.mockOther(
      bittrexKeyModule,
      'exchange',
      {
        keySecret: {
          key: '',
          secret: '',
        },
      } as IAlunaExchange,
    )

    const mockRest: any = {} // mock requestResponse

    const requestResponse: IBittrexKeySchema = {
      ...mockRest, // without accountId
    }

    const requestMock = ImportMock.mockFunction(
      BittrexHttp,
      'privateRequest',
      { data: requestResponse, requestCount: 1 },
    )

    const badRequestErrorMock = new AlunaError({
      code: 'any-code',
      message: 'any-message',
      metadata: {
        code: 'BAD_REQUEST',
      },
    })

    requestMock.onSecondCall().returns(Promise.reject(badRequestErrorMock))

    const { key: { permissions } } = await bittrexKeyModule.fetchDetails()

    expect(permissions.read).to.be.ok
    expect(permissions.trade).to.be.ok
    expect(permissions.withdraw).not.to.be.ok

    expect(requestMock.callCount).to.be.eq(3)

  })



  it('should ensure user has read permissions', async () => {

    ImportMock.mockOther(
      bittrexKeyModule,
      'exchange',
      {
        keySecret: {
          key: '',
          secret: '',
        },
      } as IAlunaExchange,
    )

    const invalidPermissionsErrorMock = new AlunaError({
      code: 'request-error',
      message: 'any-message',
      httpStatusCode: 403,
      metadata: {
        code: 'INVALID_PERMISSION',
      },
    })

    const mockRest: any = {} // mock requestResponse

    const requestResponse: IBittrexKeySchema = {
      ...mockRest, // without accountId
    }

    const requestMock = ImportMock.mockFunction(
      BittrexHttp,
      'privateRequest',
      { data: requestResponse, requestCount: 1 },
    )

    requestMock
      .onFirstCall()
      .returns(Promise.reject(invalidPermissionsErrorMock))
    requestMock
      .onThirdCall()
      .returns(Promise.reject(invalidPermissionsErrorMock))

    let error

    try {

      await bittrexKeyModule.fetchDetails()

    } catch (e) {

      error = e

    }

    expect(error).to.be.ok
    expect(error.message).to.be.eq('any-message')
    expect(error.httpStatusCode).to.be.eq(403)
    expect(error.code).to.be.eq(AlunaHttpErrorCodes.REQUEST_ERROR)

  })



  it('should ensure user has trade permissions', async () => {

    ImportMock.mockOther(
      bittrexKeyModule,
      'exchange',
      {
        keySecret: {
          key: '',
          secret: '',
        },
      } as IAlunaExchange,
    )

    const invalidPermissionsErrorMock = new AlunaError({
      code: 'request-error',
      message: 'any-message',
      httpStatusCode: 403,
      metadata: {
        code: 'INVALID_PERMISSION',
      },
    })

    const mockRest: any = {} // mock requestResponse

    const requestResponse: IBittrexKeySchema = {
      ...mockRest, // without accountId
    }

    const requestMock1 = ImportMock.mockFunction(
      BittrexHttp,
      'privateRequest',
      { data: requestResponse, requestCount: 1 },
    )

    requestMock1
      .onSecondCall()
      .returns(Promise.reject(invalidPermissionsErrorMock))


    const { key: { permissions } } = await bittrexKeyModule.fetchDetails()

    expect(permissions.trade).not.to.be.ok

  })



  it('should ensure user has trade permissions', async () => {

    ImportMock.mockOther(
      bittrexKeyModule,
      'exchange',
      {
        keySecret: {
          key: '',
          secret: '',
        },
      } as IAlunaExchange,
    )

    const alunaErrorMock = new AlunaError({
      message: 'any-message',
      httpStatusCode: 401,
      code: AlunaHttpErrorCodes.REQUEST_ERROR,
    })

    const mockRest: any = {} // mock requestResponse

    const requestResponse: IBittrexKeySchema = {
      ...mockRest, // without accountId
    }

    const requestMock = ImportMock.mockFunction(
      BittrexHttp,
      'privateRequest',
      { data: requestResponse, requestCount: 1 },
    )

    requestMock.onSecondCall().returns(Promise.reject(alunaErrorMock))

    let error

    try {

      await bittrexKeyModule.fetchDetails()

    } catch (e) {

      error = e

    }

    expect(error).to.be.ok
    expect(error.message).to.be.eq('any-message')
    expect(error.httpStatusCode).to.be.eq(401)
    expect(error.code).to.be.eq(AlunaHttpErrorCodes.REQUEST_ERROR)

  })



  it('should throw an error when fetching account', async () => {

    ImportMock.mockOther(
      bittrexKeyModule,
      'exchange',
      {
        keySecret: {
          key: '',
          secret: '',
        },
      } as IAlunaExchange,
    )

    const alunaErrorMock = new AlunaError({
      message: 'any-message',
      httpStatusCode: 401,
      code: AlunaHttpErrorCodes.REQUEST_ERROR,
    })

    const mockRest: any = {} // mock requestResponse

    const requestResponse: IBittrexKeySchema = {
      ...mockRest, // without accountId
    }

    const requestMock = ImportMock.mockFunction(
      BittrexHttp,
      'privateRequest',
      Promise.reject(alunaErrorMock),
    )

    const response = { data: requestResponse, requestCount: 1 }

    requestMock.onFirstCall().returns(response)
    requestMock.onSecondCall().returns(response)

    let result
    let error

    try {

      result = await bittrexKeyModule.fetchDetails()

    } catch (e) {

      error = e

    }

    expect(result).not.to.be.ok

    expect(error).to.be.ok
    expect(error.message).to.be.eq('any-message')
    expect(error.httpStatusCode).to.be.eq(401)
    expect(error.code).to.be.eq(AlunaHttpErrorCodes.REQUEST_ERROR)

  })



  it('should properly inform when api key or secret are wrong', async () => {

    ImportMock.mockOther(
      bittrexKeyModule,
      'exchange',
      {
        keySecret: {
          key: '',
          secret: '',
        },
      } as IAlunaExchange,
    )

    const alunaErrorMock = new AlunaError({
      message: 'any-message',
      httpStatusCode: 401,
      code: AlunaHttpErrorCodes.REQUEST_ERROR,
    })

    ImportMock.mockFunction(
      BittrexHttp,
      'privateRequest',
      Promise.reject(alunaErrorMock),
    )

    let result
    let error

    try {

      result = await bittrexKeyModule.fetchDetails()

    } catch (e) {

      error = e

    }

    expect(result).not.to.be.ok

    expect(error).to.be.ok
    expect(error.message).to.be.eq('any-message')
    expect(error.httpStatusCode).to.be.eq(401)
    expect(error.code).to.be.eq(AlunaHttpErrorCodes.REQUEST_ERROR)

  })



  it('should parse Bittrex permissions just fine', async () => {

    const key: IBittrexKeySchema = {
      accountId: dummyAccountId,
      read: true,
      trade: false,
      withdraw: false,
    }

    const { key: perm1 } = bittrexKeyModule.parsePermissions({
      rawKey: key,
    })

    expect(perm1.read).to.be.ok
    expect(perm1.trade).not.to.be.ok
    expect(perm1.withdraw).not.to.be.ok

  })

})
