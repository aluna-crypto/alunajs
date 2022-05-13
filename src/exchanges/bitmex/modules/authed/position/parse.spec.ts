import BigNumber from 'bignumber.js'
import { expect } from 'chai'
import {
  cloneDeep,
  each,
} from 'lodash'
import { ImportMock } from 'ts-mock-imports'

import { PARSED_MARKETS } from '../../../../../../test/fixtures/parsedMarkets'
import { AlunaAccountEnum } from '../../../../../lib/enums/AlunaAccountEnum'
import { AlunaPositionStatusEnum } from '../../../../../lib/enums/AlunaPositionStatusEnum'
import { IAlunaCredentialsSchema } from '../../../../../lib/schemas/IAlunaCredentialsSchema'
import { BitmexAuthed } from '../../../BitmexAuthed'
import { translatePositionSideToAluna } from '../../../enums/adapters/bitmexPositionSideAdapter'
import { BitmexSettlementCurrencyEnum } from '../../../enums/BitmexSettlementCurrencyEnum'
import { IBitmexPositionSchema } from '../../../schemas/IBitmexPositionSchema'
import { BITMEX_RAW_POSITIONS } from '../../../test/fixtures/bitmexPositions'
import { mockComputeOrderAmount } from '../order/helpers/computeOrderAmount.mock'
import { mockComputeOrderTotal } from '../order/helpers/computeOrderTotal.mock'
import { mockAssembleUIPositionCustomDisplay } from './helpers/assembleUIPositionCustomDisplay.mock'



describe(__filename, () => {

  const credentials: IAlunaCredentialsSchema = {
    key: 'key',
    secret: 'secret',
  }

  const testsCasesArr: Array<[string, string, boolean]> = [
    ['(OPEN)', 'isOpen', true],
    ['(CLOSED)', 'isOpen', false],
    ['(W/ LEVEREGE)', 'crossMargin', true],
    ['(W/O LEVEREGE)', 'crossMargin', false],
  ]

  each(testsCasesArr, (params, index) => {

    const [testCase, positionPropName, positionPropValue] = params

    it(`should parse a Bitmex raw position just fine ${testCase}`, async () => {

      // preparing data
      const bitmexPosition = cloneDeep(BITMEX_RAW_POSITIONS[0])
      bitmexPosition[positionPropName] = positionPropValue

      const market = cloneDeep(PARSED_MARKETS[0])
      const totalSymbolId = index % 2 === 0
        ? BitmexSettlementCurrencyEnum.BTC
        : BitmexSettlementCurrencyEnum.USDT
      const mockedInstrument = {
        totalSymbolId,
      } as any
      market.instrument = mockedInstrument


      // mocking
      const uiCustomDisplay = {}
      const { assembleUIPositionCustomDisplay } = mockAssembleUIPositionCustomDisplay()
      assembleUIPositionCustomDisplay.returns({ uiCustomDisplay })

      const amount = 10
      const { computeOrderAmount } = mockComputeOrderAmount()
      computeOrderAmount.returns({ amount })

      const total = 100
      const { computeOrderTotal } = mockComputeOrderTotal()
      computeOrderTotal.returns({ total })

      const dateNow = Date.now()
      const mockedDate = new Date(dateNow)

      function fakeDateConstructor() {

        return mockedDate

      }

      ImportMock.mockOther(
        global,
        'Date',
        fakeDateConstructor as any,
      )


      // executing
      const exchange = new BitmexAuthed({ credentials })

      const rawPosition: IBitmexPositionSchema = {
        bitmexPosition,
        market,
      }

      const { position } = exchange.position!.parse({
        rawPosition,
      })


      // validating
      const {
        currentQty,
        avgCostPrice,
        avgEntryPrice,
        homeNotional,
        liquidationPrice,
        unrealisedPnl,
        unrealisedRoePcnt,
        symbol,
        leverage,
        crossMargin,
        openingTimestamp,
        prevClosePrice,
        isOpen,
      } = bitmexPosition

      const {
        baseSymbolId,
        quoteSymbolId,
      } = market

      const instrument = market.instrument!

      const expectedOpenedAt = new Date(openingTimestamp)

      let expectedStatus: AlunaPositionStatusEnum
      let expectedClosedAt: Date | undefined
      let expectedClosePrice: number | undefined

      if (isOpen) {

        expectedStatus = AlunaPositionStatusEnum.OPEN

      } else {

        expectedClosedAt = new Date()

        expectedStatus = AlunaPositionStatusEnum.CLOSED

        expectedClosePrice = prevClosePrice

      }

      const expectedBasePrice = avgCostPrice
      const expectedOpenPrice = avgEntryPrice

      const bigNumber = new BigNumber(unrealisedPnl)
      const pl = instrument.totalSymbolId === BitmexSettlementCurrencyEnum.BTC
        ? bigNumber.times(10 ** -8).toNumber()
        : bigNumber.times(10 ** -6).toNumber()

      const expectedPlPercentage = unrealisedRoePcnt

      const expectedSide = translatePositionSideToAluna({
        homeNotional,
      })

      const expectedLeverage = crossMargin
        ? undefined
        : leverage

      const expectedCrossMargin = !!crossMargin

      expect(position.symbolPair).to.be.eq(symbol)
      expect(position.baseSymbolId).to.be.eq(baseSymbolId)
      expect(position.quoteSymbolId).to.be.eq(quoteSymbolId)
      expect(position.account).to.be.eq(AlunaAccountEnum.DERIVATIVES)
      expect(position.amount).to.be.eq(amount)
      expect(position.total).to.be.eq(total)
      expect(position.openPrice).to.be.eq(expectedOpenPrice)
      expect(position.basePrice).to.be.eq(expectedBasePrice)
      expect(position.pl).to.be.eq(pl)
      expect(position.plPercentage).to.be.eq(expectedPlPercentage)
      expect(position.status).to.be.eq(expectedStatus)
      expect(position.side).to.be.eq(expectedSide)
      expect(position.liquidationPrice).to.be.eq(liquidationPrice)
      expect(position.openedAt).to.deep.eq(expectedOpenedAt)
      expect(position.closedAt).to.deep.eq(expectedClosedAt)
      expect(position.closePrice).to.deep.eq(expectedClosePrice)
      expect(position.leverage).to.deep.eq(expectedLeverage)
      expect(position.crossMargin).to.deep.eq(expectedCrossMargin)
      expect(position.uiCustomDisplay).to.deep.eq(uiCustomDisplay)
      expect(position.meta).to.deep.eq(rawPosition)

      expect(assembleUIPositionCustomDisplay.callCount).to.be.eq(1)
      expect(assembleUIPositionCustomDisplay.firstCall.args[0]).to.deep.eq({
        amount,
        total,
        instrument: mockedInstrument,
        pl,
        bitmexPosition,
      })

      expect(computeOrderAmount.callCount).to.be.eq(1)
      expect(computeOrderAmount.firstCall.args[0]).to.deep.eq({
        orderQty: Math.abs(currentQty),
        instrument: mockedInstrument,
        computedPrice: avgCostPrice,
      })

      expect(computeOrderTotal.callCount).to.be.eq(1)
      expect(computeOrderTotal.firstCall.args[0]).to.deep.eq({
        instrument: mockedInstrument,
        computedPrice: avgCostPrice,
        computedAmount: amount,
        orderQty: Math.abs(currentQty),
      })

    })

  })

})
