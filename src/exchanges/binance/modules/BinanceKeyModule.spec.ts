import { expect } from 'chai'
import { ImportMock } from 'ts-mock-imports'

import { AlunaError } from '../../../lib/core/AlunaError'
import { IAlunaExchange } from '../../../lib/core/IAlunaExchange'
import { BinanceHttp } from '../BinanceHttp'
import { BinanceErrorEnum } from '../enums/BinanceErrorEnum'
import {
  BinanceApiKeyPermissions,
  IBinanceKeyAccountSchema,
} from '../schemas/IBinanceKeySchema'
import { BinanceKeyModule } from './BinanceKeyModule'



describe('BinanceKeyModule', () => {

  const binanceKeyModule = BinanceKeyModule.prototype


  it('should validate user Binance API key just fine', async () => {

    const getPermissionsMock = ImportMock.mockFunction(
      binanceKeyModule,
      'getPermissions',
    )

    getPermissionsMock
      .onFirstCall()
      .returns(Promise.resolve({ read: false }))
      .onSecondCall()
      .returns(Promise.resolve({ read: true }))


    const invalidKey = await binanceKeyModule.validate()

    expect(getPermissionsMock.callCount).to.be.eq(1)
    expect(invalidKey).not.to.be.ok


    const validKey = await binanceKeyModule.validate()


    expect(getPermissionsMock.callCount).to.be.eq(2)
    expect(validKey).to.be.ok

  })



  it('should get permissions from Binance API key just fine', async () => {

    ImportMock.mockOther(
      binanceKeyModule,
      'exchange',
      {
        keySecret: {
          key: '',
          secret: '',
        },
      } as IAlunaExchange,
    )

    const mockRest: any = {} // mock requestResponse

    const requestResponse: IBinanceKeyAccountSchema = {
      permissions: [],
      canTrade: true,
      ...mockRest
    }

    const requestMock = ImportMock.mockFunction(
      BinanceHttp,
      'privateRequest',
      requestResponse,
    )

    const permissions1 = await binanceKeyModule.getPermissions()

    expect(permissions1.read).not.to.be.ok
    expect(permissions1.trade).not.to.be.ok
    expect(permissions1.withdraw).not.to.be.ok

    expect(requestMock.callCount).to.be.eq(1)


    requestResponse.permissions = [BinanceApiKeyPermissions.SPOT]

    const permissions2 = await binanceKeyModule.getPermissions()


    expect(permissions2.read).to.be.ok
    expect(permissions2.trade).to.be.ok
    expect(permissions2.withdraw).not.to.be.ok

    expect(requestMock.callCount).to.be.eq(2)

  })



  it('should not allow API KEYS with withdraw permission', async () => {

    let error
    let result

    ImportMock.mockOther(
      binanceKeyModule,
      'exchange',
      {
        keySecret: {
          key: '',
          secret: '',
        },
      } as IAlunaExchange,
    )

    const mockRest: any = {} // mock requestResponse

    const requestResponse: IBinanceKeyAccountSchema = {
      permissions: [
        BinanceApiKeyPermissions.SPOT,
        BinanceApiKeyPermissions.WITHDRAW,
      ],
      canTrade: true,
      ...mockRest
    }

    const requestMock = ImportMock.mockFunction(
      BinanceHttp,
      'privateRequest',
      requestResponse,
    )

    try {

      result = await binanceKeyModule.getPermissions()

    } catch (err) {

      error = err

    }

    const msg = 'API key should not have withdraw permission.'

    expect(result).not.to.be.ok
    expect(error.message).to.be.eq(msg)

    expect(requestMock.callCount).to.be.eq(1)

  })



  it('should properly inform when api key or secret are wrong', async () => {

    ImportMock.mockOther(
      binanceKeyModule,
      'exchange',
      {
        keySecret: {
          key: '',
          secret: '',
        },
      } as IAlunaExchange,
    )

    ImportMock.mockFunction(
      BinanceHttp,
      'privateRequest',
      Promise.reject(new AlunaError({
        message: BinanceErrorEnum.INVALID_KEY,
        statusCode: 401,
      })),
    )

    let error
    let result

    try {

      result = await binanceKeyModule.getPermissions()

    } catch (e) {

      error = e

    }

    expect(result).not.to.be.ok

    expect(error).to.be.ok
    expect(error.message).to.be.eq(BinanceErrorEnum.INVALID_KEY)

  })



  it('should not allow API key with withdraw permission', async () => {

    ImportMock.mockOther(
      binanceKeyModule,
      'exchange',
      {
        keySecret: {
          key: '',
          secret: '',
        },
      } as IAlunaExchange,
    )

    const mockRest: any = {} // mock requestResponse
    const requestResponse: IBinanceKeyAccountSchema = {
      permissions: [BinanceApiKeyPermissions.WITHDRAW],
      ...mockRest
    }

    ImportMock.mockFunction(
      BinanceHttp,
      'privateRequest',
      requestResponse,
    )

    let error
    let result

    try {

      result = await binanceKeyModule.getPermissions()

    } catch (e) {

      error = e

    }

    expect(result).not.to.be.ok

    const msg = 'API key should not have withdraw permission.'

    expect(error).to.be.ok
    expect(error.message).to.be.eq(msg)

  })



  it('should parse Binance permissions just fine', async () => {

    const mockRest: any = {} // mock requestResponse

    const key: IBinanceKeyAccountSchema = {
      permissions: [
        BinanceApiKeyPermissions.SPOT
      ],
      canTrade: true,
      ...mockRest
    }

    const perm1 = binanceKeyModule.parsePermissions({
      rawKey: key,
    })

    expect(perm1.read).to.be.ok
    expect(perm1.trade).to.be.ok
    expect(perm1.withdraw).not.to.be.ok

  })

})
