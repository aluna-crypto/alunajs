import { expect } from 'chai'
import { ImportMock } from 'ts-mock-imports'

import { AlunaAccountEnum } from '../../../../lib/enums/AlunaAccountEnum'
import { AlunaOrderStatusEnum } from '../../../../lib/enums/AlunaOrderStatusEnum'
import { mockAlunaSymbolMapping } from '../../../../utils/mappings/AlunaSymbolMapping.mock'
import { PoloniexOrderSideAdapter } from '../../enums/adapters/PoloniexOrderSideAdapter'
import { PoloniexStatusAdapter } from '../../enums/adapters/PoloniexStatusAdapter'
import { PoloniexOrderStatusEnum } from '../../enums/PoloniexOrderStatusEnum'
import { Poloniex } from '../../Poloniex'
import { POLONIEX_RAW_LIMIT_ORDER } from '../../test/fixtures/poloniexOrder'
import {
  IPoloniexOrderStatusInfo,
  IPoloniexOrderWithCurrency,
} from '../IPoloniexOrderSchema'
import { PoloniexOrderParser } from './PoloniexOrderParser'



describe('PoloniexOrderParser', () => {

  it('should parse limit Poloniex order just fine', async () => {

    const translateSymbolId = 'BTC'

    const { alunaSymbolMappingMock } = mockAlunaSymbolMapping()

    const rawOrder: IPoloniexOrderWithCurrency = POLONIEX_RAW_LIMIT_ORDER

    const parsedOrder = PoloniexOrderParser.parse({
      rawOrder,
    })

    const [baseCurrency, quoteCurrency] = rawOrder.currencyPair.split('_')

    const rawOriginalQuantity = rawOrder.amount
    const rawPrice = rawOrder.rate
    const rawSide = rawOrder.type
    const rawTotal = rawOrder.total

    const expectedSide = PoloniexOrderSideAdapter.translateToAluna({
      orderType: rawSide,
    })

    const expectedStatus = PoloniexStatusAdapter.translateToAluna({
      from: PoloniexOrderStatusEnum.OPEN,
    })

    expect(parsedOrder.id).to.be.eq(rawOrder.orderNumber)
    expect(parsedOrder.symbolPair).to.be.eq(rawOrder.currencyPair)
    expect(parsedOrder.baseSymbolId).to.be.eq(translateSymbolId)
    expect(parsedOrder.quoteSymbolId).to.be.eq(translateSymbolId)
    expect(parsedOrder.total).to.be.eq(
      parseFloat(rawTotal),
    )
    expect(parsedOrder.amount).to.be.eq(parseFloat(rawOriginalQuantity))
    expect(parsedOrder.rate).to.be.eq(parseFloat(rawPrice))
    expect(parsedOrder.account).to.be.eq(AlunaAccountEnum.EXCHANGE)

    expect(parsedOrder.side).to.be.eq(expectedSide)
    expect(parsedOrder.status).to.be.eq(expectedStatus)
    expect(parsedOrder.type)
      .to.be.eq(PoloniexOrderSideAdapter.translateToAlunaOrderType())
    expect(parsedOrder.placedAt.getTime())
      .to.be.eq(new Date(rawOrder.date).getTime())


    expect(alunaSymbolMappingMock.callCount).to.be.eq(2)
    expect(alunaSymbolMappingMock.args[0][0]).to.deep.eq({
      exchangeSymbolId: baseCurrency,
      symbolMappings: Poloniex.settings.mappings,
    })
    expect(alunaSymbolMappingMock.args[1][0]).to.deep.eq({
      exchangeSymbolId: quoteCurrency,
      symbolMappings: Poloniex.settings.mappings,
    })

  })



  it('should parse canceled Poloniex order just fine', async () => {

    const mockedDate = new Date()

    ImportMock.mockFunction(
      global,
      'Date',
      mockedDate,
    )

    const rawOrder: IPoloniexOrderStatusInfo = {
      ...POLONIEX_RAW_LIMIT_ORDER,
      status: PoloniexOrderStatusEnum.CANCELED,
    }

    rawOrder.startingAmount = undefined as any

    const parsedOrder = PoloniexOrderParser.parse({
      rawOrder,
    })

    expect(parsedOrder.status).to.be.eq(AlunaOrderStatusEnum.CANCELED)
    expect(parsedOrder.canceledAt!).to.be.eq(new Date())
    expect(parsedOrder.amount).to.be.eq(Number(rawOrder.amount))

  })



  it('should parse filled Poloniex order just fine', async () => {

    const mockedDate = new Date()

    function fakeDateConstructor () {

      return mockedDate

    }

    ImportMock.mockOther(
      global,
      'Date',
      fakeDateConstructor as any,
    )

    const rawOrder: IPoloniexOrderStatusInfo = {
      ...POLONIEX_RAW_LIMIT_ORDER,
      status: PoloniexOrderStatusEnum.FILLED,
    }

    const parsedOrder = PoloniexOrderParser.parse({
      rawOrder,
    })

    expect(parsedOrder.status).to.be.eq(AlunaOrderStatusEnum.FILLED)
    expect(parsedOrder.filledAt!).to.deep.eq(new Date())

  })

})
