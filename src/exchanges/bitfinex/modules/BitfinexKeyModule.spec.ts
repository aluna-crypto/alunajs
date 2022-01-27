import { expect } from 'chai'
import { ImportMock } from 'ts-mock-imports'

import {
  AlunaError,
  AlunaHttpErrorCodes,
  AlunaKeyErrorCodes,
  IAlunaKeyPermissionSchema,
  IAlunaKeySchema,
} from '../../..'
import { IAlunaExchange } from '../../../lib/core/IAlunaExchange'
import { BitfinexHttp } from '../BitfinexHttp'
import { IBitfinexKey } from '../schemas/IBitfinexKeySchema'
import {
  BITFINEX_PARSED_KEY,
  BITFINEX_RAW_KEY,
} from '../test/fixtures/bitfinexKeys'
import { BitfinexKeyModule } from './BitfinexKeyModule'



describe('alunaPermissions', () => {

  const bitfinexKeyModule = BitfinexKeyModule.prototype

  const mockKeySecret = () => {

    ImportMock.mockOther(
      bitfinexKeyModule,
      'exchange',
      {
        keySecret: {
          key: '',
          secret: '',
        },
      } as IAlunaExchange,
    )

  }

  it('should fetch Bitfinex key details just fine', async () => {

    mockKeySecret()

    const resquestMock = ImportMock.mockFunction(
      BitfinexHttp,
      'privateRequest',
      Promise.resolve(BITFINEX_RAW_KEY),
    )

    const parseDetailsMock = ImportMock.mockFunction(
      bitfinexKeyModule,
      'parseDetails',
      Promise.resolve(BITFINEX_PARSED_KEY),
    )

    const keyDetails = await bitfinexKeyModule.fetchDetails()

    expect(resquestMock.callCount).to.be.eq(1)
    expect(parseDetailsMock.callCount).to.be.eq(1)

    expect(keyDetails).to.deep.eq(BITFINEX_PARSED_KEY)

  })

  it('should throw generic error if request goes wrong', async () => {

    mockKeySecret()

    let error: AlunaError | undefined
    let result: IAlunaKeySchema | undefined
    const errMsg = 'Something went wrong'

    const resquestMock = ImportMock.mockFunction(
      BitfinexHttp,
      'privateRequest',
      Promise.reject(new AlunaError({
        code: AlunaHttpErrorCodes.REQUEST_ERROR,
        message: errMsg,
        httpStatusCode: 500,
      })),
    )

    try {

      result = await bitfinexKeyModule.fetchDetails()

    } catch (e) {

      error = e

    }

    expect(result).not.to.be.ok
    expect(error?.code).to.be.eq(AlunaHttpErrorCodes.REQUEST_ERROR)
    expect(error?.httpStatusCode).to.be.eq(500)
    expect(error?.message).to.be.eq(errMsg)
    expect(resquestMock.callCount).to.be.eq(1)

  })

  it('should throw for invalid API based on the error message', async () => {

    mockKeySecret()

    const error1 = 'apikey: invalid'
    const error2 = 'apikey: digest invalid'

    let error: AlunaError | undefined
    let result: IAlunaKeySchema | undefined

    const resquestMock = ImportMock.mockFunction(
      BitfinexHttp,
      'privateRequest',
      Promise.reject(new AlunaError({
        code: AlunaHttpErrorCodes.REQUEST_ERROR,
        message: error1,
        httpStatusCode: 500,
      })),
    )

    try {

      result = await bitfinexKeyModule.fetchDetails()

    } catch (e) {

      error = e

    }

    expect(result).not.to.be.ok
    expect(error?.code).to.be.eq(AlunaKeyErrorCodes.INVALID)
    expect(error?.httpStatusCode).to.be.eq(200)
    expect(error?.message).to.be.eq(error1)
    expect(resquestMock.callCount).to.be.eq(1)

    // new mock
    resquestMock.returns(Promise.reject(new AlunaError({
      code: AlunaHttpErrorCodes.REQUEST_ERROR,
      message: error2,
      httpStatusCode: 500,
    })))

    try {

      result = await bitfinexKeyModule.fetchDetails()

    } catch (e) {

      error = e

    }

    expect(result).not.to.be.ok
    expect(error?.code).to.be.eq(AlunaKeyErrorCodes.INVALID)
    expect(error?.httpStatusCode).to.be.eq(200)
    expect(error?.message).to.be.eq(error2)
    expect(resquestMock.callCount).to.be.eq(2)

  })

  it('should parse Bitfinex key details just fine', () => {

    mockKeySecret()

    const parsePermissionsMock = ImportMock.mockFunction(
      bitfinexKeyModule,
      'parsePermissions',
      BITFINEX_PARSED_KEY.permissions,
    )

    const alunaKey = bitfinexKeyModule.parseDetails({
      rawKey: BITFINEX_RAW_KEY,
    })

    expect(alunaKey).to.deep.eq(BITFINEX_PARSED_KEY)
    expect(parsePermissionsMock.callCount).to.be.eq(1)

    // new mocking
    const newAlunaPermissions: IAlunaKeyPermissionSchema = {
      read: true,
      trade: false,
      withdraw: true,
    }

    const newBifinexKey: IBitfinexKey = [
      ['account', 1, 1],
      ['orders', 0, 1],
      ['funding', 0, 0],
      ['settings', 1, 1],
      ['wallets', 1, 0],
      ['withdraw', 1, 1],
    ]

    parsePermissionsMock.returns(newAlunaPermissions)

    const alunaKey2 = bitfinexKeyModule.parseDetails({
      rawKey: newBifinexKey,
    })

    expect(alunaKey2).to.deep.eq({
      permissions: newAlunaPermissions,
      accountId: undefined,
      meta: newBifinexKey,
    })
    expect(parsePermissionsMock.callCount).to.be.eq(2)

  })

  it('should parse Bitfinex key permissions just fine', () => {

    mockKeySecret()

    let bitfinexKey: IBitfinexKey = BITFINEX_RAW_KEY
    let alunaPermissions: IAlunaKeyPermissionSchema

    alunaPermissions = bitfinexKeyModule.parsePermissions({
      rawKey: BITFINEX_RAW_KEY,
    })

    expect(alunaPermissions).to.deep.eq(BITFINEX_PARSED_KEY.permissions)


    // new mocking
    bitfinexKey = [
      ['account', 1, 1],
      ['orders', 1, 0], // can read order but cannot create it
      ['funding', 1, 0],
      ['settings', 0, 0],
      ['wallets', 1, 0], // can read balances
      ['withdraw', 0, 1], // can withdraw
    ]

    alunaPermissions = bitfinexKeyModule.parsePermissions({
      rawKey: bitfinexKey,
    })

    expect(alunaPermissions).to.deep.eq({
      read: true,
      trade: false,
      withdraw: true,
    })

    // new mocking
    bitfinexKey = [
      ['account', 1, 1],
      ['orders', 0, 1], // cannot read order but can create it
      ['funding', 1, 0],
      ['settings', 0, 0],
      ['wallets', 1, 0], // can read balances
      ['withdraw', 0, 0], // cannot withdraw
    ]

    alunaPermissions = bitfinexKeyModule.parsePermissions({
      rawKey: bitfinexKey,
    })

    expect(alunaPermissions).to.deep.eq({
      read: false,
      trade: true,
      withdraw: false,
    })

    // new mocking
    bitfinexKey = [
      ['account', 1, 1],
      ['orders', 0, 0], // cannot read or create orders
      ['funding', 1, 0],
      ['settings', 0, 0],
      ['wallets', 0, 0], // cannot read balances
      ['withdraw', 0, 0], // cannot withdraw
    ]

    alunaPermissions = bitfinexKeyModule.parsePermissions({
      rawKey: bitfinexKey,
    })

    expect(alunaPermissions).to.deep.eq({
      read: false,
      trade: false,
      withdraw: false,
    })

  })

})

