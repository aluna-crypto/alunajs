import { expect } from 'chai'
import {
  cloneDeep,
  each,
} from 'lodash'
import { ImportMock } from 'ts-mock-imports'

import { AlunaAccountEnum } from '../../../../../lib/enums/AlunaAccountEnum'
import { AlunaOrderStatusEnum } from '../../../../../lib/enums/AlunaOrderStatusEnum'
import { AlunaOrderTriggerStatusEnum } from '../../../../../lib/enums/AlunaOrderTriggerStatusEnum'
import { AlunaOrderTypesEnum } from '../../../../../lib/enums/AlunaOrderTypesEnum'
import { IAlunaCredentialsSchema } from '../../../../../lib/schemas/IAlunaCredentialsSchema'
import { mockTranslateSymbolId } from '../../../../../utils/mappings/translateSymbolId.mock'
import { translateOrderSideToAluna } from '../../../enums/adapters/ftxOrderSideAdapter'
import { translateOrderStatusToAluna } from '../../../enums/adapters/ftxOrderStatusAdapter'
import { translateOrderTypeToAluna } from '../../../enums/adapters/ftxOrderTypeAdapter'
import { FtxOrderStatusEnum } from '../../../enums/FtxOrderStatusEnum'
import { FtxOrderTypeEnum } from '../../../enums/FtxOrderTypeEnum'
import { FtxTriggerOrderTypeEnum } from '../../../enums/FtxTriggerOrderTypeEnum'
import { FtxAuthed } from '../../../FtxAuthed'
import {
  IFtxOrderSchema,
  IFtxTriggerOrderSchema,
} from '../../../schemas/IFtxOrderSchema'
import {
  FTX_RAW_ORDERS,
  FTX_TRIGGER_RAW_ORDERS,
} from '../../../test/fixtures/ftxOrders'



describe(__filename, () => {

  const credentials: IAlunaCredentialsSchema = {
    key: 'key',
    secret: 'secret',
  }

  const mockedDate = new Date()

  const ftxOrder = cloneDeep(FTX_RAW_ORDERS[0])
  const ftxTriggerOrder = cloneDeep(FTX_TRIGGER_RAW_ORDERS[0])
  ftxTriggerOrder.triggeredAt = null

  type TtestOrderProps = {
    testLabel: string
    orderProps: Partial<IFtxOrderSchema>
    triggerOrderProps: Partial<IFtxTriggerOrderSchema>
  }

  const testOrdersProps: TtestOrderProps[] = [
    {
      testLabel: '(OPEN)',
      orderProps: {
        status: FtxOrderStatusEnum.NEW,
        filledSize: 0,
        size: 10,
      },
      triggerOrderProps: {},
    },
    {
      testLabel: '(FILLED)',
      orderProps: {
        status: FtxOrderStatusEnum.CLOSED,
        filledSize: 10,
        size: 10,
      },
      triggerOrderProps: {},
    },
    {
      testLabel: '(FILLED TRIGGER)',
      orderProps: {
        status: FtxOrderStatusEnum.TRIGGERED,
      },
      triggerOrderProps: {
        triggeredAt: mockedDate.toISOString(),
      },
    },
    {
      testLabel: '(CANCELED)',
      orderProps: {
        size: 10,
        filledSize: 0,
        status: FtxOrderStatusEnum.CLOSED,
      },
      triggerOrderProps: {
        cancelledAt: null,
      },
    },
    {
      testLabel: '(CANCELED TRIGGER)',
      orderProps: {},
      triggerOrderProps: {
        status: FtxOrderStatusEnum.CANCELLED,
        cancelledAt: mockedDate.toISOString(),
      },
    },
    {
      testLabel: '(LIMIT)',
      orderProps: {
        type: FtxOrderTypeEnum.LIMIT,
      },
      triggerOrderProps: {
        orderType: undefined,
      },
    },
    {
      testLabel: '(MARKET)',
      orderProps: {
        type: FtxOrderTypeEnum.MARKET,
      },
      triggerOrderProps: {
        orderType: undefined,
      },
    },
    {
      testLabel: '(STOP-LIMIT)',
      orderProps: {},
      triggerOrderProps: {
        orderType: FtxOrderTypeEnum.LIMIT,
        type: FtxTriggerOrderTypeEnum.STOP,
      },
    },
    {
      testLabel: '(STOP-MARKET)',
      orderProps: {},
      triggerOrderProps: {
        orderType: FtxOrderTypeEnum.MARKET,
        type: FtxTriggerOrderTypeEnum.STOP,
      },
    },
    {
      testLabel: '(SPOT)',
      orderProps: {
        future: undefined,
      },
      triggerOrderProps: {},
    },
    {
      testLabel: '(DERIVATIVE)',
      orderProps: {
        future: 'BTC-PERP',
      },
      triggerOrderProps: {},
    },
  ]


  each(testOrdersProps, (props) => {

    const {
      testLabel,
      orderProps,
      triggerOrderProps,
    } = props

    it(`should parse a Ftx ${testLabel} trigger order just fine`, async () => {

      // preparing data
      const mockedDate = new Date()

      const testOrder = {
        ...ftxTriggerOrder,
        ...ftxOrder,
        ...triggerOrderProps,
        ...orderProps,
      }

      const {
        side,
        price,
        type,
        status,
        id,
        market,
        size,
        filledSize,
        future,
        avgFillPrice,
      } = testOrder

      const {
        orderPrice,
        triggerPrice,
        triggeredAt,
        orderType,
      } = testOrder as IFtxTriggerOrderSchema

      const [
        baseSymbolId,
        quoteSymbolId,
      ] = market.split('/')

      const expectedType = translateOrderTypeToAluna({
        type,
        orderType,
      })

      const expectedSide = translateOrderSideToAluna({
        from: side,
      })

      const expectedStatus = translateOrderStatusToAluna({
        status,
        size,
        filledSize,
      })

      const expectedAccount = future
        ? AlunaAccountEnum.DERIVATIVES
        : AlunaAccountEnum.SPOT

      let expectedTotal: number | undefined
      let expectedRate: number | undefined
      let expectedLimitRate: number | undefined
      let expectedStopRate: number | undefined

      switch (expectedType) {

        case AlunaOrderTypesEnum.LIMIT:
          expectedRate = price!
          expectedTotal = size * expectedRate
          break

        case AlunaOrderTypesEnum.STOP_MARKET:
          expectedStopRate = triggerPrice!
          expectedTotal = size * expectedStopRate
          break

        case AlunaOrderTypesEnum.STOP_LIMIT:
          expectedLimitRate = orderPrice!
          expectedStopRate = triggerPrice!
          expectedTotal = size * expectedStopRate
          break

        // Market orders
        default:
          expectedRate = avgFillPrice!
          expectedTotal = size * expectedRate

      }

      const isCanceled = expectedStatus === AlunaOrderStatusEnum.CANCELED
      const isFilled = expectedStatus === AlunaOrderStatusEnum.FILLED

      const expectedPlacedAt = mockedDate
      let expectedCanceledAt: Date | undefined
      let expectedFilledAt: Date | undefined

      if (isCanceled) {

        expectedCanceledAt = mockedDate

      }

      if (isFilled) {

        expectedFilledAt = mockedDate

      }


      let expectedTriggerStatus: AlunaOrderTriggerStatusEnum | undefined

      // 'orderType' prop exists only for trigger orders
      if (orderType) {

        expectedTriggerStatus = triggeredAt
          ? AlunaOrderTriggerStatusEnum.TRIGGERED
          : AlunaOrderTriggerStatusEnum.UNTRIGGERED

      }


      // mocking
      const exchange = new FtxAuthed({ credentials })

      const { translateSymbolId } = mockTranslateSymbolId()

      translateSymbolId.onFirstCall().returns(baseSymbolId)
      translateSymbolId.onSecondCall().returns(quoteSymbolId)

      ImportMock.mockFunction(
        global,
        'Date',
        mockedDate,
      )


      // executing
      const { order } = exchange.order.parse({ rawOrder: testOrder })


      // validating
      expect(order).to.exist

      expect(order.id).to.be.eq(id.toString())
      expect(order.account).to.be.eq(expectedAccount)
      expect(order.baseSymbolId).to.be.eq(baseSymbolId)
      expect(order.quoteSymbolId).to.be.eq(quoteSymbolId)
      expect(order.side).to.be.eq(expectedSide)
      expect(order.status).to.be.eq(expectedStatus)
      expect(order.type).to.be.eq(expectedType)
      expect(order.rate).to.be.eq(expectedRate)
      expect(order.stopRate).to.be.eq(expectedStopRate)
      expect(order.limitRate).to.be.eq(expectedLimitRate)
      expect(order.total).to.be.eq(expectedTotal)
      expect(order.placedAt).to.deep.eq(expectedPlacedAt)
      expect(order.canceledAt).to.deep.eq(expectedCanceledAt)
      expect(order.filledAt).to.deep.eq(expectedFilledAt)
      expect(order.triggerStatus).to.deep.eq(expectedTriggerStatus)

      expect(order.meta).to.be.eq(testOrder)

    })

  })

})
