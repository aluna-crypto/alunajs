import { expect } from 'chai'

import { AlunaOrderStatusEnum } from '../../../../lib/enums/AlunaOrderStatusEnum'
import { AlunaOrderTypesEnum } from '../../../../lib/enums/AlunaOrderTypesEnum'
import { AlunaSideEnum } from '../../../../lib/enums/AlunaSideEnum'
import { Bitfinex } from '../../Bitfinex'
import { BitfinexAccountsAdapter } from '../../enums/adapters/BitfinexAccountsAdapter'
import { BitfinexOrderStatusAdapter } from '../../enums/adapters/BitfinexOrderStatusAdapter'
import { BitfinexOrderTypeAdapter } from '../../enums/adapters/BitfinexOrderTypeAdapter'
import { BITFINEX_RAW_ORDERS } from '../../test/fixtures/bitfinexOrders'
import { BitfinexOrderParser } from './BitfinexOrderParser'



describe('BitfinexOrderParser', () => {

  it('should parse Bitfinex raw order just fine', async () => {

    BITFINEX_RAW_ORDERS.forEach((rawOrder) => {

      let baseSymbolId: string
      let quoteSymbolId: string

      const rawSymbolPair = rawOrder[3]

      const spliter = rawSymbolPair.indexOf(':')

      if (spliter >= 0) {

        baseSymbolId = rawSymbolPair.slice(1, spliter)
        quoteSymbolId = rawSymbolPair.slice(spliter + 1)

      } else {

        baseSymbolId = rawSymbolPair.slice(1, 4)
        quoteSymbolId = rawSymbolPair.slice(4)

      }

      const parsedOrder = BitfinexOrderParser.parse({
        rawOrder,
      })

      const [
        id,
        _gid,
        _cid,
        _symbolPair,
        mtsCreate,
        mtsUpdate,
        _amount,
        amountOrig,
        orderType,
        _typePrev,
        _placeholder1,
        _placeholder2,
        _flags,
        orderStatus,
        _placeholder3,
        _placeholder4,
        price,
        priceAvg,
        _priceTrailing,
        priceAuxLimit,
      ] = rawOrder

      let expectedRate
      let expectedStopRate
      let expectedLimitRate


      const expectedStatus = BitfinexOrderStatusAdapter.translateToAluna({
        from: orderStatus,
      })

      const expectedAccount = BitfinexAccountsAdapter.translateToAluna({
        value: orderType,
      })

      const expectedType = BitfinexOrderTypeAdapter.translateToAluna({
        from: orderType,
      })

      const expectedSide = amountOrig > 0
        ? AlunaSideEnum.LONG
        : AlunaSideEnum.SHORT

      const fixedPrice = price || priceAvg
      let computedPrice = fixedPrice

      if (expectedType === AlunaOrderTypesEnum.STOP_LIMIT) {

        expectedStopRate = fixedPrice
        expectedLimitRate = priceAuxLimit
        computedPrice = priceAuxLimit

      } else if (expectedType === AlunaOrderTypesEnum.STOP_MARKET) {

        expectedStopRate = fixedPrice

      } else {

        expectedRate = fixedPrice

      }

      let expectedFilledAt: Date | undefined
      let expectedCanceledAt: Date | undefined

      if (expectedStatus === AlunaOrderStatusEnum.FILLED) {

        expectedFilledAt = new Date(mtsUpdate)

      } else if (expectedStatus === AlunaOrderStatusEnum.CANCELED) {

        expectedCanceledAt = new Date(mtsUpdate)

      }

      expect(parsedOrder.id).to.be.eq(id)
      expect(parsedOrder.symbolPair).to.be.eq(rawSymbolPair)

      expect(parsedOrder.exchangeId).to.be.eq(Bitfinex.ID)
      expect(parsedOrder.baseSymbolId).to.be.eq(baseSymbolId)
      expect(parsedOrder.quoteSymbolId).to.be.eq(quoteSymbolId)

      expect(parsedOrder.amount).to.be.eq(Math.abs(amountOrig))
      expect(parsedOrder.total).to.be.eq(computedPrice * parsedOrder.amount)
      expect(parsedOrder.uiCustomDisplay).not.to.be.ok

      expect(parsedOrder.rate).to.be.eq(expectedRate)
      expect(parsedOrder.limitRate).to.be.eq(expectedLimitRate)
      expect(parsedOrder.stopRate).to.be.eq(expectedStopRate)

      expect(parsedOrder.account).to.be.eq(expectedAccount)
      expect(parsedOrder.side).to.be.eq(expectedSide)
      expect(parsedOrder.status).to.be.eq(expectedStatus)
      expect(parsedOrder.type).to.be.eq(expectedType)

      expect(parsedOrder.placedAt).to.deep.eq(new Date(mtsCreate))
      expect(parsedOrder.filledAt).to.deep.eq(expectedFilledAt)
      expect(parsedOrder.canceledAt).to.deep.eq(expectedCanceledAt)

      expect(parsedOrder.meta).to.be.eq(rawOrder)

    })

  })

})
