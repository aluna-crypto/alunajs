import BigNumber from 'bignumber.js'
import { expect } from 'chai'
import {
  clone,
  each,
} from 'lodash'
import sinon from 'sinon'

import { AlunaOrderStatusEnum } from '../../../../../../lib/enums/AlunaOrderStatusEnum'
import { AlunaOrderTypesEnum } from '../../../../../../lib/enums/AlunaOrderTypesEnum'
import { translateOrderSideToAluna } from '../../../../enums/adapters/huobiOrderSideAdapter'
import { translateOrderStatusToAluna } from '../../../../enums/adapters/huobiOrderStatusAdapter'
import { translateOrderTypeToAluna } from '../../../../enums/adapters/huobiOrderTypeAdapter'
import { HuobiOrderStatusEnum } from '../../../../enums/HuobiOrderStatusEnum'
import { HuobiOrderTypeEnum } from '../../../../enums/HuobiOrderTypeEnum'
import { IHuobiOrderSchema } from '../../../../schemas/IHuobiOrderSchema'
import { HUOBI_RAW_ORDERS } from '../../../../test/fixtures/huobiOrders'
import {
  IParseHuobiOrderParams,
  parseHuobiOrder,
} from './parseHuobiOrder'



describe(__filename, () => {

  type TTestParams = {
    testLabel: string
    orderParams: Partial<IHuobiOrderSchema>
  }

  const orderTestParams: TTestParams[] = [
    {
      testLabel: '(LIMIT)',
      orderParams: { type: HuobiOrderTypeEnum.BUY_LIMIT },
    },
    {
      testLabel: '(MARKET)',
      orderParams: { type: HuobiOrderTypeEnum.SELL_MARKET },
    },
    {
      testLabel: '(STOP-LIMIT)',
      orderParams: {
        type: HuobiOrderTypeEnum.BUY_STOP_LIMIT,
        'stop-price': '10000',
      },
    },
    {
      testLabel: '(OPEN)',
      orderParams: { state: HuobiOrderStatusEnum.CREATED },
    },
    {
      testLabel: '(CANCELED)',
      orderParams: { state: HuobiOrderStatusEnum.CANCELED },
    },
    {
      testLabel: '(FILLED)',
      orderParams: { state: HuobiOrderStatusEnum.FILLED },
    },
  ]


  each(orderTestParams, (params) => {

    const {
      testLabel,
      orderParams,
    } = params

    it(`should parse huobi order just fine ${testLabel}`, async () => {

      // preparing data
      const huobiOrder = {
        ...clone(HUOBI_RAW_ORDERS[0]),
        ...orderParams,
      }

      const params: IParseHuobiOrderParams = {
        exchangeId: 'huobi',
        baseSymbolId: 'BTC',
        quoteSymbolId: 'USDT',
        huobiOrder,
      }

      // mocking
      const mockedDate = new Date()
      sinon.useFakeTimers({
        now: mockedDate,
        shouldAdvanceTime: false,
        toFake: ['Date'],
      })


      // executing
      const { order } = parseHuobiOrder(params)



      // validating
      const {
        symbol,
        price,
        type,
        'created-at': createdAt,
        amount,
        state,
        'stop-price': stopPrice,
        id,
      } = huobiOrder

      const expectedOrderStatus = translateOrderStatusToAluna({
        from: state,
      })

      const expectedPlacedAt = new Date(createdAt)

      let expectedFilledAt: Date | undefined
      let expectedCanceledAt: Date | undefined

      if (expectedOrderStatus === AlunaOrderStatusEnum.FILLED) {

        expectedFilledAt = new Date()

      } else if (expectedOrderStatus === AlunaOrderStatusEnum.CANCELED) {

        expectedCanceledAt = new Date()

      }

      const expectedSide = translateOrderSideToAluna({
        orderSide: undefined,
        type,
      })

      const expectedType = translateOrderTypeToAluna({
        from: type,
      })

      let expectedRate
      let expectedLimitRate
      let expectedStopRate
      let expectedTotal
      let expectedAmount

      switch (expectedType) {

        case AlunaOrderTypesEnum.STOP_LIMIT:
          expectedLimitRate = Number(price)
          expectedStopRate = Number(stopPrice)
          expectedAmount = Number(amount)
          expectedTotal = expectedLimitRate * Number(expectedAmount)
          break

        case AlunaOrderTypesEnum.LIMIT:
          expectedRate = Number(price)
          expectedAmount = Number(amount)
          expectedTotal = expectedRate * Number(expectedAmount)
          break

        default:
          expectedRate = Number(price)
          expectedTotal = Number(amount)
          expectedAmount = new BigNumber(amount)
            .div(price)
            .toNumber()

      }

      expect(order).to.exist

      expect(order.id).to.be.eq(id.toString())
      expect(order.symbolPair).to.be.eq(symbol)
      expect(order.baseSymbolId).to.be.eq(params.baseSymbolId)
      expect(order.quoteSymbolId).to.be.eq(params.quoteSymbolId)
      expect(order.total).to.be.eq(expectedTotal)
      expect(order.rate).to.be.eq(expectedRate)
      expect(order.limitRate).to.be.eq(expectedLimitRate)
      expect(order.stopRate).to.be.eq(expectedStopRate)
      expect(order.amount).to.be.eq(expectedAmount)
      expect(order.type).to.be.eq(expectedType)
      expect(order.side).to.be.eq(expectedSide)
      expect(order.status).to.be.eq(expectedOrderStatus)
      expect(order.placedAt).to.deep.eq(expectedPlacedAt)
      expect(order.canceledAt).to.deep.eq(expectedCanceledAt)
      expect(order.filledAt).to.deep.eq(expectedFilledAt)

    })

  })

})
