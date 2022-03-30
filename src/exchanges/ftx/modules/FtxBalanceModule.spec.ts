import { expect } from 'chai'
import { ImportMock } from 'ts-mock-imports'

import { IAlunaExchange } from '../../../lib/core/IAlunaExchange'
import { AlunaAccountEnum } from '../../../lib/enums/AlunaAccountEnum'
import { AlunaHttpVerbEnum } from '../../../lib/enums/AlunaHtttpVerbEnum'
import { FtxHttp } from '../FtxHttp'
import { PROD_FTX_URL } from '../FtxSpecs'
import {
  FTX_PARSED_BALANCES,
  FTX_RAW_BALANCES,
} from '../test/fixtures/ftxBalance'
import { FtxBalanceModule } from './FtxBalanceModule'



describe('FtxBalanceModule', () => {

  const ftxBalanceModule = FtxBalanceModule.prototype


  it('should list all Ftx raw balances', async () => {

    const exchangeMock = ImportMock.mockOther(
      ftxBalanceModule,
      'exchange',
      {
        keySecret: {
          key: '',
          secret: '',
        },
      } as IAlunaExchange,
    )

    const requestMock = ImportMock.mockFunction(
      FtxHttp,
      'privateRequest',
      {
        data: {
          result: FTX_RAW_BALANCES,
        },
        apiRequestCount: 1,
      },
    )


    const { rawBalances } = await ftxBalanceModule.listRaw()

    expect(requestMock.callCount).to.be.eq(1)
    expect(requestMock.calledWith({
      verb: AlunaHttpVerbEnum.GET,
      url: `${PROD_FTX_URL}/wallet/balances`,
      keySecret: exchangeMock.getValue().keySecret,
    })).to.be.ok

    expect(rawBalances.length).to.eq(4)
    expect(rawBalances).to.deep.eq(FTX_RAW_BALANCES)

  })



  it('should list all Ftx parsed balances', async () => {

    const rawListMock = ['arr-of-raw-balances']

    const listRawMock = ImportMock.mockFunction(
      FtxBalanceModule.prototype,
      'listRaw',
      {
        rawBalances: rawListMock,
        apiRequestCount: 1,
      },
    )

    const parseManyMock = ImportMock.mockFunction(
      FtxBalanceModule.prototype,
      'parseMany',
      {
        balances: FTX_PARSED_BALANCES,
        apiRequestCount: 1,
      },
    )

    const { balances } = await ftxBalanceModule.list()


    expect(listRawMock.callCount).to.be.eq(1)

    expect(parseManyMock.callCount).to.be.eq(1)

    expect(parseManyMock.calledWithExactly({
      rawBalances: rawListMock,
    })).to.be.ok

    expect(balances.length).to.be.eq(3)
    expect(balances).to.deep.eq(FTX_PARSED_BALANCES)

  })



  it('should parse a single Ftx raw balance', () => {

    const {
      balance: parsedBalance1,
    } = ftxBalanceModule.parse({
      rawBalance: FTX_RAW_BALANCES[0],
    })

    const {
      free,
      coin,
      total,
    } = FTX_RAW_BALANCES[0]

    expect(parsedBalance1.symbolId).to.be.eq(coin)
    expect(parsedBalance1.account).to.be.eq(AlunaAccountEnum.EXCHANGE)
    expect(parsedBalance1.available).to.be.eq(free)
    expect(parsedBalance1.total).to.be.eq(total)


    const { balance: parsedBalance2 } = ftxBalanceModule.parse({
      rawBalance: FTX_RAW_BALANCES[1],
    })

    const currency2 = FTX_RAW_BALANCES[1].coin
    const available2 = FTX_RAW_BALANCES[1].free
    const total2 = FTX_RAW_BALANCES[1].total

    expect(parsedBalance2.account).to.be.eq(AlunaAccountEnum.EXCHANGE)
    expect(parsedBalance2.symbolId).to.be.eq(currency2)
    expect(parsedBalance2.available).to.be.eq(available2)
    expect(parsedBalance2.total).to.be.eq(total2)

  })



  it('should parse many Ftx raw balances', async () => {

    const parseMock = ImportMock.mockFunction(
      FtxBalanceModule.prototype,
      'parse',
    )

    parseMock
      .onFirstCall()
      .returns({
        balance: FTX_PARSED_BALANCES[0],
        apiRequestCount: 1,
      })
      .onSecondCall()
      .returns({
        balance: FTX_PARSED_BALANCES[1],
        apiRequestCount: 1,
      })
      .onThirdCall()
      .returns({
        balance: FTX_PARSED_BALANCES[2],
        apiRequestCount: 1,
      })


    const { balances: parsedBalances } = ftxBalanceModule.parseMany({
      rawBalances: FTX_RAW_BALANCES,
    })


    expect(parseMock.callCount).to.be.eq(3)
    expect(parsedBalances.length).to.be.eq(3)

    parsedBalances.forEach((balance, index) => {

      const {
        account,
        available,
        symbolId,
        total,
      } = FTX_PARSED_BALANCES[index]

      expect(balance.account).to.be.eq(account)
      expect(balance.available).to.be.eq(available)
      expect(balance.total).to.be.eq(total)
      expect(balance.symbolId).to.be.eq(symbolId)

    })

  })

})
