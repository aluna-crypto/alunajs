import { expect } from 'chai'

import { AlunaAccountEnum } from '../../../../lib/enums/AlunaAccountEnum'
import { PoloniexOrderTypeAdapter } from '../../enums/adapters/PoloniexOrderTypeAdapter'
import { PoloniexSideAdapter } from '../../enums/adapters/PoloniexSideAdapter'
import { PoloniexStatusAdapter } from '../../enums/adapters/PoloniexStatusAdapter'
import { POLONIEX_RAW_LIMIT_ORDER } from '../../test/fixtures/poloniexOrder'
import { IPoloniexOrderStatusInfo } from '../IPoloniexOrderSchema'
import { PoloniexOrderParser } from './PoloniexOrderParser'



describe('PoloniexOrderParser', () => {

  it('should parse limit Poloniex order just fine', async () => {

    const rawOrder: IPoloniexOrderStatusInfo = POLONIEX_RAW_LIMIT_ORDER

    const parsedOrder = PoloniexOrderParser.parse({
      rawOrder,
    })

    const rawOriginalQuantity = rawOrder.amount
    const rawPrice = rawOrder.rate
    const rawType = rawOrder.type
    const rawStatus = rawOrder.status
    const rawSide = rawOrder.type
    const rawTotal = rawOrder.total

    expect(parsedOrder.id).to.be.eq(rawOrder.orderNumber)
    expect(parsedOrder.symbolPair).to.be.eq(rawOrder.currencyPair)
    expect(parsedOrder.total).to.be.eq(
      parseFloat(rawTotal),
    )
    expect(parsedOrder.amount).to.be.eq(parseFloat(rawOriginalQuantity))
    expect(parsedOrder.rate).to.be.eq(parseFloat(rawPrice))
    expect(parsedOrder.account).to.be.eq(AlunaAccountEnum.EXCHANGE)

    expect(parsedOrder.side)
      .to.be.eq(PoloniexSideAdapter.translateToAluna({ from: rawSide }))
    expect(parsedOrder.status)
      .to.be.eq(PoloniexStatusAdapter.translateToAluna({
        from: rawStatus,
      }))
    expect(parsedOrder.type)
      .to.be.eq(PoloniexOrderTypeAdapter.translateToAluna({ from: rawType }))
    expect(parsedOrder.placedAt.getTime())
      .to.be.eq(new Date(rawOrder.date).getTime())

  })



})
