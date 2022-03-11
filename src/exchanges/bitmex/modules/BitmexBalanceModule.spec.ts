import BigNumber from 'bignumber.js'
import { expect } from 'chai'
import { each } from 'lodash'
import { ImportMock } from 'ts-mock-imports'

import { mockExchangeModule } from '../../../../test/helpers/exchange'
import { mockPrivateHttpRequest } from '../../../../test/helpers/http'
import { AlunaHttpVerbEnum } from '../../../lib/enums/AlunaHtttpVerbEnum'
import { AlunaGenericErrorCodes } from '../../../lib/errors/AlunaGenericErrorCodes'
import { executeAndCatch } from '../../../utils/executeAndCatch'
import { AlunaSymbolMapping } from '../../../utils/mappings/AlunaSymbolMapping'
import { BitmexHttp } from '../BitmexHttp'
import { PROD_BITMEX_URL } from '../BitmexSpecs'
import { BitmexBalanceParser } from '../schemas/parsers/BitmexBalanceParser'
import {
  BITMEX_PARSED_BALANCES,
  BITMEX_RAW_BALANCES,
} from '../test/bitmexBalances'
import { BITMEX_PARSED_MARKETS } from '../test/bitmexMarkets'
import { BitmexBalanceModule } from './BitmexBalanceModule'
import { BitmexMarketModule } from './BitmexMarketModule'



describe('BitmexBalanceModule', () => {

  const bitmexBalanceModule = BitmexBalanceModule.prototype

  it('should properly list Bitmex raw balances', async () => {

    const { exchangeMock } = mockExchangeModule({
      module: bitmexBalanceModule,
    })

    const { requestMock } = mockPrivateHttpRequest({
      exchangeHttp: BitmexHttp,
      requestResponse: Promise.resolve(BITMEX_RAW_BALANCES),
    })

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

  it('should properly get tradable balance', async () => {

    const symbolPair = 'XBTUSD'
    const mockedBalance = BITMEX_PARSED_BALANCES[0]
    const mockedLeverage = 0

    const market = BITMEX_PARSED_MARKETS[0]

    const getMarketMock = ImportMock.mockFunction(
      BitmexMarketModule,
      'get',
      Promise.resolve(market),
    )

    const listMock = ImportMock.mockFunction(
      bitmexBalanceModule,
      'list',
      Promise.resolve([mockedBalance]),
    )

    const translateSymbolIdMock = ImportMock.mockFunction(
      AlunaSymbolMapping,
      'translateSymbolId',
      mockedBalance.symbolId,
    )

    const { exchangeMock } = mockExchangeModule({
      module: bitmexBalanceModule,
      overrides: {
        position: {
          getLeverage: () => Promise.resolve(mockedLeverage),
        } as any,
      },
    })

    const expectedLeverage = new BigNumber(mockedBalance.available)
      .times(1)
      .toNumber()

    const leverage = await bitmexBalanceModule.getTradableBalance({
      symbolPair,
    })

    expect(leverage).to.be.eq(expectedLeverage)

    expect(getMarketMock.callCount).to.be.eq(1)
    expect(getMarketMock.args[0][0]).to.deep.eq({
      symbolPair,
    })

    expect(listMock.callCount).to.be.eq(1)
    expect(translateSymbolIdMock.callCount).to.be.eq(1)

    exchangeMock.restore()

    const mockedLeverage2 = 5

    mockExchangeModule({
      module: bitmexBalanceModule,
      overrides: {
        position: {
          getLeverage: () => Promise.resolve(mockedLeverage2),
        } as any,
      },
    })


    const expectedLeverage2 = new BigNumber(mockedBalance.available)
      .times(mockedLeverage2)
      .toNumber()

    const leverage2 = await bitmexBalanceModule.getTradableBalance({
      symbolPair,
    })

    expect(leverage2).to.be.eq(expectedLeverage2)

    expect(getMarketMock.callCount).to.be.eq(2)

    expect(listMock.callCount).to.be.eq(2)
    expect(translateSymbolIdMock.callCount).to.be.eq(2)

  })

  it(
    'should return 0 if there is no tradable balance available for symbol pair',
    async () => {

      const symbolPair = 'XBTUSD'
      const mockedBalance = BITMEX_PARSED_BALANCES[0]

      const market = BITMEX_PARSED_MARKETS[0]

      const getMarketMock = ImportMock.mockFunction(
        BitmexMarketModule,
        'get',
        Promise.resolve(market),
      )

      const listMock = ImportMock.mockFunction(
        bitmexBalanceModule,
        'list',
        Promise.resolve([]),
      )

      const translateSymbolIdMock = ImportMock.mockFunction(
        AlunaSymbolMapping,
        'translateSymbolId',
        mockedBalance.symbolId,
      )

      const expectedLeverage = 0

      const leverage = await bitmexBalanceModule.getTradableBalance({
        symbolPair,
      })

      expect(leverage).to.be.eq(expectedLeverage)

      expect(getMarketMock.callCount).to.be.eq(1)
      expect(getMarketMock.args[0][0]).to.deep.eq({
        symbolPair,
      })

      expect(listMock.callCount).to.be.eq(1)
      expect(translateSymbolIdMock.callCount).to.be.eq(1)

    },
  )

  it(
    "should ensure 'getTradableBalance' validate its specific params",
    async () => {

      const {
        error,
        result,
      } = await executeAndCatch(async () => bitmexBalanceModule
        .getTradableBalance({} as any))

      expect(result).not.to.be.ok

      expect(error!.code).to.be.eq(AlunaGenericErrorCodes.PARAM_ERROR)
      expect(error!.message).to.be.eq('"symbolPair" is required')

    },
  )

})
