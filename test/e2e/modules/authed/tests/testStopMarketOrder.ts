import { expect } from 'chai'
import sleep from 'sleep-promise'

import { AlunaAccountEnum } from '../../../../../src/lib/enums/AlunaAccountEnum'
import { AlunaOrderSideEnum } from '../../../../../src/lib/enums/AlunaOrderSideEnum'
import { AlunaOrderStatusEnum } from '../../../../../src/lib/enums/AlunaOrderStatusEnum'
import { AlunaOrderTypesEnum } from '../../../../../src/lib/enums/AlunaOrderTypesEnum'
import { IAuthedParams } from '../../IAuthedParams'
import { placeStopMarketOrder } from '../helpers/order/placeStopMarketOrder'



export const testStopMarketOrder = (params: IAuthedParams) => {

  const {
    liveData,
    exchangeAuthed,
    exchangeConfigs,
  } = params

  const {
    orderAccount,
    orderAmount,
    orderStopRate,
    supportsGetCanceledOrders = true,
    orderEditAmount,
  } = exchangeConfigs

  describe('type:stopMarket', () => {

    it('place', async () => {

      const {
        order,
        requestWeight,
      } = await placeStopMarketOrder(params)

      expect(order.id).to.exist
      expect(order.symbolPair).to.exist
      expect(order.baseSymbolId).to.exist
      expect(order.quoteSymbolId).to.exist
      expect(order.stopRate).to.be.eq(orderStopRate)
      expect(order.exchangeId).to.exist
      expect(order.total).to.exist
      expect(order.type).to.be.eq(AlunaOrderTypesEnum.STOP_MARKET)
      expect(order.side).to.be.eq(AlunaOrderSideEnum.BUY)
      expect(order.status).to.be.eq(AlunaOrderStatusEnum.OPEN)
      expect(order.account).to.be.eq(orderAccount)
      expect(order.placedAt).to.exist
      expect(order.meta).to.exist

      expect(order.rate).not.to.exist
      expect(order.limitRate).not.to.exist
      expect(order.filledAt).not.to.exist
      expect(order.canceledAt).not.to.exist

      if (order.uiCustomDisplay) {

        expect(order.uiCustomDisplay.amount.value).to.be.eq(orderAmount)

      } else {

        expect(order.amount).to.be.eq(orderAmount)

      }

      expect(requestWeight.authed).to.be.greaterThan(0)

      liveData.stopMarketOrderId = order.id!
      liveData.orderSymbolPair = order.symbolPair

      // Wait to ensure server has processed the operation
      await sleep(1000)

    })

    it('get:placedOrder', async () => {

      const {
        stopMarketOrderId,
        orderSymbolPair,
      } = liveData

      const {
        order,
        requestWeight,
      } = await exchangeAuthed.order.get({
        symbolPair: orderSymbolPair!,
        id: stopMarketOrderId!,
      })

      expect(order.id).to.exist
      expect(order.symbolPair).to.be.eq(orderSymbolPair)
      expect(order.status).to.be.eq(AlunaOrderStatusEnum.OPEN)

      expect(requestWeight.authed).to.be.greaterThan(0)

    })

    it('edit', async () => {

      const {
        stopMarketOrderId,
        orderSymbolPair,
      } = liveData


      const {
        order,
        requestWeight,
      } = await exchangeAuthed.order.edit({
        id: stopMarketOrderId!,
        symbolPair: orderSymbolPair!,
        account: orderAccount || AlunaAccountEnum.SPOT,
        stopRate: orderStopRate,
        amount: orderEditAmount,
        side: AlunaOrderSideEnum.BUY,
        type: AlunaOrderTypesEnum.STOP_MARKET,
      })

      expect(order).to.exist
      expect(order.status).to.be.eq(AlunaOrderStatusEnum.OPEN)

      if (order.uiCustomDisplay) {

        expect(order.uiCustomDisplay.amount.value).to.be.eq(orderEditAmount)

      } else {

        expect(order.amount).to.be.eq(orderEditAmount)

      }

      expect(requestWeight.authed).to.be.greaterThan(0)

      liveData.stopMarketOrderId = order.id!
      liveData.orderSymbolPair = order.symbolPair
      liveData.orderEditedAmount = order.amount

      // Wait to ensure server has processed the operation
      await sleep(1000)

    })

    it('get:editedOrder', async () => {

      const {
        stopMarketOrderId,
        orderSymbolPair,
      } = liveData

      const {
        order,
        requestWeight,
      } = await exchangeAuthed.order.get({
        symbolPair: orderSymbolPair!,
        id: stopMarketOrderId!,
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
        stopMarketOrderId,
        orderSymbolPair,
      } = liveData

      const {
        order,
        requestWeight,
      } = await exchangeAuthed.order.cancel({
        symbolPair: orderSymbolPair!,
        id: stopMarketOrderId!,
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
          stopMarketOrderId,
          orderSymbolPair,
        } = liveData

        const {
          order,
          requestWeight,
        } = await exchangeAuthed.order.get({
          symbolPair: orderSymbolPair!,
          id: stopMarketOrderId!,
        })

        expect(order).to.exist
        expect(order.canceledAt).to.exist
        expect(order.status).to.be.eq(AlunaOrderStatusEnum.CANCELED)

        expect(requestWeight.authed).to.be.greaterThan(0)

      })

    }

  })

}
