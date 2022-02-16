import { expect } from 'chai'
import { ImportMock } from 'ts-mock-imports'

import { AlunaError } from '../../../lib/core/AlunaError'
import { IAlunaExchange } from '../../../lib/core/IAlunaExchange'
import { AlunaHttpErrorCodes } from '../../../lib/errors/AlunaHttpErrorCodes'
import { BinanceHttp } from '../BinanceHttp'
import { BinanceLog } from '../BinanceLog'
import {
  BinanceApiKeyPermissions,
  IBinanceKeyAccountSchema,
} from '../schemas/IBinanceKeySchema'
import { BinanceKeyModule } from './BinanceKeyModule'



describe('BinanceKeyModule', () => {

  const binanceKeyModule = BinanceKeyModule.prototype

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
      ...mockRest,
    }

    const requestMock = ImportMock.mockFunction(
      BinanceHttp,
      'privateRequest',
      requestResponse,
    )

    const { permissions: permissions1 } = await binanceKeyModule.fetchDetails()

    expect(permissions1.read).not.to.be.ok
    expect(permissions1.trade).not.to.be.ok
    expect(permissions1.withdraw).not.to.be.ok

    expect(requestMock.callCount).to.be.eq(1)


    requestResponse.permissions = [BinanceApiKeyPermissions.SPOT]

    const { permissions: permissions2 } = await binanceKeyModule.fetchDetails()


    expect(permissions2.read).to.be.ok
    expect(permissions2.trade).to.be.ok
    expect(permissions2.withdraw).not.to.be.ok

    expect(requestMock.callCount).to.be.eq(2)

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
        message: 'any-message',
        httpStatusCode: 401,
        code: AlunaHttpErrorCodes.REQUEST_ERROR,
      })),
    )

    let result
    let error

    try {

      result = await binanceKeyModule.fetchDetails()

    } catch (err) {

      error = err

    }

    expect(result).not.to.be.ok

    expect(error).to.be.ok
    expect(error.message).to.be.eq('any-message')
    expect(error.httpStatusCode).to.be.eq(401)
    expect(error.code).to.be.eq(AlunaHttpErrorCodes.REQUEST_ERROR)


  })



  it('should parse Binance permissions just fine', async () => {

    const mockRest: any = {} // mock requestResponse

    const key: IBinanceKeyAccountSchema = {
      permissions: [
        BinanceApiKeyPermissions.SPOT,
      ],
      canTrade: true,
      ...mockRest,
    }

    const perm1 = binanceKeyModule.parsePermissions({
      rawKey: key,
    })

    expect(perm1.read).to.be.ok
    expect(perm1.trade).to.be.ok
    expect(perm1.withdraw).not.to.be.ok

  })



  it('should fall on default case for parse', async () => {

    const mockRest: any = {} // mock requestResponse

    const logInfoMock = ImportMock.mockFunction(BinanceLog, 'info', {
      concat: () => '',
    })

    const key: IBinanceKeyAccountSchema = {
      permissions: [
        'non-existent',
      ],
      canTrade: true,
      ...mockRest,
    }

    const perm1 = binanceKeyModule.parsePermissions({
      rawKey: key,
    })

    expect(logInfoMock.callCount).to.be.eq(1)
    expect(perm1.read).not.to.be.ok
    expect(perm1.trade).not.to.be.ok
    expect(perm1.withdraw).not.not.to.be.ok

  })

})
