import { expect } from 'chai'
import { ImportMock } from 'ts-mock-imports'

import { AlunaError } from '../../../lib/core/AlunaError'
import { IAlunaExchange } from '../../../lib/core/IAlunaExchange'
import { AlunaHttpErrorCodes } from '../../../lib/errors/AlunaHttpErrorCodes'
import { PoloniexHttp } from '../PoloniexHttp'
import { IPoloniexKeySchema } from '../schemas/IPoloniexKeySchema'
import { PoloniexKeyModule } from './PoloniexKeyModule'



describe('PoloniexKeyModule', () => {

  const poloniexKeyModule = PoloniexKeyModule.prototype

  it('should get permissions from Poloniex API key just fine', async () => {

    ImportMock.mockOther(
      poloniexKeyModule,
      'exchange',
      {
        keySecret: {
          key: '',
          secret: '',
        },
      } as IAlunaExchange,
    )

    const mockRest: any = {} // mock requestResponse

    const requestResponse: IPoloniexKeySchema = {
      ...mockRest, // without accountId
    }

    const requestMock = ImportMock.mockFunction(
      PoloniexHttp,
      'privateRequest',
      {
        data: requestResponse,
        apiRequestCount: 1,
      },
    )

    const badRequestErrorMock = new AlunaError({
      code: 'any-code',
      message: 'any-message',
      httpStatusCode: 422,
      metadata: {
        code: 'BAD_REQUEST',
      },
    })

    requestMock.onFirstCall().returns(Promise.reject(badRequestErrorMock))

    const { key: { permissions } } = await poloniexKeyModule.fetchDetails()

    expect(permissions.read).to.be.ok
    expect(permissions.trade).to.be.ok
    expect(permissions.withdraw).not.to.be.ok

    expect(requestMock.callCount).to.be.eq(1)

  })


  it('should ensure user has trade permissions', async () => {

    ImportMock.mockOther(
      poloniexKeyModule,
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

    const requestResponse: IPoloniexKeySchema = {
      ...mockRest, // without accountId
    }

    const requestMock1 = ImportMock.mockFunction(
      PoloniexHttp,
      'privateRequest',
      {
        data: requestResponse,
        apiRequestCount: 1,
      },
    )

    requestMock1
      .onFirstCall()
      .returns(Promise.reject(invalidPermissionsErrorMock))


    const { key } = await poloniexKeyModule.fetchDetails()

    expect(key.permissions.trade).not.to.be.ok

  })



  it('should ensure user has trade permissions', async () => {

    ImportMock.mockOther(
      poloniexKeyModule,
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

    const requestResponse: IPoloniexKeySchema = {
      ...mockRest, // without accountId
    }

    const requestMock = ImportMock.mockFunction(
      PoloniexHttp,
      'privateRequest',
      {
        data: requestResponse,
        apiRequestCount: 1,
      },
    )

    requestMock.onFirstCall().returns(Promise.reject(alunaErrorMock))

    let error

    try {

      await poloniexKeyModule.fetchDetails()

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
      poloniexKeyModule,
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
      PoloniexHttp,
      'privateRequest',
      Promise.reject(alunaErrorMock),
    )

    let result
    let error

    try {

      const { key } = await poloniexKeyModule.fetchDetails()

      result = key

    } catch (e) {

      error = e

    }

    expect(result).not.to.be.ok

    expect(error).to.be.ok
    expect(error.message).to.be.eq('any-message')
    expect(error.httpStatusCode).to.be.eq(401)
    expect(error.code).to.be.eq(AlunaHttpErrorCodes.REQUEST_ERROR)

  })



  it('should parse Poloniex permissions just fine', async () => {

    const key: IPoloniexKeySchema = {
      read: true,
      trade: false,
      withdraw: false,
    }

    const { key: perm1 } = poloniexKeyModule.parsePermissions({
      rawKey: key,
    })

    expect(perm1.read).to.be.ok
    expect(perm1.trade).not.to.be.ok
    expect(perm1.withdraw).not.to.be.ok

  })

})
