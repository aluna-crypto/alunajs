import { expect } from 'chai'
import { ImportMock } from 'ts-mock-imports'

import { AlunaError } from '../../../lib/core/AlunaError'
import { IAlunaExchange } from '../../../lib/core/IAlunaExchange'
import { ValrErrorEnum } from '../enums/ValrErrorEnum'
import {
  IValrKeySchema,
  ValrApiKeyPermissions,
} from '../schemas/IValrKeySchema'
import { ValrHttp } from '../ValrHttp'
import { ValrKeyModule } from './ValrKeyModule'



describe('ValrKeyModule', () => {

  const valrKeyModule = ValrKeyModule.prototype


  it('should validate user Valr API key just fine', async () => {

    const getPermissionsMock = ImportMock.mockFunction(
      valrKeyModule,
      'getPermissions',
    )

    getPermissionsMock
      .onFirstCall()
      .returns({ read: false })
      .onSecondCall()
      .returns({ read: true })


    const invalidKey = await valrKeyModule.validate()

    expect(getPermissionsMock.callCount).to.be.eq(1)
    expect(invalidKey).not.to.be.ok


    const validKey = await valrKeyModule.validate()


    expect(getPermissionsMock.callCount).to.be.eq(2)
    expect(validKey).to.be.ok

  })



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
      requestResponse,
    )

    const permissions1 = await valrKeyModule.getPermissions()

    expect(permissions1.read).not.to.be.ok
    expect(permissions1.trade).not.to.be.ok
    expect(permissions1.withdraw).not.to.be.ok

    expect(requestMock.callCount).to.be.eq(1)


    requestResponse.permissions = [ValrApiKeyPermissions.VIEW_ACCESS]

    const permissions2 = await valrKeyModule.getPermissions()


    expect(permissions2.read).to.be.ok
    expect(permissions2.trade).not.to.be.ok
    expect(permissions2.withdraw).not.to.be.ok

    expect(requestMock.callCount).to.be.eq(2)

    requestResponse.permissions = [
      ValrApiKeyPermissions.VIEW_ACCESS,
      ValrApiKeyPermissions.TRADE,
    ]

    const permissions3 = await valrKeyModule.getPermissions()

    requestResponse.permissions = [
      ValrApiKeyPermissions.VIEW_ACCESS,
      ValrApiKeyPermissions.TRADE,
      ValrApiKeyPermissions.WITHDRAW,
    ]

    expect(permissions3.read).to.be.ok
    expect(permissions3.trade).to.be.ok
    expect(permissions3.withdraw).not.to.be.ok

    expect(requestMock.callCount).to.be.eq(3)

  })



  it('should properly inform when api key or secret are wrong', async () => {

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

    ImportMock.mockFunction(
      ValrHttp,
      'privateRequest',
      Promise.reject(new AlunaError({
        message: ValrErrorEnum.INVALID_KEY,
        statusCode: 401,
      })),
    )

    let error
    let result

    try {

      result = await valrKeyModule.getPermissions()

    } catch (e) {

      error = e

    }

    expect(result).not.to.be.ok

    expect(error).to.be.ok
    expect(error.message).to.be.eq(ValrErrorEnum.INVALID_KEY)

  })



  it('should not allow API key with withdraw permission', async () => {

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
      permissions: [ValrApiKeyPermissions.WITHDRAW],
      addedAt: '2021-09-11T18:28:37.791401Z',
    }

    ImportMock.mockFunction(
      ValrHttp,
      'privateRequest',
      requestResponse,
    )

    let error
    let result

    try {

      result = await valrKeyModule.getPermissions()

    } catch (e) {

      error = e

    }

    expect(result).not.to.be.ok

    expect(error).to.be.ok
    expect(error.message)
      .to.be.eq('API key should not have withdraw permission.')

  })



  it('should parse Valr permissions just fine', async () => {

    const key: IValrKeySchema = {
      label: 'Development',
      permissions: [
        ValrApiKeyPermissions.VIEW_ACCESS,
      ],
      addedAt: '2021-09-11T18:28:37.791401Z',
    }

    const perm1 = valrKeyModule.parsePermissions({
      rawKey: key,
    })

    expect(perm1.read).to.be.ok
    expect(perm1.trade).not.to.be.ok
    expect(perm1.withdraw).not.to.be.ok


    key.permissions = [ValrApiKeyPermissions.TRADE]

    const perm2 = valrKeyModule.parsePermissions({
      rawKey: key,
    })


    expect(perm2.read).not.to.be.ok
    expect(perm2.trade).to.be.ok
    expect(perm2.withdraw).not.to.be.ok

  })

})
