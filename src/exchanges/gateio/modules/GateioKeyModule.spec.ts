import { expect } from 'chai'
import { ImportMock } from 'ts-mock-imports'

import { AlunaError } from '../../../lib/core/AlunaError'
import { IAlunaExchange } from '../../../lib/core/IAlunaExchange'
import { AlunaHttpErrorCodes } from '../../../lib/errors/AlunaHttpErrorCodes'
import { GateioHttp } from '../GateioHttp'
import { IGateioKeySchema } from '../schemas/IGateioKeySchema'
import { GateioKeyModule } from './GateioKeyModule'



describe('GateioKeyModule', () => {

  const gateioKeyModule = GateioKeyModule.prototype

  it('should get permissions from Gateio API key just fine', async () => {

    ImportMock.mockOther(
      gateioKeyModule,
      'exchange',
      {
        keySecret: {
          key: '',
          secret: '',
        },
      } as IAlunaExchange,
    )

    const mockRest: any = {} // mock requestResponse

    const requestResponse: IGateioKeySchema = {
      ...mockRest,
    }

    const requestMock = ImportMock.mockFunction(
      GateioHttp,
      'privateRequest',
      { data: requestResponse, apiRequestCount: 1 },
    )

    const invalidCurrencyErrorMock = new AlunaError({
      code: 'any-code',
      message: 'any-message',
      metadata: {
        label: 'INVALID_CURRENCY_PAIR',
      },
    })

    const keyAccountResponse = {
      data: {
        user_id: 1234,
      },
      apiRequestCount: 1,
    }

    requestMock.onSecondCall().returns(Promise.reject(invalidCurrencyErrorMock))
    requestMock.onThirdCall().returns(Promise.resolve(keyAccountResponse))

    const {
      key: {
        permissions,
        accountId,
      },
    } = await gateioKeyModule.fetchDetails()

    expect(permissions.read).to.be.ok
    expect(permissions.trade).to.be.ok
    expect(permissions.withdraw).not.to.be.ok
    expect(accountId).to.be.eq(keyAccountResponse.data.user_id.toString())

    expect(requestMock.callCount).to.be.eq(3)

  })



  it('should ensure user has read permissions', async () => {

    ImportMock.mockOther(
      gateioKeyModule,
      'exchange',
      {
        keySecret: {
          key: '',
          secret: '',
        },
      } as IAlunaExchange,
    )

    const forbiddenErrorMock = new AlunaError({
      code: 'request-error',
      message: 'any-message',
      httpStatusCode: 403,
      metadata: {
        label: 'BAD_REQUEST',
      },
    })

    const mockRest: any = {} // mock requestResponse

    const requestResponse: IGateioKeySchema = {
      ...mockRest,
    }

    const requestMock = ImportMock.mockFunction(
      GateioHttp,
      'privateRequest',
      { data: requestResponse, apiRequestCount: 1 },
    )

    requestMock
      .onFirstCall()
      .returns(Promise.reject(forbiddenErrorMock))

    let error

    try {

      await gateioKeyModule.fetchDetails()

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
      gateioKeyModule,
      'exchange',
      {
        keySecret: {
          key: '',
          secret: '',
        },
      } as IAlunaExchange,
    )

    const forbiddenErrorMock = new AlunaError({
      code: 'request-error',
      message: 'any-message',
      httpStatusCode: 403,
      metadata: {
        label: 'FORBIDDEN',
      },
    })

    const mockRest: any = {} // mock requestResponse

    const requestResponse: IGateioKeySchema = {
      ...mockRest, // without accountId
    }

    const requestMock1 = ImportMock.mockFunction(
      GateioHttp,
      'privateRequest',
      { data: requestResponse, apiRequestCount: 1 },
    )

    const keyAccountResponse = {
      data: {
        user_id: 1234,
        apiRequestCount: 1,
      },
    }

    requestMock1
      .onSecondCall()
      .returns(Promise.reject(forbiddenErrorMock))
    requestMock1.onThirdCall().returns(Promise.resolve(keyAccountResponse))


    const { key: { permissions } } = await gateioKeyModule.fetchDetails()

    expect(permissions.trade).not.to.be.ok

  })



  it('should ensure user has read and trade permissions', async () => {

    ImportMock.mockOther(
      gateioKeyModule,
      'exchange',
      {
        keySecret: {
          key: '',
          secret: '',
        },
      } as IAlunaExchange,
    )

    const forbiddenErrorMock = new AlunaError({
      code: 'request-error',
      message: 'any-message',
      httpStatusCode: 403,
      metadata: {
        label: 'FORBIDDEN',
      },
    })

    const readOnlyErrorMock = new AlunaError({
      code: 'request-error',
      message: 'any-message',
      httpStatusCode: 401,
      metadata: {
        label: 'READ_ONLY',
      },
    })

    const mockRest: any = {} // mock requestResponse

    const requestResponse: IGateioKeySchema = {
      ...mockRest, // without accountId
    }

    const requestMock1 = ImportMock.mockFunction(
      GateioHttp,
      'privateRequest',
      { data: requestResponse, apiRequestCount: 1 },
    )

    const keyAccountResponse = {
      data: {
        user_id: 1234,
      },
      apiRequestCount: 1,
    }

    requestMock1
      .onFirstCall()
      .returns(Promise.reject(forbiddenErrorMock))
    requestMock1
      .onSecondCall()
      .returns(Promise.reject(readOnlyErrorMock))
    requestMock1.onThirdCall().returns(Promise.resolve(keyAccountResponse))


    const { key: { permissions } } = await gateioKeyModule.fetchDetails()

    expect(permissions.read).not.to.be.ok
    expect(permissions.trade).not.to.be.ok

  })



  it('should ensure user has trade permissions', async () => {

    ImportMock.mockOther(
      gateioKeyModule,
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

    const requestResponse: IGateioKeySchema = {
      ...mockRest, // without accountId
      user_id: '123',
    }

    const requestMock = ImportMock.mockFunction(
      GateioHttp,
      'privateRequest',
      { data: requestResponse, apiRequestCount: 1 },
    )

    requestMock.onSecondCall().returns(Promise.reject(alunaErrorMock))

    let error

    try {

      await gateioKeyModule.fetchDetails()

    } catch (e) {

      error = e

    }

    expect(error).to.be.ok
    expect(error.message).to.be.eq('any-message')
    expect(error.httpStatusCode).to.be.eq(401)
    expect(error.code).to.be.eq(AlunaHttpErrorCodes.REQUEST_ERROR)

  })



  it('should properly inform when api key or secret are wrong', async () => {

    ImportMock.mockOther(
      gateioKeyModule,
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
      GateioHttp,
      'privateRequest',
      Promise.reject(alunaErrorMock),
    )

    let result
    let error

    try {

      result = await gateioKeyModule.fetchDetails()

    } catch (e) {

      error = e

    }

    expect(result).not.to.be.ok

    expect(error).to.be.ok
    expect(error.message).to.be.eq('any-message')
    expect(error.httpStatusCode).to.be.eq(401)
    expect(error.code).to.be.eq(AlunaHttpErrorCodes.REQUEST_ERROR)

  })



  it('should throw an error when accountId is fetched', async () => {

    ImportMock.mockOther(
      gateioKeyModule,
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

    const requestResponse: IGateioKeySchema = {
      ...mockRest, // without accountId
    }

    const requestMock = ImportMock.mockFunction(
      GateioHttp,
      'privateRequest',
      Promise.resolve({
        data: requestResponse,
        apiRequestCount: 1,
      }),
    )

    requestMock.onThirdCall().returns(Promise.reject(alunaErrorMock))


    let result
    let error

    try {

      result = await gateioKeyModule.fetchDetails()

    } catch (e) {

      error = e

    }

    expect(result).not.to.be.ok

    expect(error).to.be.ok
    expect(error.message).to.be.eq('any-message')
    expect(error.httpStatusCode).to.be.eq(401)
    expect(error.code).to.be.eq(AlunaHttpErrorCodes.REQUEST_ERROR)

  })



  it('should parse Gateio permissions just fine', async () => {

    const key: IGateioKeySchema = {
      read: true,
      trade: false,
      withdraw: false,
      accountId: undefined,
    }

    const { key: perm1 } = gateioKeyModule.parsePermissions({
      rawKey: key,
    })

    expect(perm1.read).to.be.ok
    expect(perm1.trade).not.to.be.ok
    expect(perm1.withdraw).not.to.be.ok

  })

})
