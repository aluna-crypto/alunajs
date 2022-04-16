import { expect } from 'chai'
import { ImportMock } from 'ts-mock-imports'

import { AlunaError } from '../../../lib/core/AlunaError'
import { IAlunaExchange } from '../../../lib/core/IAlunaExchange'
import { AlunaAccountEnum } from '../../../lib/enums/AlunaAccountEnum'
import { AlunaHttpVerbEnum } from '../../../lib/enums/AlunaHtttpVerbEnum'
import { AlunaAccountsErrorCodes } from '../../../lib/errors/AlunaAccountsErrorCodes'
import { mockAlunaSymbolMapping } from '../../../utils/mappings/AlunaSymbolMapping.mock'
import { HuobiHttp } from '../HuobiHttp'
import { PROD_HUOBI_URL } from '../HuobiSpecs'
import { HuobiAccountTypeEnum } from '../schemas/IHuobiBalanceSchema'
import {
  HUOBI_PARSED_BALANCES,
  HUOBI_RAW_ACCOUNTS,
  HUOBI_RAW_BALANCES,
} from '../test/fixtures/huobiBalance'
import { HuobiBalanceModule } from './HuobiBalanceModule'



describe('HuobiBalanceModule', () => {

  const huobiBalanceModule = HuobiBalanceModule.prototype


  it('should list all Huobi raw balances', async () => {

    const exchangeMock = ImportMock.mockOther(
      huobiBalanceModule,
      'exchange',
      {
        keySecret: {
          key: '',
          secret: '',
        },
      } as IAlunaExchange,
    )

    const requestMock = ImportMock.mockFunction(
      HuobiHttp,
      'privateRequest',
    )

    requestMock.onFirstCall().returns({
      data: HUOBI_RAW_ACCOUNTS,
      requestCount: 1,
    })

    requestMock.onSecondCall().returns({
      data: {
        list: HUOBI_RAW_BALANCES,
      },
      requestCount: 1,
    })


    const {
      rawBalances,
      requestCount,
    } = await huobiBalanceModule.listRaw()

    expect(requestMock.callCount).to.be.eq(2)
    expect(requestMock.firstCall.calledWith({
      verb: AlunaHttpVerbEnum.GET,
      url: `${PROD_HUOBI_URL}/v1/account/accounts`,
      keySecret: exchangeMock.getValue().keySecret,
    })).to.be.ok

    const accountId = HUOBI_RAW_ACCOUNTS.find(
      (acc) => acc.type === HuobiAccountTypeEnum.SPOT,
    )!.id

    expect(requestMock.secondCall.calledWith({
      verb: AlunaHttpVerbEnum.GET,
      url: `${PROD_HUOBI_URL}/v1/account/accounts/${accountId}/balance`,
      keySecret: exchangeMock.getValue().keySecret,
    })).to.be.ok

    expect(requestCount).to.eq(2)

    expect(rawBalances.length).to.eq(4)
    expect(rawBalances).to.deep.eq(HUOBI_RAW_BALANCES)

    rawBalances.forEach((balance, index) => {

      const {
        balance: total,
        currency,
        type,
        'seq-num': seq_num,
      } = HUOBI_RAW_BALANCES[index]

      expect(balance.balance).to.be.eq(total)
      expect(balance.currency).to.be.eq(currency)
      expect(balance.type).to.be.eq(type)
      expect(balance['seq-num']).to.be.eq(seq_num)

    })

  })



  it('should ensure a spot account is available', async () => {

    ImportMock.mockOther(
      huobiBalanceModule,
      'exchange',
      {
        keySecret: {
          key: '',
          secret: '',
        },
      } as IAlunaExchange,
    )

    const requestMock = ImportMock.mockFunction(
      HuobiHttp,
      'privateRequest',
    )

    requestMock.onFirstCall().returns({
      data: HUOBI_RAW_ACCOUNTS.filter(
        (acc) => acc.type !== HuobiAccountTypeEnum.SPOT,
      ),
      requestCount: 1,
    })


    let result
    let error

    try {

      result = await huobiBalanceModule.listRaw()

    } catch (err) {

      error = err

    }

    expect(result).not.to.be.ok

    expect(error instanceof AlunaError).to.be.ok
    expect(error.message).to.be.eq('spot account not found')
    expect(error.code).to.be.eq(AlunaAccountsErrorCodes.TYPE_NOT_FOUND)

  })



  it('should list all Huobi parsed balances', async () => {

    const rawListMock = ['arr-of-raw-balances']

    const listRawMock = ImportMock.mockFunction(
      HuobiBalanceModule.prototype,
      'listRaw',
      { rawBalances: rawListMock, requestCount: 1 },
    )

    const parseManyMock = ImportMock.mockFunction(
      HuobiBalanceModule.prototype,
      'parseMany',
      { balances: HUOBI_PARSED_BALANCES, requestCount: 1 },
    )

    const { balances, requestCount } = await huobiBalanceModule.list()

    expect(requestCount).to.be.eq(2)

    expect(listRawMock.callCount).to.be.eq(1)

    expect(parseManyMock.callCount).to.be.eq(1)

    expect(parseManyMock.calledWithExactly({
      rawBalances: rawListMock,
    })).to.be.ok

    expect(balances.length).to.be.eq(3)
    expect(balances).to.deep.eq(HUOBI_PARSED_BALANCES)

    balances.forEach((balance, index) => {

      const {
        account,
        available,
        symbolId,
        total,
      } = HUOBI_PARSED_BALANCES[index]

      expect(balance.account).to.be.eq(account)
      expect(balance.available).to.be.eq(available)
      expect(balance.symbolId).to.be.eq(symbolId)
      expect(balance.total).to.be.eq(total)

    })

  })



  it('should parse a single Huobi raw balance', () => {

    const translateSymbolId = 'BTC'

    const { alunaSymbolMappingMock } = mockAlunaSymbolMapping()

    alunaSymbolMappingMock.returns(translateSymbolId)

    const rawBalance1 = HUOBI_RAW_BALANCES[0]
    const rawBalance2 = HUOBI_RAW_BALANCES[1]

    const { balance: parsedBalance1 } = huobiBalanceModule.parse({
      rawBalance: rawBalance1,
    })

    const {
      balance: total,
      currency,
    } = rawBalance1

    expect(parsedBalance1.symbolId).to.be.eq(translateSymbolId)
    expect(parsedBalance1.account).to.be.eq(AlunaAccountEnum.EXCHANGE)
    expect(parsedBalance1.available).to.be.eq(parseFloat(total))
    expect(parsedBalance1.total).to.be.eq(parseFloat(total))

    expect(alunaSymbolMappingMock.callCount).to.be.eq(1)
    expect(alunaSymbolMappingMock.args[0][0]).to.deep.eq({
      exchangeSymbolId: currency,
      symbolMappings: {},
    })


    const { balance: parsedBalance2 } = huobiBalanceModule.parse({
      rawBalance: rawBalance2,
    })

    const total2 = parseFloat(rawBalance2.balance)

    expect(parsedBalance2.account).to.be.eq(AlunaAccountEnum.EXCHANGE)
    expect(parsedBalance2.symbolId).to.be.eq(translateSymbolId)
    expect(parsedBalance2.available).to.be.eq(total2)
    expect(parsedBalance2.total).to.be.eq(total2)

    expect(alunaSymbolMappingMock.callCount).to.be.eq(2)
    expect(alunaSymbolMappingMock.args[1][0]).to.deep.eq({
      exchangeSymbolId: rawBalance2.currency,
      symbolMappings: {},
    })

  })



  it('should parse many Huobi raw balances', async () => {

    const parseMock = ImportMock.mockFunction(
      HuobiBalanceModule.prototype,
      'parse',
    )

    parseMock
      .onFirstCall()
      .returns({ balance: HUOBI_PARSED_BALANCES[0] })
      .onSecondCall()
      .returns({ balance: HUOBI_PARSED_BALANCES[1] })
      .onThirdCall()
      .returns({ balance: HUOBI_PARSED_BALANCES[2] })


    const { balances: parsedBalances } = huobiBalanceModule.parseMany({
      rawBalances: HUOBI_RAW_BALANCES,
    })

    expect(parseMock.callCount).to.be.eq(3)
    expect(parsedBalances.length).to.be.eq(3)

    parsedBalances.forEach((balance, index) => {

      const {
        account,
        available,
        symbolId,
        total,
      } = HUOBI_PARSED_BALANCES[index]

      expect(balance.account).to.be.eq(account)
      expect(balance.available).to.be.eq(available)
      expect(balance.total).to.be.eq(total)
      expect(balance.symbolId).to.be.eq(symbolId)

    })

  })

})
