import { expect } from 'chai'
import { ImportMock } from 'ts-mock-imports'

import { AlunaError } from '../../../lib/core/AlunaError'
import { IAlunaExchange } from '../../../lib/core/IAlunaExchange'
import { AlunaHttpErrorCodes } from '../../../lib/errors/AlunaHttpErrorCodes'
import { AlunaKeyErrorCodes } from '../../../lib/errors/AlunaKeyErrorCodes'
import {
  IValrKeySchema,
  ValrApiKeyPermissions,
} from '../schemas/IValrKeySchema'
import { ValrHttp } from '../ValrHttp'
import { ValrKeyModule } from './ValrKeyModule'



describe('ValrKeyModule', () => {

  const valrKeyModule = ValrKeyModule.prototype

  it('should get permissions from Valr API key just fine', async () => {

    ImportMock.mockOther(
      valrKeyModule,
      'exchange',
      {
        keySecret: {
          key: '',
          secret: '',
        },
      } as IAlunaExchange,
    )

    const requestResponse: IValrKeySchema = {
      label: 'Api for aluna',
      permissions: [],
      addedAt: '2021-09-11T18:28:37.791401Z',
    }

    const requestMock = ImportMock.mockFunction(
      ValrHttp,
      'privateRequest',
      {
        data: requestResponse,
        apiRequestCount: 1,
      },
    )

    // first
    const {
      key: {
        permissions: permissions1,
      },
    } = await valrKeyModule.fetchDetails()

    expect(permissions1.read).not.to.be.ok
    expect(permissions1.trade).not.to.be.ok
    expect(permissions1.withdraw).not.to.be.ok

    expect(requestMock.callCount).to.be.eq(1)

    // second
    requestResponse.permissions = [ValrApiKeyPermissions.VIEW_ACCESS]

    const {
      key: {
        permissions: permissions2,
      },
    } = await valrKeyModule.fetchDetails()

    expect(permissions2.read).to.be.ok
    expect(permissions2.trade).not.to.be.ok
    expect(permissions2.withdraw).not.to.be.ok

    expect(requestMock.callCount).to.be.eq(2)

    // third
    requestResponse.permissions = [
      ValrApiKeyPermissions.VIEW_ACCESS,
      ValrApiKeyPermissions.TRADE,
    ]

    const {
      key: {
        permissions: permissions3,
      },
    } = await valrKeyModule.fetchDetails()

    expect(permissions3.read).to.be.ok
    expect(permissions3.trade).to.be.ok
    expect(permissions3.withdraw).not.to.be.ok

    expect(requestMock.callCount).to.be.eq(3)

    // forth
    requestResponse.permissions = [
      ValrApiKeyPermissions.VIEW_ACCESS,
      ValrApiKeyPermissions.TRADE,
      'NEW_ADDED_PERSSION' as ValrApiKeyPermissions,
    ]

    const {
      key: {
        permissions: permissions4,
      },
    } = await valrKeyModule.fetchDetails()

    expect(permissions4.read).to.be.ok
    expect(permissions4.trade).to.be.ok
    expect(permissions4.withdraw).not.to.be.ok

    expect(requestMock.callCount).to.be.eq(4)

    // fifth
    requestResponse.permissions = [
      ValrApiKeyPermissions.VIEW_ACCESS,
      ValrApiKeyPermissions.TRADE,
      ValrApiKeyPermissions.WITHDRAW,
    ]

    const {
      key: {
        permissions: permissions5,
      },
    } = await valrKeyModule.fetchDetails()

    expect(permissions5.read).to.be.ok
    expect(permissions5.trade).to.be.ok
    expect(permissions5.withdraw).to.be.ok

    expect(requestMock.callCount).to.be.eq(5)

  })

  it('should properly handle request error for fetchDetails', async () => {

    const message = 'API key or secret is invalid'

    let mockedError = new AlunaError({
      httpStatusCode: 401,
      message,
      code: AlunaHttpErrorCodes.REQUEST_ERROR,
    })

    ImportMock.mockOther(
      valrKeyModule,
      'exchange',
      {
        keySecret: {
          key: '',
          secret: '',
        },
      } as IAlunaExchange,
    )

    const privateRequestMock = ImportMock.mockFunction(
      ValrHttp,
      'privateRequest',
      Promise.reject(mockedError),
    )

    let error: AlunaError | undefined
    let result

    try {

      result = await valrKeyModule.fetchDetails()

    } catch (e) {

      error = e

    }

    expect(result).not.to.be.ok

    expect(error).to.be.ok
    expect(error?.code).to.be.eq(AlunaKeyErrorCodes.INVALID)
    expect(error?.message).to.be.eq(mockedError.message)
    expect(error?.httpStatusCode).to.be.eq(401)


    mockedError = new AlunaError({
      code: 'any-code',
      message: 'any-message',
      httpStatusCode: 403,
    })

    privateRequestMock.returns(Promise.reject(mockedError))

    try {

      result = await valrKeyModule.fetchDetails()

    } catch (e) {

      error = e

    }

    expect(result).not.to.be.ok

    expect(error).to.be.ok
    expect(error?.code).to.be.eq(AlunaHttpErrorCodes.REQUEST_ERROR)
    expect(error?.message).to.be.eq(mockedError.message)
    expect(error?.httpStatusCode).to.be.eq(500)

  })

  it('should parse Valr permissions just fine', async () => {

    const key: IValrKeySchema = {
      label: 'Development',
      permissions: [
        ValrApiKeyPermissions.VIEW_ACCESS,
      ],
      addedAt: '2021-09-11T18:28:37.791401Z',
    }

    const { key: perm1 } = valrKeyModule.parsePermissions({
      rawKey: key,
    })

    expect(perm1.read).to.be.ok
    expect(perm1.trade).not.to.be.ok
    expect(perm1.withdraw).not.to.be.ok

    key.permissions = [ValrApiKeyPermissions.TRADE]

    const { key: perm2 } = valrKeyModule.parsePermissions({
      rawKey: key,
    })

    expect(perm2.read).not.to.be.ok
    expect(perm2.trade).to.be.ok
    expect(perm2.withdraw).not.to.be.ok

  })

})
