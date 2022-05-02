import { expect } from 'chai'
import { ImportMock } from 'ts-mock-imports'

import { AlunaError } from '../../../lib/core/AlunaError'
import { IAlunaExchange } from '../../../lib/core/IAlunaExchange'
import { AlunaHttpErrorCodes } from '../../../lib/errors/AlunaHttpErrorCodes'
import { OkxHttp } from '../OkxHttp'
import { IOkxKeySchema } from '../schemas/IOkxKeySchema'
import { OkxKeyModule } from './OkxKeyModule'



describe('OkxKeyModule', () => {

  const okxKeyModule = OkxKeyModule.prototype

  const dummyAccountId = 'dummy-id'

  it('should get permissions from Okx API key just fine', async () => {

    ImportMock.mockOther(
      okxKeyModule,
      'exchange',
      {
        keySecret: {
          key: '',
          secret: '',
        },
      } as IAlunaExchange,
    )

    const mockRest: any = {
      accountId: '123456',
    } // mock requestResponse

    const requestResponse: IOkxKeySchema = {
      ...mockRest,
    }

    const requestMock = ImportMock.mockFunction(
      OkxHttp,
      'privateRequest',
      { data: [requestResponse], requestCount: 1 },
    )

    const { key: { permissions } } = await okxKeyModule.fetchDetails()

    expect(permissions.read).to.be.ok
    expect(permissions.trade).not.to.be.ok
    expect(permissions.withdraw).not.to.be.ok

    expect(requestMock.callCount).to.be.eq(2)

  })



  it('should ensure user has read permissions', async () => {

    ImportMock.mockOther(
      okxKeyModule,
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
        code: '123',
      },
    })

    const mockRest: any = {} // mock requestResponse

    const requestResponse: IOkxKeySchema = {
      ...mockRest, // without accountId
    }

    const requestMock = ImportMock.mockFunction(
      OkxHttp,
      'privateRequest',
      { data: [requestResponse], requestCount: 1 },
    )

    requestMock
      .onFirstCall()
      .returns(Promise.reject(invalidPermissionsErrorMock))

    let error

    try {

      await okxKeyModule.fetchDetails()

    } catch (e) {

      error = e

    }

    expect(error).to.be.ok
    expect(error.message).to.be.eq('any-message')
    expect(error.httpStatusCode).to.be.eq(403)
    expect(error.code).to.be.eq(AlunaHttpErrorCodes.REQUEST_ERROR)

  })

  it('should ensure user has read permissions', async () => {

    ImportMock.mockOther(
      okxKeyModule,
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
        code: '50030',
      },
    })

    const requestMock1 = ImportMock.mockFunction(
      OkxHttp,
      'privateRequest',
      { data: [invalidPermissionsErrorMock], requestCount: 1 },
    )

    requestMock1
      .onFirstCall()
      .returns(Promise.reject(invalidPermissionsErrorMock))

    const { key: { permissions } } = await okxKeyModule.fetchDetails()

    expect(permissions.read).not.to.be.ok

  })



  it('should ensure user has trade permissions', async () => {

    ImportMock.mockOther(
      okxKeyModule,
      'exchange',
      {
        keySecret: {
          key: '',
          secret: '',
        },
      } as IAlunaExchange,
    )

    const invalidPermissionsErrorMock = {
      sCode: '51116',
    }

    ImportMock.mockFunction(
      OkxHttp,
      'privateRequest',
      { data: [invalidPermissionsErrorMock], requestCount: 1 },
    )


    const { key: { permissions } } = await okxKeyModule.fetchDetails()

    expect(permissions.trade).to.be.ok

  })



  it('should ensure user has trade permissions', async () => {

    ImportMock.mockOther(
      okxKeyModule,
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

    const requestResponse: IOkxKeySchema = {
      ...mockRest, // without accountId
    }

    const requestMock = ImportMock.mockFunction(
      OkxHttp,
      'privateRequest',
      { data: [requestResponse], requestCount: 1 },
    )

    requestMock.onSecondCall().returns(Promise.reject(alunaErrorMock))

    let error

    try {

      await okxKeyModule.fetchDetails()

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
      okxKeyModule,
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
      OkxHttp,
      'privateRequest',
      Promise.reject(alunaErrorMock),
    )

    let result
    let error

    try {

      result = await okxKeyModule.fetchDetails()

    } catch (e) {

      error = e

    }

    expect(result).not.to.be.ok

    expect(error).to.be.ok
    expect(error.message).to.be.eq('any-message')
    expect(error.httpStatusCode).to.be.eq(401)
    expect(error.code).to.be.eq(AlunaHttpErrorCodes.REQUEST_ERROR)

  })



  it('should parse Okx permissions just fine', async () => {

    const key: IOkxKeySchema = {
      accountId: dummyAccountId,
      read: true,
      trade: false,
      withdraw: false,
      margin: false,
    }

    const { key: perm1 } = okxKeyModule.parsePermissions({
      rawKey: key,
    })

    expect(perm1.read).to.be.ok
    expect(perm1.trade).not.to.be.ok
    expect(perm1.withdraw).not.to.be.ok

  })

})
