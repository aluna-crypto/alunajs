import { expect } from 'chai'
import { ImportMock } from 'ts-mock-imports'

import { AlunaPositionStatusEnum } from '../../../../lib/enums/AlunaPositionStatusEnum'
import { mockAlunaSymbolMapping } from '../../../../utils/mappings/AlunaSymbolMapping.mock'
import { Bitfinex } from '../../Bitfinex'
import { BitfinexPositionSideAdapter } from '../../enums/adapters/BitfinexPositionSideAdapter'
import { BitfinexPositionStatusEnum } from '../../enums/BitfinexPositionStatusEnum'
import { BITFINEX_RAW_POSITIONS } from '../../test/fixtures/bitfinexPosition'
import { BitfinexPositionParser } from './BitfinexPositionParser'
import { BitfinexSymbolParser } from './BitfinexSymbolParser'



describe('BitfinexPositionParser', () => {

  it('should parse Bitfinex positions just fine', async () => {

    const mockedSymbolId = 'BTC'

    const baseSymbolId = mockedSymbolId
    const quoteSymbolId = mockedSymbolId

    const splitSymbolPairMock = ImportMock.mockFunction(
      BitfinexSymbolParser,
      'splitSymbolPair',
      {
        baseSymbolId,
        quoteSymbolId,
      },
    )

    const { alunaSymbolMappingMock } = mockAlunaSymbolMapping({
      returnSymbol: mockedSymbolId,
    })

    const mockedDate = new Date(Date.now())

    function fakeDateConstructor () {

      return mockedDate

    }

    ImportMock.mockOther(
      global,
      'Date',
      fakeDateConstructor as any,
    )

    BITFINEX_RAW_POSITIONS.forEach((rawPosition, index) => {

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

      const expectedSide = BitfinexPositionSideAdapter.translateToAluna({
        amount,
      })

      expect(parsedPosition.exchangeId).to.be.eq(Bitfinex.ID)

      expect(parsedPosition.id).to.be.eq(positionId)

      expect(parsedPosition.symbolPair).to.be.eq(symbol)
      expect(parsedPosition.baseSymbolId).to.be.eq(baseSymbolId)
      expect(parsedPosition.quoteSymbolId).to.be.eq(quoteSymbolId)

      expect(parsedPosition.status).to.be.eq(computedStatus)
      expect(parsedPosition.side).to.be.eq(expectedSide)

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

      expect(splitSymbolPairMock.callCount).to.be.eq(index + 1)

      const symbolMockCallCount = index === 0
        ? 2
        : (index + 1) * 2

      expect(alunaSymbolMappingMock.callCount).to.be.eq(symbolMockCallCount)

    })

  })

})
