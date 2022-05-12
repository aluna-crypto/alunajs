import { expect } from 'chai'
import {
  cloneDeep,
  each,
} from 'lodash'
import { ImportMock } from 'ts-mock-imports'

import { PARSED_MARKETS } from '../../../../../../test/fixtures/parsedMarkets'
import { AlunaAccountEnum } from '../../../../../lib/enums/AlunaAccountEnum'
import { AlunaOrderStatusEnum } from '../../../../../lib/enums/AlunaOrderStatusEnum'
import { AlunaOrderTypesEnum } from '../../../../../lib/enums/AlunaOrderTypesEnum'
import { IAlunaCredentialsSchema } from '../../../../../lib/schemas/IAlunaCredentialsSchema'
import { IAlunaUICustomDisplaySchema } from '../../../../../lib/schemas/IAlunaUICustomDisplaySchema'
import { BitmexAuthed } from '../../../BitmexAuthed'
import { translateOrderSideToAluna } from '../../../enums/adapters/bitmexOrderSideAdapter'
import { translateOrderStatusToAluna } from '../../../enums/adapters/bitmexOrderStatusAdapter'
import { translateOrderTypeToAluna } from '../../../enums/adapters/bitmexOrderTypeAdapter'
import { BitmexOrderStatusEnum } from '../../../enums/BitmexOrderStatusEnum'
import { BitmexOrderTypeEnum } from '../../../enums/BitmexOrderTypeEnum'
import { BITMEX_RAW_ORDERS } from '../../../test/fixtures/bitmexOrders'
import { mockAssembleUiCustomDisplay } from './helpers/assembleUiCustomDisplay.mock'
import { mockComputeOrderAmount } from './helpers/computeOrderAmount.mock'
import { mockComputeOrderTotal } from './helpers/computeOrderTotal.mock'



describe(__filename, () => {

  const credentials: IAlunaCredentialsSchema = {
    key: 'key',
    secret: 'secret',
  }

  const bitmexOrder = cloneDeep(BITMEX_RAW_ORDERS[0])

  const testsCasesArr = [
    ['(OPEN)', 'ordStatus', BitmexOrderStatusEnum.NEW],
    ['(FILLED)', 'ordStatus', BitmexOrderStatusEnum.FILLED],
    ['(CANCELED)', 'ordStatus', BitmexOrderStatusEnum.CANCELED],
    ['(LIMIT)', 'ordType', BitmexOrderTypeEnum.LIMIT],
    ['(MARKET)', 'ordType', BitmexOrderTypeEnum.MARKET],
    ['(STOP LIMIT)', 'ordType', BitmexOrderTypeEnum.STOP_LIMIT],
    ['(STOP STOP_MARKET)', 'ordType', BitmexOrderTypeEnum.STOP_MARKET],
    ['(TRIGGERED)', 'triggered', 'StopOrderTriggered'],
    ['(UNTRIGGERED)', 'triggered', ''],
  ]

  each(testsCasesArr, (params) => {

    const [testCase, orderPropName, orderPropValue] = params

    it(`should parse a Bitmex raw order just fine ${testCase}`, async () => {

      bitmexOrder[orderPropName] = orderPropValue

      // preparing data
      const expectedUICustonDisplay = {} as IAlunaUICustomDisplaySchema
      const baseSymbolId = 'XBT'
      const quoteSymbolId = 'USD'
      const amount = 10
      const total = 20

      const market = cloneDeep(PARSED_MARKETS[0])
      const instrument: any = {}
      market.baseSymbolId = baseSymbolId
      market.quoteSymbolId = quoteSymbolId
      market.instrument = instrument


      // mocking
      const mockedDate = Date.now()

      ImportMock.mockFunction(
        global.Date,
        'now',
        mockedDate,
      )

      const { assembleUiCustomDisplay } = mockAssembleUiCustomDisplay()
      const uiCustomDisplay = {}
      assembleUiCustomDisplay.returns({ uiCustomDisplay })

      const { computeOrderAmount } = mockComputeOrderAmount()
      computeOrderAmount.returns({ amount })

      const { computeOrderTotal } = mockComputeOrderTotal()
      computeOrderTotal.returns({ total })


      // executing
      const exchange = new BitmexAuthed({ credentials })

      const { order } = exchange.order.parse({
        rawOrder: {
          market,
          bitmexOrder,
        },
      })


      // validating
      const {
        ordStatus,
        side,
        ordType,
        stopPx,
        price,
        transactTime,
        timestamp,
        orderQty,
      } = bitmexOrder

      const expectedComputedStatus = translateOrderStatusToAluna({
        from: ordStatus,
      })

      const expectedComputedSide = translateOrderSideToAluna({
        from: side,
      })

      const expectedComputedType = translateOrderTypeToAluna({
        from: ordType,
      })

      let expectedRate: number | undefined
      let expectedStopRate: number | undefined
      let expectedLimitRate: number | undefined

      let expectedComputedPrice: number

      switch (expectedComputedType) {

        case AlunaOrderTypesEnum.STOP_MARKET:
          expectedStopRate = stopPx!
          expectedComputedPrice = stopPx!
          break

        case AlunaOrderTypesEnum.STOP_LIMIT:
          expectedStopRate = stopPx!
          expectedLimitRate = price!
          expectedComputedPrice = expectedLimitRate
          break

          // 'Limit' and 'Market'
        default:
          expectedRate = price!
          expectedComputedPrice = expectedRate

      }

      const expectedPlacedAt = new Date(transactTime)
      const expectedComputedTimeStamp = new Date(timestamp)

      let expectedFilledAt: Date | undefined
      let expectedCanceledAt: Date | undefined

      if (expectedComputedStatus === AlunaOrderStatusEnum.FILLED) {

        expectedFilledAt = expectedComputedTimeStamp

      } else if (expectedComputedStatus === AlunaOrderStatusEnum.CANCELED) {

        expectedCanceledAt = expectedComputedTimeStamp

      }

      expect(order.id).to.be.eq(bitmexOrder.orderID)
      expect(order.symbolPair).to.be.eq(bitmexOrder.symbol)
      expect(order.baseSymbolId).to.be.eq(baseSymbolId)
      expect(order.quoteSymbolId).to.be.eq(quoteSymbolId)
      expect(order.account).to.be.eq(AlunaAccountEnum.DERIVATIVES)
      expect(order.amount).to.be.eq(amount)
      expect(order.total).to.be.eq(total)
      expect(order.rate).to.be.eq(expectedRate)
      expect(order.stopRate).to.be.eq(expectedStopRate)
      expect(order.limitRate).to.be.eq(expectedLimitRate)
      expect(order.status).to.be.eq(expectedComputedStatus)
      expect(order.side).to.be.eq(expectedComputedSide)
      expect(order.type).to.be.eq(expectedComputedType)
      expect(order.placedAt).to.deep.eq(expectedPlacedAt)
      expect(order.filledAt).to.deep.eq(expectedFilledAt)
      expect(order.canceledAt).to.deep.eq(expectedCanceledAt)
      expect(order.uiCustomDisplay).to.deep.eq(expectedUICustonDisplay)
      expect(order.meta).to.deep.eq(bitmexOrder)

      expect(assembleUiCustomDisplay.callCount).to.be.eq(1)
      expect(assembleUiCustomDisplay.firstCall.args[0]).to.deep.eq({
        instrument,
        bitmexOrder,
        computedAmount: amount,
        computedPrice: expectedComputedPrice,
        computedTotal: total,
      })


      expect(computeOrderAmount.callCount).to.be.eq(1)
      expect(computeOrderAmount.firstCall.args[0]).to.deep.eq({
        orderQty: bitmexOrder.orderQty,
        instrument,
        computedPrice: expectedComputedPrice,
      })

      expect(computeOrderTotal.callCount).to.be.eq(1)
      expect(computeOrderTotal.firstCall.args[0]).to.deep.eq({
        instrument,
        computedPrice: expectedComputedPrice,
        computedAmount: amount,
        orderQty,
      })

    })
  })

})
