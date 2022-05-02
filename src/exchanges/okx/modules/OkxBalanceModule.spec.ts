import BigNumber from 'bignumber.js'
import { expect } from 'chai'
import { ImportMock } from 'ts-mock-imports'

import { IAlunaExchange } from '../../../lib/core/IAlunaExchange'
import { AlunaAccountEnum } from '../../../lib/enums/AlunaAccountEnum'
import { AlunaHttpVerbEnum } from '../../../lib/enums/AlunaHtttpVerbEnum'
import { mockAlunaSymbolMapping } from '../../../utils/mappings/AlunaSymbolMapping.mock'
import { OkxHttp } from '../OkxHttp'
import { PROD_OKX_URL } from '../OkxSpecs'
import { OKX_PARSED_BALANCES, OKX_RAW_BALANCES } from '../test/fixtures/okxBalance'
import { OkxBalanceModule } from './OkxBalanceModule'



describe('OkxBalanceModule', () => {

  const okxBalanceModule = OkxBalanceModule.prototype


  it('should list all Okx raw balances', async () => {

    const exchangeMock = ImportMock.mockOther(
      okxBalanceModule,
      'exchange',
      {
        keySecret: {
          key: '',
          secret: '',
        },
      } as IAlunaExchange,
    )

    const requestMock = ImportMock.mockFunction(
      OkxHttp,
      'privateRequest',
      { data: [{ details: OKX_RAW_BALANCES }], requestCount: 1 },
    )


    const {
      rawBalances,
      requestCount,
    } = await okxBalanceModule.listRaw()

    expect(requestMock.callCount).to.be.eq(1)
    expect(requestMock.calledWith({
      verb: AlunaHttpVerbEnum.GET,
      url: `${PROD_OKX_URL}/account/balance`,
      keySecret: exchangeMock.getValue().keySecret,
    })).to.be.ok

    expect(requestCount).to.eq(1)

    expect(rawBalances.length).to.eq(4)
    expect(rawBalances).to.deep.eq(OKX_RAW_BALANCES)

    rawBalances.forEach((balance, index) => {

      const {
        ccy,
        availBal,
        frozenBal,
      } = OKX_RAW_BALANCES[index]

      expect(balance.ccy).to.be.eq(ccy)
      expect(balance.availBal).to.be.eq(availBal)
      expect(balance.frozenBal).to.be.eq(frozenBal)

    })

  })



  it('should list all Okx parsed balances', async () => {

    const rawListMock = ['arr-of-raw-balances']

    const listRawMock = ImportMock.mockFunction(
      OkxBalanceModule.prototype,
      'listRaw',
      { rawBalances: rawListMock, requestCount: 1 },
    )

    const parseManyMock = ImportMock.mockFunction(
      OkxBalanceModule.prototype,
      'parseMany',
      { balances: OKX_PARSED_BALANCES, requestCount: 1 },
    )

    const { balances, requestCount } = await okxBalanceModule.list()

    expect(requestCount).to.be.eq(2)

    expect(listRawMock.callCount).to.be.eq(1)

    expect(parseManyMock.callCount).to.be.eq(1)

    expect(parseManyMock.calledWithExactly({
      rawBalances: rawListMock,
    })).to.be.ok

    expect(balances.length).to.be.eq(3)
    expect(balances).to.deep.eq(OKX_PARSED_BALANCES)

    balances.forEach((balance, index) => {

      const {
        account,
        available,
        symbolId,
        total,
      } = OKX_PARSED_BALANCES[index]

      expect(balance.account).to.be.eq(account)
      expect(balance.available).to.be.eq(available)
      expect(balance.symbolId).to.be.eq(symbolId)
      expect(balance.total).to.be.eq(total)

    })

  })



  it('should parse a single Okx raw balance', () => {

    const translateSymbolId = 'BTC'

    const { alunaSymbolMappingMock } = mockAlunaSymbolMapping()

    alunaSymbolMappingMock.returns(translateSymbolId)

    const rawBalance1 = OKX_RAW_BALANCES[0]
    const rawBalance2 = OKX_RAW_BALANCES[1]

    const { balance: parsedBalance1 } = okxBalanceModule.parse({
      rawBalance: rawBalance1,
    })

    const {
      ccy,
      availBal,
      frozenBal,
    } = rawBalance1

    const available = Number(availBal)
    const total = new BigNumber(available)
      .plus(Number(frozenBal))
      .toNumber()

    expect(parsedBalance1.symbolId).to.be.eq(translateSymbolId)
    expect(parsedBalance1.account).to.be.eq(AlunaAccountEnum.MAIN)
    expect(parsedBalance1.available).to.be.eq(available)
    expect(parsedBalance1.total).to.be.eq(total)

    expect(alunaSymbolMappingMock.callCount).to.be.eq(1)
    expect(alunaSymbolMappingMock.args[0][0]).to.deep.eq({
      exchangeSymbolId: ccy,
      symbolMappings: {},
    })


    const { balance: parsedBalance2 } = okxBalanceModule.parse({
      rawBalance: rawBalance2,
    })

    const available2 = Number(rawBalance2.availBal)
    const total2 = new BigNumber(available2)
      .plus(Number(rawBalance2.frozenBal))
      .toNumber()

    expect(parsedBalance2.account).to.be.eq(AlunaAccountEnum.MAIN)
    expect(parsedBalance2.symbolId).to.be.eq(translateSymbolId)
    expect(parsedBalance2.available).to.be.eq(available2)
    expect(parsedBalance2.total).to.be.eq(total2)

    expect(alunaSymbolMappingMock.callCount).to.be.eq(2)
    expect(alunaSymbolMappingMock.args[1][0]).to.deep.eq({
      exchangeSymbolId: rawBalance2.ccy,
      symbolMappings: {},
    })

  })



  it('should parse many Okx raw balances', async () => {

    const parseMock = ImportMock.mockFunction(
      OkxBalanceModule.prototype,
      'parse',
    )

    parseMock
      .onFirstCall()
      .returns({ balance: OKX_PARSED_BALANCES[0] })
      .onSecondCall()
      .returns({ balance: OKX_PARSED_BALANCES[1] })
      .onThirdCall()
      .returns({ balance: OKX_PARSED_BALANCES[2] })


    const { balances: parsedBalances } = okxBalanceModule.parseMany({
      rawBalances: OKX_RAW_BALANCES,
    })

    expect(parseMock.callCount).to.be.eq(3)
    expect(parsedBalances.length).to.be.eq(3)

    parsedBalances.forEach((balance, index) => {

      const {
        account,
        available,
        symbolId,
        total,
      } = OKX_PARSED_BALANCES[index]

      expect(balance.account).to.be.eq(account)
      expect(balance.available).to.be.eq(available)
      expect(balance.total).to.be.eq(total)
      expect(balance.symbolId).to.be.eq(symbolId)

    })

  })

})
