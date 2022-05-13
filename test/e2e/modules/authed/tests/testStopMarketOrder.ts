import { expect } from 'chai'

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

  describe('type:stopMarket', () => {

    it('place', async () => {

      const {
        order,
        requestWeight,
      } = await placeStopMarketOrder(params)

      expect(order).to.exist
      expect(order.type).to.be.eq(AlunaOrderTypesEnum.STOP_MARKET)

      expect(requestWeight.authed).to.be.greaterThan(0)

      liveData.stopMarketOrderId = order.id!
      liveData.orderSymbolPair = order.symbolPair

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

      expect(order).to.exist
      expect(order.status).to.be.eq(AlunaOrderStatusEnum.OPEN)

      expect(requestWeight.authed).to.be.greaterThan(0)

    })

    it('edit', async () => {

      const {
        stopMarketOrderId,
        orderSymbolPair,
      } = liveData

      const {
        orderAccount,
        orderStopRate,
        orderEditAmount,
        orderAmount,
      } = exchangeConfigs

      const {
        order,
        requestWeight,
      } = await exchangeAuthed.order.edit({
        id: stopMarketOrderId!,
        symbolPair: orderSymbolPair!,
        account: orderAccount || AlunaAccountEnum.EXCHANGE,
        stopRate: orderStopRate,
        amount: orderEditAmount,
        side: AlunaOrderSideEnum.BUY,
        type: AlunaOrderTypesEnum.STOP_MARKET,
      })

      expect(order).to.exist
      expect(order.amount).not.to.be.eq(orderEditAmount)

      expect(requestWeight.authed).to.be.greaterThan(0)

      liveData.stopMarketOrderId = order.id!
      liveData.orderSymbolPair = order.symbolPair
      liveData.orderEditedAmount = order.amount

    })

    it('get:editedOrder', async () => {

      const {
        stopMarketOrderId,
        orderSymbolPair,
        orderEditedAmount,
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
      expect(order.amount).to.be.eq(orderEditedAmount)

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

      expect(requestWeight.authed).to.be.greaterThan(0)

    })

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
      expect(order.status).to.be.eq(AlunaOrderStatusEnum.CANCELED)

      expect(requestWeight.authed).to.be.greaterThan(0)

    })

  })

}
