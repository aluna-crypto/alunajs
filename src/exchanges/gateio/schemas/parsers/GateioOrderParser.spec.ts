import { expect } from 'chai'

import { AlunaAccountEnum } from '../../../../lib/enums/AlunaAccountEnum'
import { mockAlunaSymbolMapping } from '../../../../utils/mappings/AlunaSymbolMapping.mock'
import { GateioOrderTypeAdapter } from '../../enums/adapters/GateioOrderTypeAdapter'
import { GateioSideAdapter } from '../../enums/adapters/GateioSideAdapter'
import { GateioStatusAdapter } from '../../enums/adapters/GateioStatusAdapter'
import { GateioOrderStatusEnum } from '../../enums/GateioOrderStatusEnum'
import { GATEIO_RAW_ORDER } from '../../test/fixtures/gateioOrder'
import { IGateioOrderSchema } from '../IGateioOrderSchema'
import { GateioOrderParser } from './GateioOrderParser'



describe('GateioOrderParser', () => {

  it('should parse Gateio order just fine', async () => {

    const translatedSymbolId = 'ETH'

    const { alunaSymbolMappingMock } = mockAlunaSymbolMapping({
      returnSymbol: translatedSymbolId,
    })

    const rawOrder: IGateioOrderSchema = GATEIO_RAW_ORDER

    const parsedOrder = GateioOrderParser.parse({
      rawOrder,
    })

    const rawOriginalQuantity = Number(rawOrder.amount)
    const rawPrice = Number(rawOrder.price)
    const rawSide = rawOrder.side
    const rawType = rawOrder.type
    const rawStatus = rawOrder.status
    const rawLeftToFill = Number(rawOrder.left)
    const [baseCurrency, quoteCurrency] = rawOrder.currency_pair.split('_')

    expect(parsedOrder.id).to.be.eq(rawOrder.id)
    expect(parsedOrder.symbolPair).to.be.eq(rawOrder.currency_pair)
    expect(parsedOrder.baseSymbolId).to.be.eq(translatedSymbolId)
    expect(parsedOrder.quoteSymbolId).to.be.eq(translatedSymbolId)
    expect(parsedOrder.total).to.be.eq(rawOriginalQuantity * rawPrice)
    expect(parsedOrder.amount).to.be.eq(rawOriginalQuantity)
    expect(parsedOrder.rate).to.be.eq(rawPrice)
    expect(parsedOrder.account).to.be.eq(AlunaAccountEnum.EXCHANGE)

    expect(parsedOrder.side)
      .to.be.eq(GateioSideAdapter.translateToAluna({ from: rawSide }))
    expect(parsedOrder.status).to.be.eq(GateioStatusAdapter.translateToAluna({
      from: rawStatus,
      leftToFill: rawLeftToFill,
      amount: rawOriginalQuantity,
    }))
    expect(parsedOrder.type)
      .to.be.eq(GateioOrderTypeAdapter.translateToAluna({ from: rawType }))
    expect(parsedOrder.placedAt.getTime())
      .to.be.eq(new Date(rawOrder.create_time_ms).getTime())

    expect(alunaSymbolMappingMock.callCount).to.be.eq(2)
    expect(alunaSymbolMappingMock.args[0][0]).to.deep.eq({
      exchangeSymbolId: baseCurrency,
      symbolMappings: {},
    })
    expect(alunaSymbolMappingMock.args[1][0]).to.deep.eq({
      exchangeSymbolId: quoteCurrency,
      symbolMappings: {},
    })

  })

  it('should parse Gateio order just fine with updateTime', async () => {

    const rawOrder: IGateioOrderSchema = GATEIO_RAW_ORDER

    rawOrder.status = GateioOrderStatusEnum.CANCELLED

    const parsedOrder = GateioOrderParser.parse({
      rawOrder,
    })

    const updatedAt = new Date(rawOrder.update_time_ms).getTime()

    expect(parsedOrder.canceledAt?.getTime())
      .to.be.eq(updatedAt)

    rawOrder.status = GateioOrderStatusEnum.CLOSED

    const parsedOrder2 = GateioOrderParser.parse({
      rawOrder,
    })

    expect(parsedOrder2.filledAt?.getTime())
      .to.be.eq(updatedAt)

  })

})
