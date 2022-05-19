import { expect } from 'chai'

import { IAlunaCredentialsSchema } from '../../../../../lib/schemas/IAlunaCredentialsSchema'
import { translateOrderSideToAluna } from '../../../enums/adapters/okxOrderSideAdapter'
import { translateOrderStatusToAluna } from '../../../enums/adapters/okxOrderStatusAdapter'
import { translateOrderTypeToAluna } from '../../../enums/adapters/okxOrderTypeAdapter'
import { OkxAuthed } from '../../../OkxAuthed'
import { OKX_RAW_ORDERS } from '../../../test/fixtures/okxOrders'
import { mockTranslateSymbolId } from '../../../../../utils/mappings/translateSymbolId.mock'



describe(__filename, () => {

  const credentials: IAlunaCredentialsSchema = {
    key: 'key',
    secret: 'secret',
  }

  it('should parse a Okx raw order just fine', async () => {

    // preparing data
    const rawOrder = OKX_RAW_ORDERS[0]

    const {
      side,
      cTime,
      instId,
      ordId,
      px,
      state,
      sz,
      ordType,
      ccy,
      tgtCcy,
    } = rawOrder

    const amount = Number(sz)
    const rate = Number(px)
    const total = amount * rate

    const orderStatus = translateOrderStatusToAluna({ from: state })
    const orderSide = translateOrderSideToAluna({ from: side })
    const orderType = translateOrderTypeToAluna({ from: ordType })

    // mocking

    const { translateSymbolId } = mockTranslateSymbolId()

    translateSymbolId.onFirstCall().returns(ccy)

    translateSymbolId.onSecondCall().returns(tgtCcy)

    const exchange = new OkxAuthed({ credentials })


    // executing
    const { order } = exchange.order.parse({ rawOrder })


    // validating
    expect(order).to.exist

    expect(order.id).to.be.eq(ordId)
    expect(order.symbolPair).to.be.eq(instId)
    expect(order.status).to.be.eq(orderStatus)
    expect(order.side).to.be.eq(orderSide)
    expect(order.type).to.be.eq(orderType)
    expect(order.baseSymbolId).to.be.eq(ccy)
    expect(order.quoteSymbolId).to.be.eq(tgtCcy)
    expect(order.total).to.be.eq(total)
    expect(order.amount).to.be.eq(amount)
    expect(order.placedAt.getTime()).to.be.eq(new Date(Number(cTime)).getTime())

    expect(translateSymbolId.callCount).to.be.eq(2)

  })

})
