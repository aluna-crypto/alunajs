import { expect } from 'chai'
import sleep from 'sleep-promise'

import { AlunaAccountEnum } from '../../../../../src/lib/enums/AlunaAccountEnum'
import { AlunaOrderSideEnum } from '../../../../../src/lib/enums/AlunaOrderSideEnum'
import { AlunaOrderStatusEnum } from '../../../../../src/lib/enums/AlunaOrderStatusEnum'
import { AlunaOrderTypesEnum } from '../../../../../src/lib/enums/AlunaOrderTypesEnum'
import { IAuthedParams } from '../../IAuthedParams'
import { placeStopLimitOrder } from '../helpers/order/placeStopLimitOrder'



export const testStopLimitOrder = (params: IAuthedParams) => {

  const {
    liveData,
    exchangeAuthed,
    exchangeConfigs,
  } = params

  const {
    orderAccount,
    orderAmount,
    orderEditAmount,
    orderLimitRate,
    orderStopRate,
    supportsGetCanceledOrders = true,
  } = exchangeConfigs


  describe('type:stopLimit', () => {

    it('place', async () => {

      const {
        order,
        requestWeight,
      } = await placeStopLimitOrder(params)

      expect(order.id).to.exist
      expect(order.symbolPair).to.exist
      expect(order.baseSymbolId).to.exist
      expect(order.quoteSymbolId).to.exist
      expect(order.stopRate).to.be.eq(orderStopRate)
      expect(order.limitRate).to.be.eq(orderLimitRate)
      expect(order.exchangeId).to.exist
      expect(order.total).to.exist
      expect(order.type).to.be.eq(AlunaOrderTypesEnum.STOP_LIMIT)
      expect(order.side).to.be.eq(AlunaOrderSideEnum.BUY)
      expect(order.status).to.be.eq(AlunaOrderStatusEnum.OPEN)
      expect(order.account).to.be.eq(orderAccount)
      expect(order.placedAt).to.exist
      expect(order.meta).to.exist

      expect(order.rate).not.to.exist
      expect(order.filledAt).not.to.exist
      expect(order.canceledAt).not.to.exist

      if (order.uiCustomDisplay) {

        expect(order.uiCustomDisplay.amount.value).to.be.eq(orderAmount)

      } else {

        expect(order.amount).to.be.eq(orderAmount)

      }

      expect(requestWeight.authed).to.be.greaterThan(0)

      liveData.stopLimitOrderId = order.id!
      liveData.orderSymbolPair = order.symbolPair

      // Wait to ensure server has processed the operation
      await sleep(1000)

    })

    it('get:placedOrder', async () => {

      const {
        stopLimitOrderId,
        orderSymbolPair,
      } = liveData

      const {
        order,
        requestWeight,
      } = await exchangeAuthed.order.get({
        symbolPair: orderSymbolPair!,
        id: stopLimitOrderId!,
      })

      expect(order.id).to.exist
      expect(order.symbolPair).to.be.eq(orderSymbolPair)
      expect(order.status).to.be.eq(AlunaOrderStatusEnum.OPEN)

      expect(requestWeight.authed).to.be.greaterThan(0)

    })

    it('edit', async () => {

      const {
        stopLimitOrderId,
        orderSymbolPair,
      } = liveData

      const {
        order,
        requestWeight,
      } = await exchangeAuthed.order.edit({
        id: stopLimitOrderId!,
        symbolPair: orderSymbolPair!,
        account: orderAccount || AlunaAccountEnum.SPOT,
        amount: orderEditAmount,
        limitRate: orderLimitRate,
        stopRate: orderStopRate,
        side: AlunaOrderSideEnum.BUY,
        type: AlunaOrderTypesEnum.STOP_LIMIT,
      })

      expect(order).to.exist
      expect(order.status).to.be.eq(AlunaOrderStatusEnum.OPEN)

      if (order.uiCustomDisplay) {

        expect(order.uiCustomDisplay.amount.value).to.be.eq(orderEditAmount)

      } else {

        expect(order.amount).to.be.eq(orderEditAmount)

      }

      expect(requestWeight.authed).to.be.greaterThan(0)

      liveData.stopLimitOrderId = order.id!
      liveData.orderSymbolPair = order.symbolPair
      liveData.orderEditedAmount = order.amount

      // Wait to ensure server has processed the operation
      await sleep(1000)

    })

    it('get:editedOrder', async () => {

      const {
        stopLimitOrderId,
        orderSymbolPair,
      } = liveData

      const {
        order,
        requestWeight,
      } = await exchangeAuthed.order.get({
        symbolPair: orderSymbolPair!,
        id: stopLimitOrderId!,
      })

      expect(order).to.exist
      expect(order.status).to.be.eq(AlunaOrderStatusEnum.OPEN)

      if (order.uiCustomDisplay) {

        expect(order.uiCustomDisplay.amount.value).to.be.eq(orderEditAmount)

      } else {

        expect(order.amount).to.be.eq(orderEditAmount)

      }

      expect(requestWeight.authed).to.be.greaterThan(0)

    })

    it('cancel', async () => {

      const {
        stopLimitOrderId,
        orderSymbolPair,
      } = liveData

      const {
        order,
        requestWeight,
      } = await exchangeAuthed.order.cancel({
        symbolPair: orderSymbolPair!,
        id: stopLimitOrderId!,
      })

      expect(order).to.exist
      expect(order.canceledAt).to.exist
      expect(order.status).to.be.eq(AlunaOrderStatusEnum.CANCELED)

      expect(requestWeight.authed).to.be.greaterThan(0)

      // Wait to ensure server has processed the operation
      await sleep(1000)

    })

    if (supportsGetCanceledOrders) {

      it('get:canceledOrder', async () => {

        const {
          stopLimitOrderId,
          orderSymbolPair,
        } = liveData

        const {
          order,
          requestWeight,
        } = await exchangeAuthed.order.get({
          symbolPair: orderSymbolPair!,
          id: stopLimitOrderId!,
        })

        expect(order).to.exist
        expect(order.canceledAt).to.exist
        expect(order.status).to.be.eq(AlunaOrderStatusEnum.CANCELED)

        expect(requestWeight.authed).to.be.greaterThan(0)

      })

    }


  })

}
