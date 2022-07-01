import BigNumber from 'bignumber.js'
import { expect } from 'chai'
import {
  clone,
  each,
} from 'lodash'
import sinon from 'sinon'

import { AlunaOrderStatusEnum } from '../../../../../../lib/enums/AlunaOrderStatusEnum'
import { AlunaOrderTriggerStatusEnum } from '../../../../../../lib/enums/AlunaOrderTriggerStatusEnum'
import { AlunaOrderTypesEnum } from '../../../../../../lib/enums/AlunaOrderTypesEnum'
import { translateOrderSideToAluna } from '../../../../enums/adapters/huobiOrderSideAdapter'
import { translateOrderStatusToAluna } from '../../../../enums/adapters/huobiOrderStatusAdapter'
import { translateOrderTypeToAluna } from '../../../../enums/adapters/huobiOrderTypeAdapter'
import { HuobiOrderStatusEnum } from '../../../../enums/HuobiOrderStatusEnum'
import { HuobiOrderTypeEnum } from '../../../../enums/HuobiOrderTypeEnum'
import { IHuobiConditionalOrderSchema } from '../../../../schemas/IHuobiOrderSchema'
import { HUOBI_RAW_CONDITIONAL_ORDERS } from '../../../../test/fixtures/huobiOrders'
import {
  IParseHuobiConditionalOrderParams,
  parseHuobiConditionalOrder,
} from './parseHuobiConditionalOrder'



describe(__filename, () => {

  type TTestParams = {
    testLabel: string
    orderParams: Partial<IHuobiConditionalOrderSchema>
  }

  const orderTestParams: TTestParams[] = [
    {
      testLabel: '(OPEN)',
      orderParams: { orderStatus: HuobiOrderStatusEnum.SUBMITTED },
    },
    {
      testLabel: '(CANCELED)',
      orderParams: { orderStatus: HuobiOrderStatusEnum.CANCELED },
    },
    {
      testLabel: '(FILLED)',
      orderParams: { orderStatus: HuobiOrderStatusEnum.TRIGGERED },
    },
    {
      testLabel: '(STOP-LIMIT)',
      orderParams: { orderType: HuobiOrderTypeEnum.STOP_LIMIT },
    },
    {
      testLabel: '(STOP-MARKET)',
      orderParams: {
        orderType: HuobiOrderTypeEnum.STOP_MARKET,
        orderValue: '1000',
      },
    },
  ]


  each(orderTestParams, (params) => {

    const {
      testLabel,
      orderParams,
    } = params

    it(`should parse huobi conditional order just fine ${testLabel}`, async () => {

      // preparing data
      const huobiConditionalOrder = {
        ...clone(HUOBI_RAW_CONDITIONAL_ORDERS[0]),
        ...orderParams,
      }

      const params: IParseHuobiConditionalOrderParams = {
        exchangeId: 'huobi',
        baseSymbolId: 'BTC',
        quoteSymbolId: 'USDT',
        huobiConditionalOrder,
      }

      // mocking
      const mockedDate = new Date()
      sinon.useFakeTimers({
        now: mockedDate,
        shouldAdvanceTime: false,
        toFake: ['Date'],
      })


      // executing
      const { order } = parseHuobiConditionalOrder(params)


      // validating
      const {
        clientOrderId,
        orderOrigTime,
        orderPrice,
        orderSide,
        orderSize,
        orderType,
        stopPrice,
        symbol,
        orderStatus,
        orderValue,
      } = huobiConditionalOrder

      const expectedStatus = translateOrderStatusToAluna({
        from: orderStatus,
      })

      const expectedType = translateOrderTypeToAluna({
        from: orderType,
      })

      const expectedSide = translateOrderSideToAluna({
        orderSide,
      })

      let expectedStopRate
      let expectedLimitRate
      let expectedAmount
      let expectedTotal

      switch (expectedType) {

        case AlunaOrderTypesEnum.STOP_LIMIT:
          expectedAmount = Number(orderSize)
          expectedStopRate = Number(stopPrice)
          expectedLimitRate = Number(orderPrice)
          expectedTotal = expectedAmount * expectedLimitRate
          break

        default:
          expectedStopRate = Number(stopPrice)
          expectedAmount = new BigNumber(orderValue!)
            .div(expectedStopRate)
            .toNumber()
          expectedTotal = expectedAmount * expectedStopRate
          break
      }

      let expectedFilledAt
      let expectedCanceledAt

      if (expectedStatus === AlunaOrderStatusEnum.FILLED) {

        expectedFilledAt = new Date()

      } else if (expectedStatus === AlunaOrderStatusEnum.CANCELED) {

        expectedCanceledAt = new Date()

      }

      const expectedPlacedAt = new Date(orderOrigTime)

      const expectedTriggerStatus = orderStatus === HuobiOrderStatusEnum.TRIGGERED
        ? AlunaOrderTriggerStatusEnum.TRIGGERED
        : AlunaOrderTriggerStatusEnum.UNTRIGGERED
      expect(order).to.exist

      expect(order.id).to.be.eq(clientOrderId)
      expect(order.clientOrderId).to.be.eq(clientOrderId)
      expect(order.symbolPair).to.be.eq(symbol)
      expect(order.baseSymbolId).to.be.eq(params.baseSymbolId)
      expect(order.quoteSymbolId).to.be.eq(params.quoteSymbolId)
      expect(order.total).to.be.eq(expectedTotal)
      expect(order.limitRate).to.be.eq(expectedLimitRate)
      expect(order.stopRate).to.be.eq(expectedStopRate)
      expect(order.amount).to.be.eq(expectedAmount)
      expect(order.type).to.be.eq(expectedType)
      expect(order.side).to.be.eq(expectedSide)
      expect(order.status).to.be.eq(expectedStatus)
      expect(order.placedAt).to.deep.eq(expectedPlacedAt)
      expect(order.triggerStatus).to.deep.eq(expectedTriggerStatus)
      expect(order.canceledAt).to.deep.eq(expectedCanceledAt)
      expect(order.filledAt).to.deep.eq(expectedFilledAt)

    })

  })

})
