import BigNumber from 'bignumber.js'
import { expect } from 'chai'
import { ImportMock } from 'ts-mock-imports'

import { IAlunaExchange } from '../../../lib/core/IAlunaExchange'
import { AlunaAccountEnum } from '../../../lib/enums/AlunaAccountEnum'
import { AlunaHttpVerbEnum } from '../../../lib/enums/AlunaHtttpVerbEnum'
import { mockAlunaSymbolMapping } from '../../../utils/mappings/AlunaSymbolMapping.mock'
import { BinanceHttp } from '../BinanceHttp'
import { PROD_BINANCE_URL } from '../BinanceSpecs'
import {
  BINANCE_PARSED_BALANCES,
  BINANCE_RAW_BALANCES,
} from '../test/fixtures/binanceBalance'
import { BinanceBalanceModule } from './BinanceBalanceModule'



describe('BinanceBalanceModule', () => {

  // TODO: Review usage of 'ImportMock.mockClass'
  const binanceBalanceModule = BinanceBalanceModule.prototype


  it('should list all Binance raw balances', async () => {

    const exchangeMock = ImportMock.mockOther(
      binanceBalanceModule,
      'exchange',
      {
        keySecret: {
          key: '',
          secret: '',
        },
      } as IAlunaExchange,
    )

    const requestMock = ImportMock.mockFunction(
      BinanceHttp,
      'privateRequest',
      { data: { balances: BINANCE_RAW_BALANCES }, apiRequestCount: 1 },
    )


    const {
      rawBalances,
      apiRequestCount,
    } = await binanceBalanceModule.listRaw()

    expect(requestMock.callCount).to.be.eq(1)
    expect(requestMock.calledWith({
      verb: AlunaHttpVerbEnum.GET,
      url: `${PROD_BINANCE_URL}/api/v3/account`,
      keySecret: exchangeMock.getValue().keySecret,
    })).to.be.ok

    expect(apiRequestCount).to.eq(1)

    expect(rawBalances.length).to.eq(4)
    expect(rawBalances).to.deep.eq(BINANCE_RAW_BALANCES)

    rawBalances.forEach((balance, index) => {

      const {
        asset,
        free,
        locked,
      } = BINANCE_RAW_BALANCES[index]

      expect(balance.asset).to.be.eq(asset)
      expect(balance.free).to.be.eq(free)
      expect(balance.locked).to.be.eq(locked)

    })

  })



  it('should list all Binance parsed balances', async () => {

    const rawListMock = ['arr-of-raw-balances']

    const listRawMock = ImportMock.mockFunction(
      BinanceBalanceModule.prototype,
      'listRaw',
      { rawBalances: rawListMock, apiRequestCount: 1 },
    )

    const parseManyMock = ImportMock.mockFunction(
      BinanceBalanceModule.prototype,
      'parseMany',
      { balances: BINANCE_PARSED_BALANCES, apiRequestCount: 1 },
    )

    const { balances, apiRequestCount } = await binanceBalanceModule.list()

    expect(apiRequestCount).to.be.eq(4)

    expect(listRawMock.callCount).to.be.eq(1)

    expect(parseManyMock.callCount).to.be.eq(1)

    expect(parseManyMock.calledWithExactly({
      rawBalances: rawListMock,
    })).to.be.ok

    expect(balances.length).to.be.eq(4)
    expect(balances).to.deep.eq(BINANCE_PARSED_BALANCES)

    balances.forEach((balance, index) => {

      const {
        account,
        available,
        symbolId,
        total,
      } = BINANCE_PARSED_BALANCES[index]

      expect(balance.account).to.be.eq(account)
      expect(balance.available).to.be.eq(available)
      expect(balance.symbolId).to.be.eq(symbolId)
      expect(balance.total).to.be.eq(total)

    })

  })



  it('should parse a single Binance raw balance', () => {

    const translateSymbolId = 'BTC'

    const { alunaSymbolMappingMock } = mockAlunaSymbolMapping()

    alunaSymbolMappingMock.returns(translateSymbolId)

    const rawBalance1 = BINANCE_RAW_BALANCES[0]
    const rawBalance2 = BINANCE_RAW_BALANCES[1]

    const { balance: parsedBalance1 } = binanceBalanceModule.parse({
      rawBalance: rawBalance1,
    })

    const {
      asset,
      free,
      locked,
    } = rawBalance1

    const available = Number(free)
    const total = new BigNumber(available)
      .plus(Number(locked))
      .toNumber()

    expect(parsedBalance1.symbolId).to.be.eq(translateSymbolId)
    expect(parsedBalance1.account).to.be.eq(AlunaAccountEnum.EXCHANGE)
    expect(parsedBalance1.available).to.be.eq(available)
    expect(parsedBalance1.total).to.be.eq(total)

    expect(alunaSymbolMappingMock.callCount).to.be.eq(1)
    expect(alunaSymbolMappingMock.args[0][0]).to.deep.eq({
      exchangeSymbolId: asset,
      symbolMappings: {},
    })


    const { balance: parsedBalance2 } = binanceBalanceModule.parse({
      rawBalance: rawBalance2,
    })

    const available2 = Number(rawBalance2.free)
    const total2 = new BigNumber(available2)
      .plus(Number(rawBalance2.locked))
      .toNumber()

    expect(parsedBalance2.account).to.be.eq(AlunaAccountEnum.EXCHANGE)
    expect(parsedBalance2.symbolId).to.be.eq(translateSymbolId)
    expect(parsedBalance2.available).to.be.eq(available2)
    expect(parsedBalance2.total).to.be.eq(total2)

    expect(alunaSymbolMappingMock.callCount).to.be.eq(2)
    expect(alunaSymbolMappingMock.args[1][0]).to.deep.eq({
      exchangeSymbolId: rawBalance2.asset,
      symbolMappings: {},
    })

  })



  it('should parse many Binance raw balances', async () => {

    const parseMock = ImportMock.mockFunction(
      BinanceBalanceModule.prototype,
      'parse',
    )

    parseMock
      .onFirstCall()
      .returns({ balance: BINANCE_PARSED_BALANCES[0] })
      .onSecondCall()
      .returns({ balance: BINANCE_PARSED_BALANCES[1] })
      .onThirdCall()
      .returns({ balance: BINANCE_PARSED_BALANCES[2] })


    const { balances: parsedBalances } = binanceBalanceModule.parseMany({
      rawBalances: BINANCE_RAW_BALANCES,
    })

    expect(parseMock.callCount).to.be.eq(3)
    expect(parsedBalances.length).to.be.eq(3)

    parsedBalances.forEach((balance, index) => {

      const {
        account,
        available,
        symbolId,
        total,
      } = BINANCE_PARSED_BALANCES[index]

      expect(balance.account).to.be.eq(account)
      expect(balance.available).to.be.eq(available)
      expect(balance.total).to.be.eq(total)
      expect(balance.symbolId).to.be.eq(symbolId)

    })

  })

})
