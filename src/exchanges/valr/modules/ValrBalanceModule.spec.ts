import { expect } from 'chai'
import { ImportMock } from 'ts-mock-imports'

import { IAlunaExchange } from '../../../lib/core/IAlunaExchange'
import { AlunaAccountEnum } from '../../../lib/enums/AlunaAccountEnum'
import { AlunaHttpVerbEnum } from '../../../lib/enums/AlunaHtttpVerbEnum'
import { mockAlunaSymbolMapping } from '../../../utils/mappings/AlunaSymbolMapping.mock'
import {
  VALR_PARSED_BALANCES,
  VALR_RAW_BALANCES,
} from '../test/fixtures/valrBalance'
import { ValrHttp } from '../ValrHttp'
import { ValrBalanceModule } from './ValrBalanceModule'



describe('ValrBalanceModule', () => {

  const valrBalanceModule = ValrBalanceModule.prototype

  it('should list all Valr raw balances', async () => {

    const exchangeMock = ImportMock.mockOther(
      valrBalanceModule,
      'exchange',
      {
        keySecret: {
          key: '',
          secret: '',
        },
      } as IAlunaExchange,
    )

    const requestMock = ImportMock.mockFunction(
      ValrHttp,
      'privateRequest',
      VALR_RAW_BALANCES,
    )

    const rawBalances = await valrBalanceModule.listRaw()

    expect(requestMock.callCount).to.be.eq(1)
    expect(requestMock.calledWith({
      verb: AlunaHttpVerbEnum.GET,
      url: 'https://api.valr.com/v1/account/balances',
      keySecret: exchangeMock.getValue().keySecret,
    })).to.be.ok

    expect(rawBalances.length).to.eq(5)
    expect(rawBalances).to.deep.eq(VALR_RAW_BALANCES)

    rawBalances.forEach((balance, index) => {

      const {
        available,
        currency,
        reserved,
        total,
        updatedAt,
      } = VALR_RAW_BALANCES[index]

      expect(balance.currency).to.be.eq(currency)
      expect(balance.available).to.be.eq(available)
      expect(balance.reserved).to.be.eq(reserved)
      expect(balance.total).to.be.eq(total)
      expect(balance.updatedAt).to.be.eq(updatedAt)

    })

  })

  it('should list all Valr parsed balances', async () => {

    const rawListMock = ['arr-of-raw-balances']

    const listRawMock = ImportMock.mockFunction(
      ValrBalanceModule.prototype,
      'listRaw',
      rawListMock,
    )

    const parseManyMock = ImportMock.mockFunction(
      ValrBalanceModule.prototype,
      'parseMany',
      VALR_PARSED_BALANCES,
    )

    const balances = await valrBalanceModule.list()

    expect(listRawMock.callCount).to.be.eq(1)

    expect(parseManyMock.callCount).to.be.eq(1)
    expect(parseManyMock.calledWith({
      rawBalances: rawListMock,
    })).to.be.ok

    expect(balances.length).to.be.eq(4)
    expect(balances).to.deep.eq(VALR_PARSED_BALANCES)

    balances.forEach((balance, index) => {

      const {
        account,
        available,
        symbolId,
        total,
      } = VALR_PARSED_BALANCES[index]

      expect(balance.account).to.be.eq(account)
      expect(balance.available).to.be.eq(available)
      expect(balance.symbolId).to.be.eq(symbolId)
      expect(balance.total).to.be.eq(total)

    })

  })

  it('should parse a single Valr raw balance', () => {

    const translateSymbolId = 'BTC'

    const { alunaSymbolMappingMock } = mockAlunaSymbolMapping()

    alunaSymbolMappingMock.returns(translateSymbolId)

    const rawBalance1 = VALR_RAW_BALANCES[0]
    const rawBalance2 = VALR_RAW_BALANCES[1]

    const parsedBalance1 = valrBalanceModule.parse({
      rawBalance: rawBalance1,
    })

    const { currency } = rawBalance1
    const available = parseFloat(rawBalance1.available)
    const total = parseFloat(rawBalance1.total)

    expect(parsedBalance1.symbolId).to.be.eq(translateSymbolId)
    expect(parsedBalance1.account).to.be.eq(AlunaAccountEnum.EXCHANGE)
    expect(parsedBalance1.available).to.be.eq(available)
    expect(parsedBalance1.total).to.be.eq(total)

    expect(alunaSymbolMappingMock.callCount).to.be.eq(1)
    expect(alunaSymbolMappingMock.args[0][0]).to.deep.eq({
      exchangeSymbolId: currency,
      symbolMappings: {},
    })


    const parsedBalance2 = valrBalanceModule.parse({
      rawBalance: rawBalance2,
    })

    const currency2 = rawBalance2.currency
    const available2 = parseFloat(rawBalance2.available)
    const total2 = parseFloat(rawBalance2.total)

    expect(parsedBalance2.account).to.be.eq(AlunaAccountEnum.EXCHANGE)
    expect(parsedBalance2.symbolId).to.be.eq(translateSymbolId)
    expect(parsedBalance2.available).to.be.eq(available2)
    expect(parsedBalance2.total).to.be.eq(total2)

    expect(alunaSymbolMappingMock.callCount).to.be.eq(2)
    expect(alunaSymbolMappingMock.args[1][0]).to.deep.eq({
      exchangeSymbolId: currency2,
      symbolMappings: {},
    })

  })

  it('should parse many Valr raw balances', async () => {

    const parseMock = ImportMock.mockFunction(
      ValrBalanceModule.prototype,
      'parse',
    )

    parseMock
      .onFirstCall()
      .returns(VALR_PARSED_BALANCES[0])
      .onSecondCall()
      .returns(VALR_PARSED_BALANCES[1])
      .onThirdCall()
      .returns(VALR_PARSED_BALANCES[2])

    const parsedBalances = valrBalanceModule.parseMany({
      rawBalances: VALR_RAW_BALANCES,
    })

    /**
     * Seed has 5 raw balances but 2 of them have 'total' property equal to 0.
     * ParseMany should not call parse when total is equal/less than 0
     */
    expect(VALR_RAW_BALANCES.length).to.be.eq(5)
    expect(parseMock.callCount).to.be.eq(3)
    expect(parsedBalances.length).to.be.eq(3)

    parsedBalances.forEach((balance, index) => {

      const {
        account,
        available,
        symbolId,
        total,
      } = VALR_PARSED_BALANCES[index]

      expect(balance.account).to.be.eq(account)
      expect(balance.available).to.be.eq(available)
      expect(balance.total).to.be.eq(total)
      expect(balance.symbolId).to.be.eq(symbolId)

    })

  })

})
