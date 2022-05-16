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

  describe('type:stopLimit', () => {

    it('place', async () => {

      const {
        order,
        requestWeight,
      } = await placeStopLimitOrder(params)

      expect(order).to.exist
      expect(order.type).to.be.eq(AlunaOrderTypesEnum.STOP_LIMIT)

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

      expect(order).to.exist
      expect(order.status).to.be.eq(AlunaOrderStatusEnum.OPEN)

      expect(requestWeight.authed).to.be.greaterThan(0)

    })

    it('edit', async () => {

      const {
        stopLimitOrderId,
        orderSymbolPair,
      } = liveData

      const {
        orderAccount,
        orderLimitRate,
        orderStopRate,
        orderEditAmount,
        orderAmount,
      } = exchangeConfigs

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
      expect(order.amount).not.to.be.eq(orderAmount)

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
        orderEditedAmount,
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
      expect(order.amount).to.be.eq(orderEditedAmount)

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

      expect(requestWeight.authed).to.be.greaterThan(0)

      // Wait to ensure server has processed the operation
      await sleep(1000)

    })

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
      expect(order.status).to.be.eq(AlunaOrderStatusEnum.CANCELED)

      expect(requestWeight.authed).to.be.greaterThan(0)

    })

  })

}
