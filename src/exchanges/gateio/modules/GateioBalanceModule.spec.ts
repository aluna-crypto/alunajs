import { expect } from 'chai'
import { ImportMock } from 'ts-mock-imports'

import { IAlunaExchange } from '../../../lib/core/IAlunaExchange'
import { AlunaAccountEnum } from '../../../lib/enums/AlunaAccountEnum'
import { AlunaHttpVerbEnum } from '../../../lib/enums/AlunaHtttpVerbEnum'
import { mockAlunaSymbolMapping } from '../../../utils/mappings/AlunaSymbolMapping.mock'
import { GateioHttp } from '../GateioHttp'
import { PROD_GATEIO_URL } from '../GateioSpecs'
import {
  GATEIO_PARSED_BALANCES,
  GATEIO_RAW_BALANCES,
} from '../test/fixtures/gateioBalance'
import { GateioBalanceModule } from './GateioBalanceModule'



describe('GateioBalanceModule', () => {

  const gateioBalanceModule = GateioBalanceModule.prototype

  it('should list all Gateio raw balances', async () => {

    const exchangeMock = ImportMock.mockOther(
      gateioBalanceModule,
      'exchange',
      {
        keySecret: {
          key: '',
          secret: '',
        },
      } as IAlunaExchange,
    )

    const requestMock = ImportMock.mockFunction(
      GateioHttp,
      'privateRequest',
      { data: GATEIO_RAW_BALANCES, apiRequestCount: 1 },
    )


    const { rawBalances, apiRequestCount } = await gateioBalanceModule.listRaw()

    expect(apiRequestCount).to.be.eq(1)

    expect(requestMock.callCount).to.be.eq(1)
    expect(requestMock.calledWith({
      verb: AlunaHttpVerbEnum.GET,
      url: `${PROD_GATEIO_URL}/spot/accounts`,
      keySecret: exchangeMock.getValue().keySecret,
    })).to.be.ok

    expect(rawBalances.length).to.eq(4)
    expect(rawBalances).to.deep.eq(GATEIO_RAW_BALANCES)

  })

  it('should list all Gateio parsed balances', async () => {

    const rawListMock = ['arr-of-raw-balances']

    const listRawMock = ImportMock.mockFunction(
      GateioBalanceModule.prototype,
      'listRaw',
      { rawBalances: rawListMock, apiRequestCount: 1 },
    )

    const parseManyMock = ImportMock.mockFunction(
      GateioBalanceModule.prototype,
      'parseMany',
      { balances: GATEIO_PARSED_BALANCES, apiRequestCount: 1 },
    )

    const { balances } = await gateioBalanceModule.list()


    expect(listRawMock.callCount).to.be.eq(1)

    expect(parseManyMock.callCount).to.be.eq(1)

    expect(parseManyMock.calledWithExactly({
      rawBalances: rawListMock,
    })).to.be.ok

    expect(balances.length).to.be.eq(3)
    expect(balances).to.deep.eq(GATEIO_PARSED_BALANCES)

  })

  it('should parse a single Gateio raw balance', () => {

    const translateSymbolId = 'BTC'

    const { alunaSymbolMappingMock } = mockAlunaSymbolMapping()

    alunaSymbolMappingMock.returns(translateSymbolId)

    const rawBalance1 = GATEIO_RAW_BALANCES[0]
    const rawBalance2 = GATEIO_RAW_BALANCES[1]

    const { balance: parsedBalance1 } = gateioBalanceModule.parse({
      rawBalance: rawBalance1,
    })

    const {
      available,
      locked,
    } = rawBalance1

    const availableAmount = parseFloat(available)
    const total = parseFloat(available) + parseFloat(locked)

    expect(parsedBalance1.symbolId).to.be.eq(translateSymbolId)
    expect(parsedBalance1.account).to.be.eq(AlunaAccountEnum.EXCHANGE)
    expect(parsedBalance1.available).to.be.eq(availableAmount)
    expect(parsedBalance1.total).to.be.eq(total)


    alunaSymbolMappingMock.returns(rawBalance2.currency)

    const { balance: parsedBalance2 } = gateioBalanceModule.parse({
      rawBalance: rawBalance2,
    })

    const currency2 = rawBalance2.currency
    const available2 = Number(rawBalance2.available)
    const total2 = Number(rawBalance2.available) + Number(rawBalance2.locked)

    expect(parsedBalance2.account).to.be.eq(AlunaAccountEnum.EXCHANGE)
    expect(parsedBalance2.symbolId).to.be.eq(currency2)
    expect(parsedBalance2.available).to.be.eq(available2)
    expect(parsedBalance2.total).to.be.eq(total2)

  })

  it('should parse many Gateio raw balances', async () => {

    const parseMock = ImportMock.mockFunction(
      GateioBalanceModule.prototype,
      'parse',
    )

    parseMock
      .onFirstCall()
      .returns({ balance: GATEIO_PARSED_BALANCES[0], apiRequestCount: 1 })
      .onSecondCall()
      .returns({ balance: GATEIO_PARSED_BALANCES[1], apiRequestCount: 1 })
      .onThirdCall()
      .returns({ balance: GATEIO_PARSED_BALANCES[2], apiRequestCount: 1 })


    const { balances: parsedBalances } = gateioBalanceModule.parseMany({
      rawBalances: GATEIO_RAW_BALANCES,
    })


    expect(parseMock.callCount).to.be.eq(3)
    expect(parsedBalances.length).to.be.eq(3)

    parsedBalances.forEach((balance, index) => {

      const {
        account,
        available,
        symbolId,
        total,
      } = GATEIO_PARSED_BALANCES[index]

      expect(balance.account).to.be.eq(account)
      expect(balance.available).to.be.eq(available)
      expect(balance.total).to.be.eq(total)
      expect(balance.symbolId).to.be.eq(symbolId)

    })

  })

})
