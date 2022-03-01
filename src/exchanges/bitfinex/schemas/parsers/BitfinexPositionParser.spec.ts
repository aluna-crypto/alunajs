import { expect } from 'chai'

import { AlunaPositionStatusEnum } from '../../../../lib/enums/AlunaPositionStatusEnum'
import { Bitfinex } from '../../Bitfinex'
import { BitfinexPositionStatusEnum } from '../../enums/BitfinexPositionStatusEnum'
import { BITFINEX_RAW_POSITIONS } from '../../test/fixtures/bitfinexPosition'
import { BitfinexPositionParser } from './BitfinexPositionParser'



describe('BitfinexPositionParser', () => {

  it('should parse Bitfinex positions just fine', async () => {

    const mappings = {
      UST: 'USDT',
    }

    BITFINEX_RAW_POSITIONS.forEach((rawPosition) => {

      if (/^f|F0/.test(rawPosition[0])) {

        return

      }

      const positionSymbol = rawPosition[0]
      let baseSymbolId: string
      let quoteSymbolId: string

      const spliter = rawPosition[0].indexOf(':')

      if (spliter >= 0) {

        baseSymbolId = positionSymbol.slice(1, spliter)
        quoteSymbolId = positionSymbol.slice(spliter + 1)

      } else {

        baseSymbolId = positionSymbol.slice(1, 4)
        quoteSymbolId = positionSymbol.slice(4)

      }

      const expectedBaseSymbolId = mappings[baseSymbolId] || baseSymbolId
      const expectedQuoteSymbolId = mappings[quoteSymbolId] || quoteSymbolId

      const parsedPosition = BitfinexPositionParser.parse({
        rawPosition,
      })

      const [
        _symbol,
        status,
        amount,
        basePrice,
        _funding,
        _fundingType,
        pl,
        plPerc,
        priceLiq,
        leverage,
        _placeholder1,
        positionId,
        mtsCreate,
        mtsUpdate,
        _placeholder2,
        _type,
        _placeholder3,
        _collateral,
        _collateralMin,
        meta,
      ] = rawPosition

      const computedStatus = status === BitfinexPositionStatusEnum.ACTIVE
        ? AlunaPositionStatusEnum.OPEN
        : AlunaPositionStatusEnum.CLOSED

      let computedAmount

      if (amount === 0) {

        computedAmount = Math.abs(Number(meta.trade_amount))

      } else {

        computedAmount = Math.abs(amount)

      }

      const computedBasePrice = Number(basePrice)
      const computedOpenPrice = Number(meta.trade_price)

      const computedTotal = computedAmount * computedBasePrice

      const computedPl = pl !== null ? pl : 0
      const computedPlPercentage = plPerc !== null ? plPerc : 0
      const computedLiquidationPrice = priceLiq !== null ? priceLiq : 0
      const computedLeverage = leverage !== null ? leverage : 0

      const computedOpenedAt = mtsCreate
        ? new Date(mtsCreate)
        : new Date()

      let computedClosedAt
      let computedClosePrice

      if (mtsUpdate && (computedStatus === AlunaPositionStatusEnum.CLOSED)) {

        computedClosedAt = new Date(mtsUpdate)

        computedClosePrice = Number(computedBasePrice)

      }

      expect(parsedPosition.exchangeId).to.be.eq(Bitfinex.ID)

      expect(parsedPosition.id).to.be.eq(positionId)

      expect(parsedPosition.baseSymbolId).to.be.eq(expectedBaseSymbolId)
      expect(parsedPosition.quoteSymbolId).to.be.eq(expectedQuoteSymbolId)

      expect(parsedPosition.status).to.be.eq(computedStatus)

      expect(parsedPosition.basePrice).to.be.eq(computedBasePrice)
      expect(parsedPosition.openPrice).to.be.eq(computedOpenPrice)
      expect(parsedPosition.amount).to.be.eq(computedAmount)
      expect(parsedPosition.total).to.be.eq(computedTotal)


      expect(parsedPosition.pl).to.be.eq(computedPl)
      expect(parsedPosition.plPercentage).to.be.eq(computedPlPercentage)
      expect(parsedPosition.liquidationPrice).to.be.eq(computedLiquidationPrice)
      expect(parsedPosition.leverage).to.be.eq(computedLeverage)

      expect(parsedPosition.openedAt).to.deep.eq(computedOpenedAt)
      expect(parsedPosition.closedAt).to.deep.eq(computedClosedAt)
      expect(parsedPosition.closePrice).to.deep.eq(computedClosePrice)

    })

  })

})
