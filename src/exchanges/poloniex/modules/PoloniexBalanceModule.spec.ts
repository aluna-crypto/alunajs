import { expect } from 'chai'
import { ImportMock } from 'ts-mock-imports'

import { IAlunaExchange } from '../../../lib/core/IAlunaExchange'
import { AlunaAccountEnum } from '../../../lib/enums/AlunaAccountEnum'
import { PoloniexHttp } from '../PoloniexHttp'
import { PoloniexCurrencyBalanceParser } from '../schemas/parsers/PoloniexCurrencyBalanceParser'
import {
  POLONIEX_PARSED_BALANCES,
  POLONIEX_RAW_BALANCES,
  POLONIEX_RAW_BALANCES_WITH_CURRENCY,
} from '../test/fixtures/poloniexBalance'
import { PoloniexBalanceModule } from './PoloniexBalanceModule'



describe('PoloniexBalanceModule', () => {

  const poloniexBalanceModule = PoloniexBalanceModule.prototype


  it('should list all Poloniex raw balances', async () => {

    ImportMock.mockOther(
      poloniexBalanceModule,
      'exchange',
      {
        keySecret: {
          key: '',
          secret: '',
        },
      } as IAlunaExchange,
    )

    const requestMock = ImportMock.mockFunction(
      PoloniexHttp,
      'privateRequest',
      POLONIEX_RAW_BALANCES,
    )

    const currencyParserMock = ImportMock.mockFunction(
      PoloniexCurrencyBalanceParser,
      'parse',
      POLONIEX_RAW_BALANCES_WITH_CURRENCY,
    )


    const rawBalances = await poloniexBalanceModule.listRaw()

    expect(requestMock.callCount).to.be.eq(1)

    expect(currencyParserMock.callCount).to.be.eq(1)
    expect(currencyParserMock.calledWith({
      rawBalances: POLONIEX_RAW_BALANCES,
    })).to.be.ok

    expect(rawBalances.length).to.eq(3)
    expect(rawBalances).to.deep.eq(POLONIEX_RAW_BALANCES_WITH_CURRENCY)

  })



  it('should list all Poloniex parsed balances', async () => {

    const rawListMock = ['arr-of-raw-balances']

    const listRawMock = ImportMock.mockFunction(
      PoloniexBalanceModule.prototype,
      'listRaw',
      rawListMock,
    )

    const parseManyMock = ImportMock.mockFunction(
      PoloniexBalanceModule.prototype,
      'parseMany',
      POLONIEX_PARSED_BALANCES,
    )

    const balances = await poloniexBalanceModule.list()


    expect(listRawMock.callCount).to.be.eq(1)

    expect(parseManyMock.callCount).to.be.eq(1)

    expect(parseManyMock.calledWithExactly({
      rawBalances: rawListMock,
    })).to.be.ok

    expect(balances.length).to.be.eq(2)
    expect(balances).to.deep.eq(POLONIEX_PARSED_BALANCES)

    balances.forEach((balance, index) => {

      const {
        account,
        available,
        symbolId,
        total,
      } = POLONIEX_PARSED_BALANCES[index]

      expect(balance.account).to.be.eq(account)
      expect(balance.available).to.be.eq(available)
      expect(balance.symbolId).to.be.eq(symbolId)
      expect(balance.total).to.be.eq(total)

    })

  })



  it('should parse a single Poloniex raw balance', () => {

    const parsedBalance1 = poloniexBalanceModule.parse({
      rawBalance: POLONIEX_RAW_BALANCES_WITH_CURRENCY[0],
    })

    const {
      available: amountAvailable,
      onOrders,
      currency,
    } = POLONIEX_RAW_BALANCES_WITH_CURRENCY[0]

    const available = parseFloat(amountAvailable)
    const total = available + parseFloat(onOrders)

    expect(parsedBalance1.symbolId).to.be.eq(currency)
    expect(parsedBalance1.account).to.be.eq(AlunaAccountEnum.EXCHANGE)
    expect(parsedBalance1.available).to.be.eq(available)
    expect(parsedBalance1.total).to.be.eq(total)


    const parsedBalance2 = poloniexBalanceModule.parse({
      rawBalance: POLONIEX_RAW_BALANCES_WITH_CURRENCY[1],
    })

    const rawBalance2 = POLONIEX_RAW_BALANCES_WITH_CURRENCY[1]

    const currency2 = rawBalance2.currency
    const available2 = parseFloat(
      rawBalance2.available,
    )
    const total2 = parseFloat(rawBalance2.available)
      + parseFloat(rawBalance2.onOrders)

    expect(parsedBalance2.account).to.be.eq(AlunaAccountEnum.EXCHANGE)
    expect(parsedBalance2.symbolId).to.be.eq(currency2)
    expect(parsedBalance2.available).to.be.eq(available2)
    expect(parsedBalance2.total).to.be.eq(total2)

  })



  it('should parse many Poloniex raw balances', async () => {

    const parseMock = ImportMock.mockFunction(
      PoloniexBalanceModule.prototype,
      'parse',
    )

    parseMock
      .onFirstCall()
      .returns(POLONIEX_PARSED_BALANCES[0])
      .onSecondCall()
      .returns(POLONIEX_PARSED_BALANCES[1])


    const parsedBalances = poloniexBalanceModule.parseMany({
      rawBalances: POLONIEX_RAW_BALANCES_WITH_CURRENCY,
    })


    expect(parseMock.callCount).to.be.eq(2)
    expect(parsedBalances.length).to.be.eq(2)

    parsedBalances.forEach((balance, index) => {

      const {
        account,
        available,
        symbolId,
        total,
      } = POLONIEX_PARSED_BALANCES[index]

      expect(balance.account).to.be.eq(account)
      expect(balance.available).to.be.eq(available)
      expect(balance.total).to.be.eq(total)
      expect(balance.symbolId).to.be.eq(symbolId)

    })

  })

})
