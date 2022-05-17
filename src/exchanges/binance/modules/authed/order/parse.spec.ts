import { expect } from 'chai'
import {
  cloneDeep,
  each,
  forIn,
} from 'lodash'

import { AlunaAccountEnum } from '../../../../../lib/enums/AlunaAccountEnum'
import { IAlunaCredentialsSchema } from '../../../../../lib/schemas/IAlunaCredentialsSchema'
import { mockTranslateSymbolId } from '../../../../../utils/mappings/translateSymbolId.mock'
import { BinanceAuthed } from '../../../BinanceAuthed'
import { translateOrderSideToAluna } from '../../../enums/adapters/binanceOrderSideAdapter'
import { translateOrderStatusToAluna } from '../../../enums/adapters/binanceOrderStatusAdapter'
import { translateOrderTypeToAluna } from '../../../enums/adapters/binanceOrderTypeAdapter'
import { BinanceOrderStatusEnum } from '../../../enums/BinanceOrderStatusEnum'
import { IBinanceOrderResponseSchema } from '../../../schemas/IBinanceOrderSchema'
import { BINANCE_RAW_ORDERS } from '../../../test/fixtures/binanceOrders'
import { BINANCE_RAW_SYMBOLS } from '../../../test/fixtures/binanceSymbols'



describe(__filename, () => {

  const credentials: IAlunaCredentialsSchema = {
    key: 'key',
    secret: 'secret',
  }

  const binanceOrder = cloneDeep(BINANCE_RAW_ORDERS[0])
  binanceOrder.updateTime = undefined
  binanceOrder.fills = undefined
  binanceOrder.status = BinanceOrderStatusEnum.NEW

  const testCasesLabels = [
    '(SPOT)',
    '(MARGIN)',
    '(FILLED)',
    '(FILLED MARKET)',
    '(CANCELED)',
    '(W/ TIME)',
    '(W/ TRANSACTTIME)',
    '(W/O TIME)',
  ]

  const testCasesProps = [
    { isIsolated: undefined },
    { isIsolated: false },
    { status: BinanceOrderStatusEnum.FILLED },
    { status: BinanceOrderStatusEnum.FILLED, fills: [{ price: binanceOrder.price }] },
    { status: BinanceOrderStatusEnum.CANCELED, updateTime: Date.now() },
    { time: Date.now(), transactTime: undefined },
    { time: undefined, transactTime: Date.now() },
    { time: undefined, transactTime: undefined },
  ]


  each(testCasesLabels, (testCase, index) => {

    it(`should parse a Binance open raw order just fine ${testCase}`, async () => {

      // preparing data
      const props = testCasesProps[index]
      forIn(props, (value, key) => {
        binanceOrder[key] = value
      })

      const rawSymbol = BINANCE_RAW_SYMBOLS[0]

      const rawOrder: IBinanceOrderResponseSchema = {
        binanceOrder,
        rawSymbol,
      }


      // mocking
      const { translateSymbolId } = mockTranslateSymbolId()

      const {
        baseAsset,
        quoteAsset,
      } = rawSymbol

      translateSymbolId.onFirstCall().returns(baseAsset)
      translateSymbolId.onSecondCall().returns(quoteAsset)


      // executing
      const exchange = new BinanceAuthed({ credentials })

      const { order } = exchange.order.parse({ rawOrder })


      // validating
      expect(order).to.exist

      const {
        side,
        orderId,
        symbol,
        type,
        status,
        price,
        isIsolated,
      } = binanceOrder

      const rate = Number(price)

      const orderStatus = translateOrderStatusToAluna({ from: status })
      const orderSide = translateOrderSideToAluna({ from: side })
      const orderType = translateOrderTypeToAluna({ from: type })

      const account = isIsolated === undefined
        ? AlunaAccountEnum.SPOT
        : AlunaAccountEnum.MARGIN


      expect(order.id).to.be.eq(orderId.toString())
      expect(order.symbolPair).to.be.eq(symbol.toString())
      expect(order.exchangeId).to.be.eq(exchange.id)
      expect(order.baseSymbolId).to.be.eq(baseAsset)
      expect(order.quoteSymbolId).to.be.eq(quoteAsset)
      expect(order.account).to.be.eq(account)
      expect(order.rate).to.be.eq(rate)
      expect(order.status).to.be.eq(orderStatus)
      expect(order.side).to.be.eq(orderSide)
      expect(order.type).to.be.eq(orderType)

      expect(translateSymbolId.callCount).to.be.eq(2)
      expect(translateSymbolId.firstCall.args[0]).to.deep.eq({
        exchangeSymbolId: rawSymbol.baseAsset,
        symbolMappings: exchange.settings.symbolMappings,
      })
      expect(translateSymbolId.secondCall.args[0]).to.deep.eq({
        exchangeSymbolId: rawSymbol.quoteAsset,
        symbolMappings: exchange.settings.symbolMappings,
      })

    })

  })

})
