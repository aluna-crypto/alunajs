import { expect } from 'chai'
import { each } from 'lodash'
import { ImportMock } from 'ts-mock-imports'

import { IAlunaExchange } from '../../../lib/core/IAlunaExchange'
import { AlunaAccountEnum } from '../../../lib/enums/AlunaAccountEnum'
import { mockAlunaSymbolMapping } from '../../../utils/mappings/AlunaSymbolMapping.mock'
import { PoloniexHttp } from '../PoloniexHttp'
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
      {
        data: POLONIEX_RAW_BALANCES,
        apiRequestCount: 1,
      },
    )

    const {
      rawBalances,
      apiRequestCount,
    } = await poloniexBalanceModule.listRaw()

    expect(apiRequestCount).to.be.eq(2)

    expect(requestMock.callCount).to.be.eq(1)

    expect(rawBalances).to.deep.eq(POLONIEX_RAW_BALANCES_WITH_CURRENCY)

  })



  it('should list all Poloniex parsed balances', async () => {

    const rawListMock = ['arr-of-raw-balances']

    const listRawMock = ImportMock.mockFunction(
      PoloniexBalanceModule.prototype,
      'listRaw',
      {
        rawBalances: rawListMock,
        apiRequestCount: 1,
      },
    )

    const parseManyMock = ImportMock.mockFunction(
      PoloniexBalanceModule.prototype,
      'parseMany',
      {
        balances: POLONIEX_PARSED_BALANCES,
        apiRequestCount: 1,
      },
    )

    const { balances } = await poloniexBalanceModule.list()


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

    const translateSymbolId = 'BTC'

    const { alunaSymbolMappingMock } = mockAlunaSymbolMapping()

    const { balance: parsedBalance1 } = poloniexBalanceModule.parse({
      rawBalance: POLONIEX_RAW_BALANCES_WITH_CURRENCY[0],
    })

    const {
      available: amountAvailable,
      onOrders,
    } = POLONIEX_RAW_BALANCES_WITH_CURRENCY[0]

    const available = parseFloat(amountAvailable)
    const total = available + parseFloat(onOrders)

    expect(parsedBalance1.symbolId).to.be.eq(translateSymbolId)
    expect(parsedBalance1.account).to.be.eq(AlunaAccountEnum.EXCHANGE)
    expect(parsedBalance1.available).to.be.eq(available)
    expect(parsedBalance1.total).to.be.eq(total)

    expect(alunaSymbolMappingMock.callCount).to.be.eq(1)

    const { balance: parsedBalance2 } = poloniexBalanceModule.parse({
      rawBalance: POLONIEX_RAW_BALANCES_WITH_CURRENCY[1],
    })

    const rawBalance2 = POLONIEX_RAW_BALANCES_WITH_CURRENCY[1]

    const available2 = parseFloat(
      rawBalance2.available,
    )
    const total2 = parseFloat(rawBalance2.available)
      + parseFloat(rawBalance2.onOrders)

    expect(parsedBalance2.account).to.be.eq(AlunaAccountEnum.EXCHANGE)
    expect(parsedBalance2.symbolId).to.be.eq(translateSymbolId)
    expect(parsedBalance2.available).to.be.eq(available2)
    expect(parsedBalance2.total).to.be.eq(total2)

    expect(alunaSymbolMappingMock.callCount).to.be.eq(2)

  })



  it('should parse many Poloniex raw balances', async () => {

    const parseMock = ImportMock.mockFunction(
      PoloniexBalanceModule.prototype,
      'parse',
    )

    parseMock
      .onFirstCall()
      .returns({
        balance: POLONIEX_PARSED_BALANCES[0],
        apiRequestCount: 1,
      })
      .onSecondCall()
      .returns({
        balance: POLONIEX_PARSED_BALANCES[1],
        apiRequestCount: 1,
      })


    const { balances: parsedBalances } = poloniexBalanceModule.parseMany({
      rawBalances: POLONIEX_RAW_BALANCES_WITH_CURRENCY,
    })

    expect(parseMock.callCount).to.be.eq(2)
    expect(parseMock.callCount).to.be.eq(2)

    each(parsedBalances, (parsedBalance, index) => {

      const rawBalance = POLONIEX_RAW_BALANCES[parsedBalance.symbolId]

      expect(parseMock.args[index][0]).to.deep.eq({
        rawBalance: {
          currency: parsedBalance.symbolId,
          ...rawBalance,
        },
      })

    })

    expect(parsedBalances.length).to.be.eq(2)
    expect(parsedBalances).to.deep.eq(POLONIEX_PARSED_BALANCES)


  })

})
