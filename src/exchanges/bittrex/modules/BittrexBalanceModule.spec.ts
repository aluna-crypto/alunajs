import { expect } from 'chai'
import { ImportMock } from 'ts-mock-imports'

import { IAlunaExchange } from '../../../lib/core/IAlunaExchange'
import { AlunaAccountEnum } from '../../../lib/enums/AlunaAccountEnum'
import { AlunaHttpVerbEnum } from '../../../lib/enums/AlunaHtttpVerbEnum'
import { mockAlunaSymbolMapping } from '../../../utils/mappings/AlunaSymbolMapping.mock'
import { BittrexHttp } from '../BittrexHttp'
import { PROD_BITTREX_URL } from '../BittrexSpecs'
import {
  BITTREX_PARSED_BALANCES,
  BITTREX_RAW_BALANCES,
} from '../test/fixtures/bittrexBalance'
import { BittrexBalanceModule } from './BittrexBalanceModule'



describe('BittrexBalanceModule', () => {

  const bittrexBalanceModule = BittrexBalanceModule.prototype


  it('should list all Bittrex raw balances', async () => {

    const exchangeMock = ImportMock.mockOther(
      bittrexBalanceModule,
      'exchange',
      {
        keySecret: {
          key: '',
          secret: '',
        },
      } as IAlunaExchange,
    )

    const requestMock = ImportMock.mockFunction(
      BittrexHttp,
      'privateRequest',
      { data: BITTREX_RAW_BALANCES, apiRequestCount: 1 },
    )

    const { rawBalances } = await bittrexBalanceModule.listRaw()

    expect(requestMock.callCount).to.be.eq(1)
    expect(requestMock.calledWith({
      verb: AlunaHttpVerbEnum.GET,
      url: `${PROD_BITTREX_URL}/balances`,
      keySecret: exchangeMock.getValue().keySecret,
    })).to.be.ok

    expect(rawBalances.length).to.eq(4)
    expect(rawBalances).to.deep.eq(BITTREX_RAW_BALANCES)

  })



  it('should list all Bittrex parsed balances', async () => {

    const rawListMock = ['arr-of-raw-balances']

    const listRawMock = ImportMock.mockFunction(
      BittrexBalanceModule.prototype,
      'listRaw',
      { rawBalances: rawListMock, apiRequestCount: 1 },
    )

    const parseManyMock = ImportMock.mockFunction(
      BittrexBalanceModule.prototype,
      'parseMany',
      { balances: BITTREX_PARSED_BALANCES, apiRequestCount: 1 },
    )

    const { balances, apiRequestCount } = await bittrexBalanceModule.list()

    expect(apiRequestCount).to.be.eq(4)

    expect(listRawMock.callCount).to.be.eq(1)

    expect(parseManyMock.callCount).to.be.eq(1)

    expect(parseManyMock.calledWithExactly({
      rawBalances: rawListMock,
    })).to.be.ok

    expect(balances.length).to.be.eq(3)
    expect(balances).to.deep.eq(BITTREX_PARSED_BALANCES)

    balances.forEach((balance, index) => {

      const {
        account,
        available,
        symbolId,
        total,
      } = BITTREX_PARSED_BALANCES[index]

      expect(balance.account).to.be.eq(account)
      expect(balance.available).to.be.eq(available)
      expect(balance.symbolId).to.be.eq(symbolId)
      expect(balance.total).to.be.eq(total)

    })

  })



  it('should parse a single Bittrex raw balance', () => {

    const translatedSymbolId = 'ETH'

    const rawBalance1 = BITTREX_RAW_BALANCES[0]
    const rawBalance2 = BITTREX_RAW_BALANCES[1]

    const { alunaSymbolMappingMock } = mockAlunaSymbolMapping({
      returnSymbol: translatedSymbolId,
    })

    const { balance: parsedBalance1 } = bittrexBalanceModule.parse({
      rawBalance: rawBalance1,
    })

    const {
      available: amountAvailable,
      total: totalAmount,
    } = rawBalance1

    const available = Number(amountAvailable)
    const total = Number(totalAmount)

    expect(parsedBalance1.symbolId).to.be.eq(translatedSymbolId)
    expect(parsedBalance1.account).to.be.eq(AlunaAccountEnum.EXCHANGE)
    expect(parsedBalance1.available).to.be.eq(available)
    expect(parsedBalance1.total).to.be.eq(total)

    expect(alunaSymbolMappingMock.callCount).to.be.eq(1)
    expect(alunaSymbolMappingMock.args[0][0]).to.deep.eq({
      exchangeSymbolId: rawBalance1.currencySymbol,
      symbolMappings: {},
    })


    const { balance: parsedBalance2 } = bittrexBalanceModule.parse({
      rawBalance: rawBalance2,
    })

    const available2 = parseFloat(rawBalance2.available)
    const total2 = parseFloat(rawBalance2.total)

    expect(parsedBalance2.account).to.be.eq(AlunaAccountEnum.EXCHANGE)
    expect(parsedBalance2.symbolId).to.be.eq(translatedSymbolId)
    expect(parsedBalance2.available).to.be.eq(available2)
    expect(parsedBalance2.total).to.be.eq(total2)

    expect(alunaSymbolMappingMock.callCount).to.be.eq(2)
    expect(alunaSymbolMappingMock.args[1][0]).to.deep.eq({
      exchangeSymbolId: rawBalance2.currencySymbol,
      symbolMappings: {},
    })

  })



  it('should parse many Bittrex raw balances', async () => {

    const parseMock = ImportMock.mockFunction(
      BittrexBalanceModule.prototype,
      'parse',
    )

    parseMock
      .onFirstCall()
      .returns({ balance: BITTREX_PARSED_BALANCES[0], apiRequestCount: 1 })
      .onSecondCall()
      .returns({ balance: BITTREX_PARSED_BALANCES[1], apiRequestCount: 1 })
      .onThirdCall()
      .returns({ balance: BITTREX_PARSED_BALANCES[2], apiRequestCount: 1 })


    const { balances: parsedBalances } = bittrexBalanceModule.parseMany({
      rawBalances: BITTREX_RAW_BALANCES,
    })


    expect(parseMock.callCount).to.be.eq(3)
    expect(parsedBalances.length).to.be.eq(3)

    parsedBalances.forEach((balance, index) => {

      const {
        account,
        available,
        symbolId,
        total,
      } = BITTREX_PARSED_BALANCES[index]

      expect(balance.account).to.be.eq(account)
      expect(balance.available).to.be.eq(available)
      expect(balance.total).to.be.eq(total)
      expect(balance.symbolId).to.be.eq(symbolId)

    })

  })

})
