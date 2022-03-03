import { expect } from 'chai'

import { AlunaAccountEnum } from '../../../../lib/enums/AlunaAccountEnum'
import { mockAlunaSymbolMapping } from '../../../../utils/mappings/AlunaSymbolMapping.mock'
import { PoloniexSideAdapter } from '../../enums/adapters/PoloniexSideAdapter'
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

    expect(parsedOrder.side)
      .to.be.eq(PoloniexSideAdapter.translateToAluna({ orderType: rawSide }))
    expect(parsedOrder.status)
      .to.be.eq(PoloniexStatusAdapter.translateToAluna({
        from: PoloniexOrderStatusEnum.OPEN,
      }))
    expect(parsedOrder.type)
      .to.be.eq(PoloniexSideAdapter.translateToAlunaOrderType())
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

    const rawOrder: IPoloniexOrderStatusInfo = {
      ...POLONIEX_RAW_LIMIT_ORDER,
      status: PoloniexOrderStatusEnum.CANCELED,
    }

    rawOrder.startingAmount = undefined as any

    const parsedOrder = PoloniexOrderParser.parse({
      rawOrder,
    })

    const rawStatus = rawOrder.status

    expect(parsedOrder.status)
      .to.be.eq(PoloniexStatusAdapter.translateToAluna(
        { from: rawStatus },
      ))
    expect(parsedOrder.canceledAt?.getTime())
      .to.be.eq(
        new Date().getTime(),
      )
    expect(parsedOrder.amount)
      .to.be.eq(
        parseFloat(rawOrder.amount),
      )

  })



  it('should parse filled Poloniex order just fine', async () => {

    const rawOrder: IPoloniexOrderStatusInfo = {
      ...POLONIEX_RAW_LIMIT_ORDER,
      status: PoloniexOrderStatusEnum.FILLED,
    }

    const parsedOrder = PoloniexOrderParser.parse({
      rawOrder,
    })

    const rawStatus = rawOrder.status

    expect(parsedOrder.status)
      .to.be.eq(PoloniexStatusAdapter.translateToAluna(
        { from: rawStatus },
      ))
    expect(parsedOrder.filledAt?.getTime())
      .to.be.eq(
        new Date().getTime(),
      )

  })

})
