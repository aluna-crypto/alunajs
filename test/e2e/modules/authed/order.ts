import { expect } from 'chai'

import { AlunaAccountEnum } from '../../../../src/lib/enums/AlunaAccountEnum'
import { AlunaOrderSideEnum } from '../../../../src/lib/enums/AlunaOrderSideEnum'
import { AlunaOrderStatusEnum } from '../../../../src/lib/enums/AlunaOrderStatusEnum'
import { AlunaOrderTypesEnum } from '../../../../src/lib/enums/AlunaOrderTypesEnum'
import { IAuthedParams } from '../IAuthedParams'
import { placeLimitOrder } from './helpers/order/placeLimitOrder'
import { placeMarketOrder } from './helpers/order/placeMarketOrder'



export function order(params: IAuthedParams) {

  const {
    liveData,
    exchangeAuthed,
    exchangeConfigs,
  } = params


  /**
   * Limit Orders
   */
  describe('type:limit', () => {

    it('place', async () => {

      const {
        order,
        requestCount,
      } = await placeLimitOrder(params)

      expect(order).to.exist
      expect(order.type).to.be.eq(AlunaOrderTypesEnum.LIMIT)

      expect(requestCount.authed).to.be.greaterThan(0)
      expect(requestCount.public).to.be.eq(0)

      liveData.limitOrderId = order.id!
      liveData.orderSymbolPair = order.symbolPair

    })

    it('listRaw', async () => {

      const {
        rawOrders,
        requestCount,
      } = await exchangeAuthed.order.listRaw()

      expect(rawOrders).to.exist
      expect(rawOrders.length).to.be.greaterThan(0)

      expect(requestCount.authed).to.be.greaterThan(0)
      expect(requestCount.public).to.be.eq(0)

    })

    it('list', async () => {

      const { orderSymbolPair } = liveData

      const {
        orders,
        requestCount,
      } = await exchangeAuthed.order.list()

      expect(orders).to.exist
      expect(orders.length).to.be.greaterThan(0)
      expect(orders[0].symbolPair).to.be.eq(orderSymbolPair)

      expect(requestCount.authed).to.be.greaterThan(0)
      expect(requestCount.public).to.be.eq(0)

    })

    it('getRaw', async () => {

      const {
        limitOrderId,
        orderSymbolPair,
      } = liveData

      const {
        rawOrder,
        requestCount,
      } = await exchangeAuthed.order.getRaw({
        symbolPair: orderSymbolPair!,
        id: limitOrderId!,
      })

      expect(rawOrder).to.exist

      expect(requestCount.authed).to.be.greaterThan(0)
      expect(requestCount.public).to.be.eq(0)

    })

    it('get:placedOrder', async () => {

      const {
        limitOrderId,
        orderSymbolPair,
      } = liveData

      const {
        order,
        requestCount,
      } = await exchangeAuthed.order.get({
        symbolPair: orderSymbolPair!,
        id: limitOrderId!,
      })

      expect(order).to.exist
      expect(order.status).to.be.eq(AlunaOrderStatusEnum.OPEN)

      expect(requestCount.authed).to.be.greaterThan(0)
      expect(requestCount.public).to.be.eq(0)

    })

    it('edit', async () => {

      const {
        limitOrderId,
        orderSymbolPair,
      } = liveData

      const {
        orderAccount,
        orderAmount,
        orderRate,
      } = exchangeConfigs

      const newAmount = orderAmount * 1.02

      const {
        order,
        requestCount,
      } = await exchangeAuthed.order.edit({
        id: limitOrderId!,
        symbolPair: orderSymbolPair!,
        account: orderAccount || AlunaAccountEnum.EXCHANGE,
        rate: orderRate,
        amount: newAmount,
        side: AlunaOrderSideEnum.BUY,
        type: AlunaOrderTypesEnum.LIMIT,
      })

      expect(order).to.exist
      expect(order.amount).to.be.eq(newAmount)

      expect(requestCount.authed).to.be.greaterThan(0)
      expect(requestCount.public).to.be.eq(0)

      liveData.limitOrderId = order.id!
      liveData.orderSymbolPair = order.symbolPair
      liveData.orderEditedAmount = newAmount

    })

    it('get:editedOrder', async () => {

      const {
        limitOrderId,
        orderSymbolPair,
        orderEditedAmount,
      } = liveData

      const {
        order,
        requestCount,
      } = await exchangeAuthed.order.get({
        symbolPair: orderSymbolPair!,
        id: limitOrderId!,
      })

      expect(order).to.exist
      expect(order.status).to.be.eq(AlunaOrderStatusEnum.OPEN)
      expect(order.amount).to.be.eq(orderEditedAmount)

      expect(requestCount.authed).to.be.greaterThan(0)
      expect(requestCount.public).to.be.eq(0)

    })

    it('cancel', async () => {

      const {
        limitOrderId,
        orderSymbolPair,
      } = liveData


      const {
        order,
        requestCount,
      } = await exchangeAuthed.order.cancel({
        symbolPair: orderSymbolPair!,
        id: limitOrderId!,
      })

      expect(order).to.exist

      expect(requestCount.authed).to.be.greaterThan(0)
      expect(requestCount.public).to.be.eq(0)

    })

    it('get:canceledOrder', async () => {

      const {
        limitOrderId,
        orderSymbolPair,
      } = liveData

      const {
        order,
        requestCount,
      } = await exchangeAuthed.order.get({
        symbolPair: orderSymbolPair!,
        id: limitOrderId!,
      })

      expect(order).to.exist
      expect(order.status).to.be.eq(AlunaOrderStatusEnum.CANCELED)

      expect(requestCount.authed).to.be.greaterThan(0)
      expect(requestCount.public).to.be.eq(0)

    })

  })



  /**
   * Market Orders
   */
  describe('type:market', () => {

    it('place', async () => {

      const {
        order,
        requestCount,
      } = await placeMarketOrder({
        authed: params,
        side: AlunaOrderSideEnum.BUY,
      })

      expect(order).to.exist
      expect(order.type).to.be.eq(AlunaOrderTypesEnum.MARKET)
      expect(order.status).to.be.eq(AlunaOrderStatusEnum.FILLED)

      expect(requestCount.authed).to.be.greaterThan(0)
      expect(requestCount.public).to.be.eq(0)

      liveData.limitOrderId = order.id!
      liveData.orderSymbolPair = order.symbolPair

    })

    it('listRaw', async () => {

      const {
        rawOrders,
        requestCount,
      } = await exchangeAuthed.order.listRaw()

      expect(rawOrders).to.exist

      expect(requestCount.authed).to.be.greaterThan(0)
      expect(requestCount.public).to.be.eq(0)

    })

    it('list', async () => {

      const {
        orders,
        requestCount,
      } = await exchangeAuthed.order.list()

      expect(orders).to.exist

      expect(requestCount.authed).to.be.greaterThan(0)
      expect(requestCount.public).to.be.eq(0)

    })

    it('getRaw', async () => {

      const {
        limitOrderId,
        orderSymbolPair,
      } = liveData

      const {
        rawOrder,
        requestCount,
      } = await exchangeAuthed.order.getRaw({
        symbolPair: orderSymbolPair!,
        id: limitOrderId!,
      })

      expect(rawOrder).to.exist

      expect(requestCount.authed).to.be.greaterThan(0)
      expect(requestCount.public).to.be.eq(0)

    })

    it('get:filledOrder', async () => {

      const {
        limitOrderId,
        orderSymbolPair,
      } = liveData

      const {
        order,
        requestCount,
      } = await exchangeAuthed.order.get({
        symbolPair: orderSymbolPair!,
        id: limitOrderId!,
      })

      expect(order).to.exist
      expect(order.type).to.be.eq(AlunaOrderTypesEnum.MARKET)
      expect(order.status).to.be.eq(AlunaOrderStatusEnum.FILLED)

      expect(requestCount.authed).to.be.greaterThan(0)
      expect(requestCount.public).to.be.eq(0)

    })

    it('undo:marketOrder', async () => {

      const {
        order,
        requestCount,
      } = await placeMarketOrder({
        authed: params,
        side: AlunaOrderSideEnum.SELL,
      })

      expect(order).to.exist
      expect(order.type).to.be.eq(AlunaOrderTypesEnum.MARKET)
      expect(order.status).to.be.eq(AlunaOrderStatusEnum.FILLED)

      expect(requestCount.authed).to.be.greaterThan(0)
      expect(requestCount.public).to.be.eq(0)

      liveData.limitOrderId = order.id!
      liveData.orderSymbolPair = order.symbolPair

    })

  })

}
