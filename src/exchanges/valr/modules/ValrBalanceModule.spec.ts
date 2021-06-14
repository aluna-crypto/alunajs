import { expect } from 'chai'
import { ImportMock } from 'ts-mock-imports'

import { IAlunaExchange } from '../../../lib/core/IAlunaExchange'
import { AlunaAccountEnum } from '../../../lib/enums/AlunaAccountEnum'
import { VALR_SEEDS } from '../test/fixtures'
import { ValrHttp } from '../ValrHttp'
import { ValrBalanceModule } from './ValrBalanceModule'



describe('ValrBalanceModule', () => {

  const valrBalanceModule = ValrBalanceModule.prototype

  const { balanceSeeds } = VALR_SEEDS



  it('should list all Valr raw balances', async () => {

    ImportMock.mockOther(
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
      balanceSeeds.rawBalances,
    )


    const rawBalances = await valrBalanceModule.listRaw()

    expect(requestMock.callCount).to.be.eq(1)

    expect(rawBalances.length).to.eq(5)

    expect(rawBalances[0].currency).to.be.eq('BTC')
    expect(rawBalances[0].total).to.be.eq('0.054511644725')

    expect(rawBalances[1].currency).to.be.eq('ETH')
    expect(rawBalances[1].total).to.be.eq('0.50626594758')

    expect(rawBalances[2].currency).to.be.eq('LTC')
    expect(rawBalances[2].total).to.be.eq('1.57270565')

    expect(rawBalances[3].currency).to.be.eq('CRO')
    expect(rawBalances[3].total).to.be.eq('0')

    expect(rawBalances[4].currency).to.be.eq('USDT')
    expect(rawBalances[4].total).to.be.eq('0')


  })



  it('should list all Valr parsed balances', async () => {

    const listRawMock = ImportMock.mockFunction(
      ValrBalanceModule.prototype,
      'listRaw',
      ['arr-of-raw-balances'],
    )

    const parseManyMock = ImportMock.mockFunction(
      ValrBalanceModule.prototype,
      'parseMany',
      balanceSeeds.parsedBalances,
    )

    const balances = await valrBalanceModule.list()


    expect(listRawMock.callCount).to.be.eq(1)

    const listRawReturn = listRawMock.returnValues[0]

    expect(parseManyMock.callCount).to.be.eq(1)
    expect(parseManyMock.calledWith({ rawBalances: listRawReturn })).to.be.true

    expect(balances).to.deep.eq(parseManyMock.returnValues[0])

    expect(balances.length).to.be.eq(4)
    expect(balances[0].symbolId).to.be.eq('ETH')
    expect(balances[1].symbolId).to.be.eq('ZAR')
    expect(balances[2].symbolId).to.be.eq('BTC')
    expect(balances[3].symbolId).to.be.eq('XRP')

  })



  it('should parse a single Valr raw balance', () => {

    const parsedBalance1 = valrBalanceModule.parse({
      rawBalance: balanceSeeds.rawBalances[0],
    })

    expect(parsedBalance1).to.not.be.undefined

    expect(parsedBalance1.symbolId).to.be.eq('BTC')
    expect(parsedBalance1.account).to.be.eq(AlunaAccountEnum.EXCHANGE)
    expect(parsedBalance1.available).to.be.eq(0.044511644725)
    expect(parsedBalance1.total).to.be.eq(0.054511644725)


    const parsedBalance2 = valrBalanceModule.parse({
      rawBalance: balanceSeeds.rawBalances[1],
    })

    expect(parsedBalance2.symbolId).to.be.eq('ETH')
    expect(parsedBalance2.account).to.be.eq(AlunaAccountEnum.EXCHANGE)
    expect(parsedBalance2.available).to.be.eq(0.01626594758)
    expect(parsedBalance2.total).to.be.eq(0.50626594758)

  })



  it('should parse multiple Valr raw balances', async () => {

    const parseMock = ImportMock.mockFunction(
      ValrBalanceModule.prototype,
      'parse',
    )

    parseMock
      .onFirstCall()
      .returns(balanceSeeds.parsedBalances[0])
      .onSecondCall()
      .returns(balanceSeeds.parsedBalances[1])
      .onThirdCall()
      .returns(balanceSeeds.parsedBalances[2])


    const parsedBalances = valrBalanceModule.parseMany({
      rawBalances: balanceSeeds.rawBalances,
    })

    /**
     * Seed has 5 raw balances but 2 of them have total property equal to 0.
     * ParseMany should not call parse when total is equal/less than 0
     */
    expect(balanceSeeds.rawBalances.length).to.be.eq(5)
    expect(parseMock.callCount).to.be.eq(3)
    expect(parsedBalances.length).to.be.eq(3)

    expect(parsedBalances[0].symbolId).to.be.eq('ETH')
    expect(parsedBalances[1].symbolId).to.be.eq('ZAR')
    expect(parsedBalances[2].symbolId).to.be.eq('BTC')

  })


})
