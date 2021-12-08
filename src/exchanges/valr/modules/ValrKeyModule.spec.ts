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

    // first
    const { permissions: permissions1 } = await valrKeyModule.fetchDetails()

    expect(permissions1.read).not.to.be.ok
    expect(permissions1.trade).not.to.be.ok
    expect(permissions1.withdraw).not.to.be.ok

    expect(requestMock.callCount).to.be.eq(1)


    // second
    requestResponse.permissions = [ValrApiKeyPermissions.VIEW_ACCESS]

    const { permissions: permissions2 } = await valrKeyModule.fetchDetails()


    expect(permissions2.read).to.be.ok
    expect(permissions2.trade).not.to.be.ok
    expect(permissions2.withdraw).not.to.be.ok

    expect(requestMock.callCount).to.be.eq(2)


    // third
    requestResponse.permissions = [
      ValrApiKeyPermissions.VIEW_ACCESS,
      ValrApiKeyPermissions.TRADE,
    ]

    const { permissions: permissions3 } = await valrKeyModule.fetchDetails()

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

    const { permissions: permissions4 } = await valrKeyModule.fetchDetails()

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

    const { permissions: permissions5 } = await valrKeyModule.fetchDetails()

    expect(permissions5.read).to.be.ok
    expect(permissions5.trade).to.be.ok
    expect(permissions5.withdraw).to.be.ok

    expect(requestMock.callCount).to.be.eq(5)

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
        statusCode: 401,
        data: {
          error: ValrErrorEnum.INVALID_KEY,
        },
      })),
    )

    let error: AlunaError | undefined
    let result

    try {

      result = await valrKeyModule.fetchDetails()

    } catch (e) {

      error = e as AlunaError

    }

    expect(result).not.to.be.ok

    expect(error).to.be.ok
    expect(error?.data.error).to.be.eq(ValrErrorEnum.INVALID_KEY)

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
