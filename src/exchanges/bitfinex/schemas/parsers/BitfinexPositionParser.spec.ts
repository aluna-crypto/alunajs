import { expect } from 'chai'

import { AlunaPositionStatusEnum } from '../../../../lib/enums/AlunaPositionStatusEnum'
import { Bitfinex } from '../../Bitfinex'
import { BitfinexPositionStatusEnum } from '../../enums/BitfinexPositionStatusEnum'
import { BITFINEX_RAW_POSITIONS } from '../../test/fixtures/bitfinexPosition'
import { BitfinexPositionParser } from './BitfinexPositionParser'



describe('BitfinexPositionParser', () => {

  it('should parse Bitfinex positions just fine', async () => {

    BITFINEX_RAW_POSITIONS.forEach((rawPosition) => {

      if (/^f|F0/.test(rawPosition[0])) {

        return

      }

      const parsedPosition = BitfinexPositionParser.parse({
        rawPosition,
      })

      const [
        symbol,
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

      let computedBaseSymbolId: string
      let computedQuoteSymbolId: string

      const spliter = symbol.indexOf(':')

      if (spliter >= 0) {

        computedBaseSymbolId = symbol.slice(1, spliter)
        computedQuoteSymbolId = symbol.slice(spliter + 1)

      } else {

        computedBaseSymbolId = symbol.slice(1, 4)
        computedQuoteSymbolId = symbol.slice(4)

      }

      const computedStatus = status === BitfinexPositionStatusEnum.ACTIVE
        ? AlunaPositionStatusEnum.OPEN
        : AlunaPositionStatusEnum.CLOSED

      const computedBasePrice = Number(basePrice)
      const computedAmount = Math.abs(Number(amount))
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

        computedClosePrice = Number(meta?.trade_price)

      }

      expect(parsedPosition.exchangeId).to.be.eq(Bitfinex.ID)

      expect(parsedPosition.id).to.be.eq(positionId)

      expect(parsedPosition.baseSymbolId).to.be.eq(computedBaseSymbolId)
      expect(parsedPosition.quoteSymbolId).to.be.eq(computedQuoteSymbolId)

      expect(parsedPosition.status).to.be.eq(computedStatus)

      expect(parsedPosition.basePrice).to.be.eq(computedBasePrice)
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
