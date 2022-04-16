import { expect } from 'chai'

import { AlunaAccountEnum } from '../../../../lib/enums/AlunaAccountEnum'
import { mockAlunaSymbolMapping } from '../../../../utils/mappings/AlunaSymbolMapping.mock'
import { HuobiOrderSideAdapter } from '../../enums/adapters/HuobiOrderSideAdapter'
import { HuobiOrderTypeAdapter } from '../../enums/adapters/HuobiOrderTypeAdapter'
import { HuobiStatusAdapter } from '../../enums/adapters/HuobiStatusAdapter'
import { HuobiOrderSideEnum } from '../../enums/HuobiOrderSideEnum'
import { HuobiOrderStatusEnum } from '../../enums/HuobiOrderStatusEnum'
import { HuobiOrderTypeEnum } from '../../enums/HuobiOrderTypeEnum'
import { HUOBI_RAW_MARKETS_WITH_CURRENCY } from '../../test/fixtures/huobiMarket'
import { HUOBI_RAW_ORDER } from '../../test/fixtures/huobiOrder'
import { IHuobiOrderSchema } from '../IHuobiOrderSchema'
import { HuobiOrderParser } from './HuobiOrderParser'



describe('HuobiOrderParser', () => {

  const translatedSymbol = 'ETH'

  const mockDeps = () => {

    const { alunaSymbolMappingMock } = mockAlunaSymbolMapping({
      returnSymbol: translatedSymbol,
    })

    return { alunaSymbolMappingMock }

  }

  it('should parseHuobi order just fine', async () => {

    const { alunaSymbolMappingMock } = mockDeps()

    const rawOrder: IHuobiOrderSchema = HUOBI_RAW_ORDER

    const { symbol: currencyPair } = rawOrder

    const symbolInfo = HUOBI_RAW_MARKETS_WITH_CURRENCY.find(
      (rm) => rm.symbol === currencyPair,
    )

    const parsedOrder = HuobiOrderParser.parse({
      rawOrder,
      symbolInfo: symbolInfo!,
    })

    const rawOriginalQuantity = parseFloat(rawOrder.amount)
    const rawPrice = parseFloat(rawOrder.price)
    const rawSide = rawOrder.type.split('-')[0] as HuobiOrderSideEnum
    const rawType = rawOrder.type.split('-')[1] as HuobiOrderTypeEnum
    const rawStatus = rawOrder.state

    expect(parsedOrder.id).to.be.eq(rawOrder.id)
    expect(parsedOrder.baseSymbolId).to.be.eq(translatedSymbol)
    expect(parsedOrder.quoteSymbolId).to.be.eq(translatedSymbol)
    expect(parsedOrder.symbolPair).to.be.eq(rawOrder.symbol)
    expect(parsedOrder.total).to.be.eq(rawOriginalQuantity * rawPrice)
    expect(parsedOrder.amount).to.be.eq(rawOriginalQuantity)
    expect(parsedOrder.rate).to.be.eq(rawPrice)
    expect(parsedOrder.account).to.be.eq(AlunaAccountEnum.EXCHANGE)

    expect(parsedOrder.side)
      .to.be.eq(HuobiOrderSideAdapter.translateToAluna({ from: rawSide }))
    expect(parsedOrder.status)
      .to.be.eq(HuobiStatusAdapter.translateToAluna({ from: rawStatus }))
    expect(parsedOrder.type)
      .to.be.eq(HuobiOrderTypeAdapter.translateToAluna({ from: rawType }))
    expect(parsedOrder.placedAt.getTime())
      .to.be.eq(new Date(rawOrder['created-at']).getTime())

    expect(alunaSymbolMappingMock.callCount).to.be.eq(2)

  })

  it('should parseHuobi order just fine with updateTime', async () => {

    const { alunaSymbolMappingMock } = mockDeps()

    const rawOrder: IHuobiOrderSchema = HUOBI_RAW_ORDER

    const { symbol: currencyPair } = rawOrder

    const symbolInfo = HUOBI_RAW_MARKETS_WITH_CURRENCY.find(
      (rm) => rm.symbol === currencyPair,
    )

    rawOrder['created-at'] = new Date().getTime()
    rawOrder.state = HuobiOrderStatusEnum.CANCELED

    const parsedOrder = HuobiOrderParser.parse({
      rawOrder,
      symbolInfo: symbolInfo!,
    })

    expect(alunaSymbolMappingMock.callCount).to.be.eq(2)
    expect(alunaSymbolMappingMock.args[0][0]).to.deep.eq({
      exchangeSymbolId: symbolInfo!.baseCurrency,
      symbolMappings: {},
    })
    expect(alunaSymbolMappingMock.args[1][0]).to.deep.eq({
      exchangeSymbolId: symbolInfo!.quoteCurrency,
      symbolMappings: {},
    })

    const updatedAt = new Date().getTime()

    expect(parsedOrder.canceledAt?.getTime()).to.be.eq(updatedAt)

    rawOrder.state = HuobiOrderStatusEnum.FILLED

    const parsedOrder2 = HuobiOrderParser.parse({
      rawOrder,
      symbolInfo: symbolInfo!,
    })

    expect(parsedOrder2.filledAt?.getTime()).to.be.eq(updatedAt)

    expect(alunaSymbolMappingMock.callCount).to.be.eq(4)
    expect(alunaSymbolMappingMock.args[2][0]).to.deep.eq({
      exchangeSymbolId: symbolInfo!.baseCurrency,
      symbolMappings: {},
    })
    expect(alunaSymbolMappingMock.args[3][0]).to.deep.eq({
      exchangeSymbolId: symbolInfo!.quoteCurrency,
      symbolMappings: {},
    })

  })

})
