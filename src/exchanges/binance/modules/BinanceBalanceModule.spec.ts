import { expect } from 'chai'
import { ImportMock } from 'ts-mock-imports'

import { IAlunaExchange } from '../../../lib/core/IAlunaExchange'
import { AlunaAccountEnum } from '../../../lib/enums/AlunaAccountEnum'
import { AlunaHttpVerbEnum } from '../../../lib/enums/AlunaHtttpVerbEnum'
import { PROD_BINANCE_URL } from '../Binance'
import { BinanceHttp } from '../BinanceHttp'
import {
  BINANCE_PARSED_BALANCES,
  BINANCE_RAW_BALANCES,
} from '../test/fixtures/binanceBalance'
import { BinanceBalanceModule } from './BinanceBalanceModule'



describe('BinanceBalanceModule', () => {

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
      { balances: BINANCE_RAW_BALANCES},
    )


    const rawBalances = await binanceBalanceModule.listRaw()

    expect(requestMock.callCount).to.be.eq(1)
    expect(requestMock.calledWith({
      verb: AlunaHttpVerbEnum.GET,
      url: PROD_BINANCE_URL + '/api/v3/account',
      keySecret: exchangeMock.getValue().keySecret,
    })).to.be.ok

    expect(rawBalances.length).to.eq(3)
    expect(rawBalances).to.deep.eq(BINANCE_RAW_BALANCES)

    rawBalances.forEach((balance, index) => {

      const {
        asset,
        free,
        locked
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
      rawListMock,
    )

    const parseManyMock = ImportMock.mockFunction(
      BinanceBalanceModule.prototype,
      'parseMany',
      BINANCE_PARSED_BALANCES,
    )

    const balances = await binanceBalanceModule.list()


    expect(listRawMock.callCount).to.be.eq(1)

    expect(parseManyMock.callCount).to.be.eq(1)
    expect(parseManyMock.calledWith({
      rawBalances: rawListMock,
    })).to.be.ok

    expect(balances.length).to.be.eq(3)
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

    const parsedBalance1 = binanceBalanceModule.parse({
      rawBalance: BINANCE_RAW_BALANCES[0],
    })

    const { asset } = BINANCE_RAW_BALANCES[0]
    const available = parseFloat(BINANCE_RAW_BALANCES[0].free)
    const total = 
      parseFloat(BINANCE_RAW_BALANCES[0].free) +
      parseFloat(BINANCE_RAW_BALANCES[0].locked)

    expect(parsedBalance1.symbolId).to.be.eq(asset)
    expect(parsedBalance1.account).to.be.eq(AlunaAccountEnum.EXCHANGE)
    expect(parsedBalance1.available).to.be.eq(available)
    expect(parsedBalance1.total).to.be.eq(total)


    const parsedBalance2 = binanceBalanceModule.parse({
      rawBalance: BINANCE_RAW_BALANCES[1],
    })

    const currency2 = BINANCE_RAW_BALANCES[1].asset
    const available2 = parseFloat(BINANCE_RAW_BALANCES[1].free)
    const total2 = 
      parseFloat(BINANCE_RAW_BALANCES[1].free) + 
      parseFloat(BINANCE_RAW_BALANCES[1].locked)

    expect(parsedBalance2.account).to.be.eq(AlunaAccountEnum.EXCHANGE)
    expect(parsedBalance2.symbolId).to.be.eq(currency2)
    expect(parsedBalance2.available).to.be.eq(available2)
    expect(parsedBalance2.total).to.be.eq(total2)

  })



  it('should parse many Binance raw balances', async () => {

    const parseMock = ImportMock.mockFunction(
      BinanceBalanceModule.prototype,
      'parse',
    )

    parseMock
      .onFirstCall()
      .returns(BINANCE_PARSED_BALANCES[0])
      .onSecondCall()
      .returns(BINANCE_PARSED_BALANCES[1])
      .onThirdCall()
      .returns(BINANCE_PARSED_BALANCES[2])


    const parsedBalances = binanceBalanceModule.parseMany({
      rawBalances: BINANCE_RAW_BALANCES,
    })

    expect(BINANCE_RAW_BALANCES.length).to.be.eq(3)
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
