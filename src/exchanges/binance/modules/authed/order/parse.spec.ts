import { expect } from 'chai'

import { AlunaAccountEnum } from '../../../../../lib/enums/AlunaAccountEnum'
import { IAlunaCredentialsSchema } from '../../../../../lib/schemas/IAlunaCredentialsSchema'
import { mockTranslateSymbolId } from '../../../../../utils/mappings/translateSymbolId.mock'
import { BinanceAuthed } from '../../../BinanceAuthed'
import { translateOrderSideToAluna } from '../../../enums/adapters/binanceOrderSideAdapter'
import { translateOrderStatusToAluna } from '../../../enums/adapters/binanceOrderStatusAdapter'
import { translateOrderTypeToAluna } from '../../../enums/adapters/binanceOrderTypeAdapter'
import { BINANCE_RAW_ORDERS } from '../../../test/fixtures/binanceOrders'
import { BINANCE_RAW_SYMBOLS } from '../../../test/fixtures/binanceSymbols'



describe(__filename, () => {

  const credentials: IAlunaCredentialsSchema = {
    key: 'key',
    secret: 'secret',
  }

  it('should parse a Binance raw order just fine', async () => {

    // preparing data
    const rawOrder = BINANCE_RAW_ORDERS[0]
    const rawSymbol = BINANCE_RAW_SYMBOLS[0]

    const rawOrderRequest = {
      rawOrder,
      rawSymbol,
    }

    const {
      baseAsset,
      quoteAsset,
    } = rawSymbol

    const {
      side,
      orderId,
      symbol,
      type,
      status,
    } = rawOrder

    const exchange = new BinanceAuthed({ credentials })

    // mocking

    const { translateSymbolId } = mockTranslateSymbolId()

    translateSymbolId.onFirstCall().returns(baseAsset)
    translateSymbolId.onSecondCall().returns(quoteAsset)

    const orderStatus = translateOrderStatusToAluna({ from: status })
    const orderSide = translateOrderSideToAluna({ from: side })
    const orderType = translateOrderTypeToAluna({ from: type })

    // executing
    const { order } = exchange.order.parse({ rawOrder: rawOrderRequest })

    // validating
    expect(order).to.exist

    // TODO -> Need to validate other properties
    expect(order.id).to.be.eq(orderId.toString())
    expect(order.symbolPair).to.be.eq(symbol.toString())
    expect(order.exchangeId).to.be.eq(exchange.id)
    expect(order.baseSymbolId).to.be.eq(baseAsset)
    expect(order.quoteSymbolId).to.be.eq(quoteAsset)
    expect(order.account).to.be.eq(AlunaAccountEnum.EXCHANGE)
    expect(order.status).to.be.eq(orderStatus)
    expect(order.side).to.be.eq(orderSide)
    expect(order.type).to.be.eq(orderType)

  })

})
