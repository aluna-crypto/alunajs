import { expect } from 'chai'
import { ImportMock } from 'ts-mock-imports'

import { IAlunaExchange } from '../../../lib/core/IAlunaExchange'
import { AlunaAccountEnum } from '../../../lib/enums/AlunaAccountEnum'
import { AlunaHttpVerbEnum } from '../../../lib/enums/AlunaHtttpVerbEnum'
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
      GATEIO_RAW_BALANCES,
    )


    const rawBalances = await gateioBalanceModule.listRaw()

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
      rawListMock,
    )

    const parseManyMock = ImportMock.mockFunction(
      GateioBalanceModule.prototype,
      'parseMany',
      GATEIO_PARSED_BALANCES,
    )

    const balances = await gateioBalanceModule.list()


    expect(listRawMock.callCount).to.be.eq(1)

    expect(parseManyMock.callCount).to.be.eq(1)

    expect(parseManyMock.calledWithExactly({
      rawBalances: rawListMock,
    })).to.be.ok

    expect(balances.length).to.be.eq(3)
    expect(balances).to.deep.eq(GATEIO_PARSED_BALANCES)

  })



  it('should parse a single Gateio raw balance', () => {

    const parsedBalance1 = gateioBalanceModule.parse({
      rawBalance: GATEIO_RAW_BALANCES[0],
    })

    const {
      available,
      currency,
      locked,
    } = GATEIO_RAW_BALANCES[0]

    const availableAmount = parseFloat(available)
    const total = parseFloat(available) + parseFloat(locked)

    expect(parsedBalance1.symbolId).to.be.eq(currency)
    expect(parsedBalance1.account).to.be.eq(AlunaAccountEnum.EXCHANGE)
    expect(parsedBalance1.available).to.be.eq(availableAmount)
    expect(parsedBalance1.total).to.be.eq(total)


    const parsedBalance2 = gateioBalanceModule.parse({
      rawBalance: GATEIO_RAW_BALANCES[1],
    })

    const currency2 = GATEIO_RAW_BALANCES[1].currency
    const available2 = parseFloat(GATEIO_RAW_BALANCES[1].available)
    const total2 = parseFloat(GATEIO_RAW_BALANCES[1].available)
      + parseFloat(GATEIO_RAW_BALANCES[1].locked)

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
      .returns(GATEIO_PARSED_BALANCES[0])
      .onSecondCall()
      .returns(GATEIO_PARSED_BALANCES[1])
      .onThirdCall()
      .returns(GATEIO_PARSED_BALANCES[2])


    const parsedBalances = gateioBalanceModule.parseMany({
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
