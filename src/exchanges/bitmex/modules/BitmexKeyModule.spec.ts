import { expect } from 'chai'
import {
  map,
  omit,
} from 'lodash'
import { ImportMock } from 'ts-mock-imports'

import { AlunaError } from '../../../lib/core/AlunaError'
import { IAlunaExchange } from '../../../lib/core/IAlunaExchange'
import { AlunaHttpErrorCodes } from '../../../lib/errors/AlunaHttpErrorCodes'
import { AlunaKeyErrorCodes } from '../../../lib/errors/AlunaKeyErrorCodes'
import { IAlunaKeySecretSchema } from '../../../lib/schemas/IAlunaKeySecretSchema'
import { BitmexHttp } from '../BitmexHttp'
import { IBitmexKeysSchema } from '../schemas/IBitmexKeysSchema'
import { BitmexKeyModule } from './BitmexKeyModule'



describe('BitmexKeyModule', () => {

  const userId = 777
  const apiKey = 'my-api-key'
  const secret = 'my-api-secret'

  const keySecret: IAlunaKeySecretSchema = {
    key: apiKey,
    secret,
  }

  const bitmexKeyModule = BitmexKeyModule.prototype

  const mockExchange = () => {

    const exchangeMock = ImportMock.mockOther(
      bitmexKeyModule,
      'exchange',
      {
        keySecret,
      } as IAlunaExchange,
    )

    return { exchangeMock }

  }

  it('should fetch permissions details from Bitmex Key just fine', async () => {

    mockExchange()

    const rawKey: IBitmexKeysSchema = [
      {
        id: apiKey,
        secret,
        name: 'my_api',
        nonce: 0,
        cidr: '0.0.0.0/0',
        permissions: [],
        enabled: true,
        userId,
        created: '2021-12-27T16:14:43.760Z',
      },
      {
        id: apiKey,
        secret,
        name: 'my_api_2',
        nonce: 0,
        cidr: '0.0.0.0/0',
        permissions: [],
        enabled: true,
        userId,
        created: '2021-12-27T16:14:43.760Z',
      },
    ]

    const requestMock = ImportMock.mockFunction(
      BitmexHttp,
      'privateRequest',
      rawKey,
    )

    const expectedAccountId = userId.toString()

    // first
    const parsedKey1 = await bitmexKeyModule.fetchDetails()

    const expectedMeta1 = map(rawKey, (k) => omit(k, 'secret'))

    expect(parsedKey1.accountId).to.be.eq(expectedAccountId)

    expect(parsedKey1.permissions.read).to.be.ok
    expect(parsedKey1.permissions.trade).not.to.be.ok
    expect(parsedKey1.permissions.withdraw).not.to.be.ok
    expect(parsedKey1.meta).to.deep.eq(expectedMeta1)

    expect(requestMock.callCount).to.be.eq(1)

    // second
    rawKey[0].permissions = ['orderRead']

    const parsedKey2 = await bitmexKeyModule.fetchDetails()

    const expectedMeta2 = map(rawKey, (k) => omit(k, 'secret'))

    expect(parsedKey2.accountId).to.be.eq(expectedAccountId)

    expect(parsedKey2.permissions.read).to.be.ok
    expect(parsedKey2.permissions.trade).not.to.be.ok
    expect(parsedKey2.permissions.withdraw).not.to.be.ok

    expect(parsedKey2.meta).to.deep.eq(expectedMeta2)

    expect(requestMock.callCount).to.be.eq(2)

    // third
    rawKey[0].permissions = ['order']


    const parsedKey3 = await bitmexKeyModule.fetchDetails()

    const expectedMeta3 = map(rawKey, (k) => omit(k, 'secret'))

    expect(parsedKey3.accountId).to.be.eq(expectedAccountId)

    expect(parsedKey3.permissions.read).to.be.ok
    expect(parsedKey3.permissions.trade).to.be.ok
    expect(parsedKey3.permissions.withdraw).not.to.be.ok

    expect(parsedKey3.meta).to.deep.eq(expectedMeta3)

    expect(requestMock.callCount).to.be.eq(3)

    // forth
    rawKey[0].permissions = ['withdraw', 'order']


    const parsedKey4 = await bitmexKeyModule.fetchDetails()

    const expectedMeta4 = map(rawKey, (k) => omit(k, 'secret'))

    expect(parsedKey4.accountId).to.be.eq(expectedAccountId)

    expect(parsedKey4.permissions.read).to.be.ok
    expect(parsedKey4.permissions.trade).to.be.ok
    expect(parsedKey4.permissions.withdraw).to.be.ok

    expect(parsedKey4.meta).to.deep.eq(expectedMeta4)

    expect(requestMock.callCount).to.be.eq(4)

  })

  it('should properly handle request error for fetchDetails', async () => {

    const message = 'Invalid API Key.'

    let mockedError = new AlunaError({
      httpStatusCode: 401,
      message,
      code: AlunaHttpErrorCodes.REQUEST_ERROR,
    })

    ImportMock.mockOther(
      bitmexKeyModule,
      'exchange',
      {
        keySecret: {
          key: '',
          secret: '',
        },
      } as IAlunaExchange,
    )

    const privateRequestMock = ImportMock.mockFunction(
      BitmexHttp,
      'privateRequest',
      Promise.reject(mockedError),
    )

    let error: AlunaError | undefined
    let result

    try {

      result = await bitmexKeyModule.fetchDetails()

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

      result = await bitmexKeyModule.fetchDetails()

    } catch (e) {

      error = e

    }

    expect(result).not.to.be.ok

    expect(error).to.be.ok
    expect(error!.code).to.be.eq(AlunaHttpErrorCodes.REQUEST_ERROR)
    expect(error!.message).to.be.eq(mockedError.message)
    expect(error!.httpStatusCode).to.be.eq(500)

  })

  it('should parse Bitmex permissions just fine', async () => {

    mockExchange()

    const rawKey: IBitmexKeysSchema = [
      {
        id: apiKey,
        name: 'my_api',
        nonce: 0,
        cidr: '0.0.0.0/0',
        permissions: ['order'],
        enabled: true,
        userId: 700,
        created: '2021-12-27T16:14:43.760Z',
      },
      {
        id: 'api_key_2',
        name: 'my_api',
        nonce: 0,
        cidr: '0.0.0.0/0',
        permissions: ['withdraw'],
        enabled: false,
        userId: 700,
        created: '2021-12-27T16:14:43.760Z',
      },
      {
        id: 'api_key_3',
        name: 'my_api',
        nonce: 0,
        cidr: '0.0.0.0/0',
        permissions: ['orderRead'],
        enabled: true,
        userId: 700,
        created: '2021-12-27T16:14:43.760Z',
      },
    ]

    const perm1 = bitmexKeyModule.parsePermissions({
      rawKey,
    })

    expect(perm1.read).to.be.ok
    expect(perm1.trade).to.be.ok
    expect(perm1.withdraw).not.to.be.ok

    // new mocking
    rawKey[0].permissions = ['orderRead']

    const perm2 = bitmexKeyModule.parsePermissions({
      rawKey,
    })

    expect(perm2.read).to.be.ok
    expect(perm2.trade).not.to.be.ok
    expect(perm2.withdraw).not.to.be.ok


    // new mocking
    rawKey[0].permissions = []

    const perm3 = bitmexKeyModule.parsePermissions({
      rawKey,
    })

    expect(perm3.read).to.be.ok
    expect(perm3.trade).not.to.be.ok
    expect(perm3.withdraw).not.to.be.ok


    // new mocking
    rawKey[0].permissions = ['withdraw']

    const perm4 = bitmexKeyModule.parsePermissions({
      rawKey,
    })

    expect(perm4.read).to.be.ok
    expect(perm4.trade).not.to.be.ok
    expect(perm4.withdraw).to.be.ok

  })

})
