import BigNumber from 'bignumber.js'
import { expect } from 'chai'
import {
  each,
  filter,
} from 'lodash'
import { ImportMock } from 'ts-mock-imports'

import { IAlunaExchange } from '../../../lib/core/IAlunaExchange'
import { AlunaHttpVerbEnum } from '../../../lib/enums/AlunaHtttpVerbEnum'
import { AlunaHttpErrorCodes } from '../../../lib/errors/AlunaHttpErrorCodes'
import { BitmexHttp } from '../BitmexHttp'
import { PROD_BITMEX_URL } from '../BitmexSpecs'
import { BitmexBalanceParser } from '../schemas/parsers/BitmexBalanceParser'
import {
  BITMEX_PARSED_BALANCES,
  BITMEX_RAW_BALANCES,
} from '../test/bitmexBalances'
import { BITMEX_RAW_SYMBOLS } from '../test/bitmexSymbols'
import { BitmexBalanceModule } from './BitmexBalanceModule'
import { BitmexMarketModule } from './BitmexMarketModule'



describe('BitmexBalanceModule', () => {

  const bitmexBalanceModule = BitmexBalanceModule.prototype

  it('should properly list Bitmex raw balances', async () => {

    const exchangeMock = ImportMock.mockOther(
      bitmexBalanceModule,
      'exchange',
      {
        keySecret: {
          key: '',
          secret: '',
        },
      } as IAlunaExchange,
    )

    const requestMock = ImportMock.mockFunction(
      BitmexHttp,
      'privateRequest',
      BITMEX_RAW_BALANCES,
    )

    const rawBalances = await bitmexBalanceModule.listRaw()

    expect(requestMock.callCount).to.be.eq(1)
    expect(requestMock.calledWith({
      verb: AlunaHttpVerbEnum.GET,
      url: `${PROD_BITMEX_URL}/user/margin`,
      body: { currency: 'all' },
      keySecret: exchangeMock.getValue().keySecret,
    })).to.be.ok

    expect(rawBalances.length).to.eq(BITMEX_RAW_BALANCES.length)
    expect(rawBalances).to.deep.eq(BITMEX_RAW_BALANCES)

  })

  it('should properly list Bitmex parsed balances', async () => {

    const listRawMock = ImportMock.mockFunction(
      bitmexBalanceModule,
      'listRaw',
      BITMEX_RAW_BALANCES,
    )

    const parseManyMock = ImportMock.mockFunction(
      bitmexBalanceModule,
      'parseMany',
      BITMEX_PARSED_BALANCES,
    )

    const balances = await bitmexBalanceModule.list()

    expect(listRawMock.callCount).to.be.eq(1)

    expect(parseManyMock.callCount).to.be.eq(1)
    expect(parseManyMock.calledWith({
      rawBalances: BITMEX_RAW_BALANCES,
    })).to.be.ok

    expect(balances).to.deep.eq(BITMEX_PARSED_BALANCES)

  })

  it('should properly parse a Bitmex raw balance', () => {

    const balanceParserMock = ImportMock.mockFunction(
      BitmexBalanceParser,
      'parse',
    )

    each(BITMEX_PARSED_BALANCES, (parsedBalance, i) => {

      balanceParserMock.onCall(i).returns(parsedBalance)

    })

    each(BITMEX_RAW_BALANCES, (rawBalance, i) => {

      const parsedBalance = bitmexBalanceModule.parse({
        rawBalance,
      })

      expect(parsedBalance).to.be.eq(BITMEX_PARSED_BALANCES[i])

      expect(balanceParserMock.callCount).to.be.eq(i + 1)
      expect(balanceParserMock.args[i][0]).to.deep.eq({ rawBalance })

    })

  })

  it('should properly parse many Bitmex raw balances', async () => {

    const parseMock = ImportMock.mockFunction(
      bitmexBalanceModule,
      'parse',
    )

    each(BITMEX_PARSED_BALANCES, (parsedBalance, i) => {

      parseMock.onCall(i).returns(parsedBalance)

    })

    const parsedBalances = bitmexBalanceModule.parseMany({
      rawBalances: BITMEX_RAW_BALANCES,
    })

    expect(parseMock.callCount).to.be.eq(BITMEX_RAW_BALANCES.length)

    expect(parsedBalances).to.deep.eq(BITMEX_PARSED_BALANCES)

  })

  it('should properly get tradable balance for XBt', async () => {

    const symbolPair = 'XBTUSD'
    const mockedBalance = BITMEX_PARSED_BALANCES[0]
    const mockedLeverage = 1

    const [rawMarket] = filter(BITMEX_RAW_SYMBOLS, (s) => {

      return s.settlCurrency === 'XBt'

    })

    const getRawMock = ImportMock.mockFunction(
      BitmexMarketModule,
      'getRaw',
      Promise.resolve(rawMarket),
    )

    const listMock = ImportMock.mockFunction(
      bitmexBalanceModule,
      'list',
      Promise.resolve([mockedBalance]),
    )

    ImportMock.mockOther(
      bitmexBalanceModule,
      'exchange',
      {
        position: {
          getLeverage: () => Promise.resolve(mockedLeverage),
        } as any,
      },
    )

    const expectedLeverage = new BigNumber(mockedBalance.available)
      .times(mockedLeverage)
      .toNumber()

    const leverage = await bitmexBalanceModule.getTradableBalance({
      symbolPair,
    })

    expect(leverage).to.be.eq(expectedLeverage)

    expect(getRawMock.callCount).to.be.eq(1)
    expect(getRawMock.args[0][0]).to.deep.eq({
      symbolPair,
    })

    expect(listMock.callCount).to.be.eq(1)

  })

  it('should properly get tradable balance for USDt', async () => {

    const symbolPair = 'XBTUSDT'
    const mockedBalance = BITMEX_PARSED_BALANCES[1]
    const mockedLeverage = 0

    const [rawMarket] = filter(BITMEX_RAW_SYMBOLS, (s) => {

      return s.settlCurrency === 'USDt'

    })

    const getRawMock = ImportMock.mockFunction(
      BitmexMarketModule,
      'getRaw',
      Promise.resolve(rawMarket),
    )

    const listMock = ImportMock.mockFunction(
      bitmexBalanceModule,
      'list',
      Promise.resolve([mockedBalance]),
    )

    ImportMock.mockOther(
      bitmexBalanceModule,
      'exchange',
      {
        position: {
          getLeverage: () => Promise.resolve(mockedLeverage),
        } as any,
      },
    )

    const expectedTradableBalance = mockedBalance.available

    const tradableBalance = await bitmexBalanceModule.getTradableBalance({
      symbolPair,
    })

    expect(tradableBalance).to.be.eq(expectedTradableBalance)

    expect(getRawMock.callCount).to.be.eq(1)
    expect(getRawMock.args[0][0]).to.deep.eq({
      symbolPair,
    })

    expect(listMock.callCount).to.be.eq(1)

  })

  it('should throw error if balance is not found for symbol', async () => {

    let error
    let result

    const symbolPair = 'XBTUSD'
    const mockedLeverage = 1

    const [rawMarket] = filter(BITMEX_RAW_SYMBOLS, (s) => {

      return s.settlCurrency === 'XBt'

    })

    const getRawMock = ImportMock.mockFunction(
      BitmexMarketModule,
      'getRaw',
      Promise.resolve(rawMarket),
    )

    const listMock = ImportMock.mockFunction(
      bitmexBalanceModule,
      'list',
      Promise.resolve([]),
    )

    ImportMock.mockOther(
      bitmexBalanceModule,
      'exchange',
      {
        position: {
          getLeverage: () => Promise.resolve(mockedLeverage),
        } as any,
      },
    )

    try {

      result = await bitmexBalanceModule.getTradableBalance({
        symbolPair,
      })

    } catch (err) {

      error = err

    }

    expect(result).not.to.be.ok

    const msg = `No available balance found for asset: ${symbolPair}`

    expect(error).to.be.ok
    expect(error.code).to.be.eq(AlunaHttpErrorCodes.REQUEST_ERROR)
    expect(error.message).to.be.eq(msg)

    expect(getRawMock.callCount).to.be.eq(1)
    expect(getRawMock.args[0][0]).to.deep.eq({
      symbolPair,
    })

    expect(listMock.callCount).to.be.eq(1)

  })

})
