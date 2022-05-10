import BigNumber from 'bignumber.js'
import { expect } from 'chai'

import { AlunaAccountEnum } from '../../../../src/lib/enums/AlunaAccountEnum'
import { AlunaOrderSideEnum } from '../../../../src/lib/enums/AlunaOrderSideEnum'
import { AlunaOrderStatusEnum } from '../../../../src/lib/enums/AlunaOrderStatusEnum'
import { AlunaOrderTypesEnum } from '../../../../src/lib/enums/AlunaOrderTypesEnum'
import { IAuthedParams } from '../IAuthedParams'
import { placeLimitOrder } from './helpers/order/placeLimitOrder'
import { placeMarketOrder } from './helpers/order/placeMarketOrder'
import { placeStopLimitOrder } from './helpers/order/placeStopLimitOrder'
import { placeStopMarketOrder } from './helpers/order/placeStopMarketOrder'
import { isOrderTypeSupportedAndImplemented } from './helpers/utils/isOrderTypeSupportedAndImplemented'



export function order(params: IAuthedParams) {

  const {
    liveData,
    exchangeAuthed,
    exchangeConfigs,
  } = params

  const { orderAccount } = exchangeConfigs


  /**
   * Limit Orders
   */
  describe('type:limit', () => {

    it('place', async () => {

      const {
        order,
        requestWeight,
      } = await placeLimitOrder(params)

      expect(order).to.exist
      expect(order.type).to.be.eq(AlunaOrderTypesEnum.LIMIT)

      expect(requestWeight.authed).to.be.greaterThan(0)
      expect(requestWeight.public).to.be.eq(0)

      liveData.limitOrderId = order.id!
      liveData.orderSymbolPair = order.symbolPair

    })

    it('listRaw', async () => {

      const {
        rawOrders,
        requestWeight,
      } = await exchangeAuthed.order.listRaw()

      expect(rawOrders).to.exist
      expect(rawOrders.length).to.be.greaterThan(0)

      expect(requestWeight.authed).to.be.greaterThan(0)
      expect(requestWeight.public).to.be.eq(0)

    })

    it('list', async () => {

      const { orderSymbolPair } = liveData

      const {
        orders,
        requestWeight,
      } = await exchangeAuthed.order.list()

      expect(orders).to.exist
      expect(orders.length).to.be.greaterThan(0)
      expect(orders[0].symbolPair).to.be.eq(orderSymbolPair)

      expect(requestWeight.authed).to.be.greaterThan(0)
      expect(requestWeight.public).to.be.eq(0)

    })

    it('getRaw', async () => {

      const {
        limitOrderId,
        orderSymbolPair,
      } = liveData

      const {
        rawOrder,
        requestWeight,
      } = await exchangeAuthed.order.getRaw({
        symbolPair: orderSymbolPair!,
        id: limitOrderId!,
      })

      expect(rawOrder).to.exist

      expect(requestWeight.authed).to.be.greaterThan(0)
      expect(requestWeight.public).to.be.eq(0)

    })

    it('get:placedOrder', async () => {

      const {
        limitOrderId,
        orderSymbolPair,
      } = liveData

      const {
        order,
        requestWeight,
      } = await exchangeAuthed.order.get({
        symbolPair: orderSymbolPair!,
        id: limitOrderId!,
      })

      expect(order).to.exist
      expect(order.status).to.be.eq(AlunaOrderStatusEnum.OPEN)

      expect(requestWeight.authed).to.be.greaterThan(0)
      expect(requestWeight.public).to.be.eq(0)

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

      const newAmount = new BigNumber(orderAmount).times(1.02).toNumber()

      const {
        order,
        requestWeight,
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

      expect(requestWeight.authed).to.be.greaterThan(0)
      expect(requestWeight.public).to.be.eq(0)

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
        requestWeight,
      } = await exchangeAuthed.order.get({
        symbolPair: orderSymbolPair!,
        id: limitOrderId!,
      })

      expect(order).to.exist
      expect(order.status).to.be.eq(AlunaOrderStatusEnum.OPEN)
      expect(order.amount).to.be.eq(orderEditedAmount)

      expect(requestWeight.authed).to.be.greaterThan(0)
      expect(requestWeight.public).to.be.eq(0)

    })

    it('cancel', async () => {

      const {
        limitOrderId,
        orderSymbolPair,
      } = liveData

      const {
        order,
        requestWeight,
      } = await exchangeAuthed.order.cancel({
        symbolPair: orderSymbolPair!,
        id: limitOrderId!,
      })

      expect(order).to.exist

      expect(requestWeight.authed).to.be.greaterThan(0)
      expect(requestWeight.public).to.be.eq(0)

    })

    it('get:canceledOrder', async () => {

      const {
        limitOrderId,
        orderSymbolPair,
      } = liveData

      const {
        order,
        requestWeight,
      } = await exchangeAuthed.order.get({
        symbolPair: orderSymbolPair!,
        id: limitOrderId!,
      })

      expect(order).to.exist
      expect(order.status).to.be.eq(AlunaOrderStatusEnum.CANCELED)

      expect(requestWeight.authed).to.be.greaterThan(0)
      expect(requestWeight.public).to.be.eq(0)

    })

  })



  /**
   * Market Orders
   */
  const isMarketSupported = isOrderTypeSupportedAndImplemented({
    account: orderAccount || AlunaAccountEnum.EXCHANGE,
    exchangeAuthed,
    orderType: AlunaOrderTypesEnum.MARKET,
  })

  if (isMarketSupported) {
    describe('type:market', () => {

      it('place', async () => {

        const {
          order,
          requestWeight,
        } = await placeMarketOrder({
          authed: params,
          side: AlunaOrderSideEnum.BUY,
        })

        expect(order).to.exist
        expect(order.type).to.be.eq(AlunaOrderTypesEnum.MARKET)

        expect(requestWeight.authed).to.be.greaterThan(0)
        expect(requestWeight.public).to.be.eq(0)

        liveData.marketOrderId = order.id!
        liveData.orderSymbolPair = order.symbolPair

      })

      it('listRaw', async () => {

        const {
          rawOrders,
          requestWeight,
        } = await exchangeAuthed.order.listRaw()

        expect(rawOrders).to.exist

        expect(requestWeight.authed).to.be.greaterThan(0)
        expect(requestWeight.public).to.be.eq(0)

      })

      it('list', async () => {

        const {
          orders,
          requestWeight,
        } = await exchangeAuthed.order.list()

        expect(orders).to.exist

        expect(requestWeight.authed).to.be.greaterThan(0)
        expect(requestWeight.public).to.be.eq(0)

      })

      it('getRaw', async () => {

        const {
          marketOrderId,
          orderSymbolPair,
        } = liveData

        const {
          rawOrder,
          requestWeight,
        } = await exchangeAuthed.order.getRaw({
          symbolPair: orderSymbolPair!,
          id: marketOrderId!,
        })

        expect(rawOrder).to.exist

        expect(requestWeight.authed).to.be.greaterThan(0)
        expect(requestWeight.public).to.be.eq(0)

      })

      it('get:filledOrder', async () => {

        const {
          marketOrderId,
          orderSymbolPair,
        } = liveData

        const {
          order,
          requestWeight,
        } = await exchangeAuthed.order.get({
          symbolPair: orderSymbolPair!,
          id: marketOrderId!,
        })

        expect(order).to.exist
        expect(order.type).to.be.eq(AlunaOrderTypesEnum.MARKET)
        expect(order.status).to.be.eq(AlunaOrderStatusEnum.FILLED)

        expect(requestWeight.authed).to.be.greaterThan(0)
        expect(requestWeight.public).to.be.eq(0)

      })

      it('undo:marketOrder', async () => {

        const {
          order,
          requestWeight,
        } = await placeMarketOrder({
          authed: params,
          side: AlunaOrderSideEnum.SELL,
        })

        expect(order).to.exist
        expect(order.type).to.be.eq(AlunaOrderTypesEnum.MARKET)

        expect(requestWeight.authed).to.be.greaterThan(0)
        expect(requestWeight.public).to.be.eq(0)

      })

    })
  }



  /**
   * Stop Limit Orders
   */
  const isStopLimitOrderSupported = isOrderTypeSupportedAndImplemented({
    account: orderAccount || AlunaAccountEnum.EXCHANGE,
    exchangeAuthed,
    orderType: AlunaOrderTypesEnum.STOP_LIMIT,
  })

  if (isStopLimitOrderSupported) {


    describe.only('type:stopLimit', () => {

      it('place', async () => {

        const {
          order,
          requestWeight,
        } = await placeStopLimitOrder(params)

        expect(order).to.exist
        expect(order.type).to.be.eq(AlunaOrderTypesEnum.STOP_LIMIT)

        expect(requestWeight.authed).to.be.greaterThan(0)
        expect(requestWeight.public).to.be.eq(0)

        liveData.stopLimitOrderId = order.id!
        liveData.orderSymbolPair = order.symbolPair

      })

      it('listRaw', async () => {

        const {
          rawOrders,
          requestWeight,
        } = await exchangeAuthed.order.listRaw()

        expect(rawOrders).to.exist
        expect(rawOrders.length).to.be.greaterThan(0)

        expect(requestWeight.authed).to.be.greaterThan(0)
        expect(requestWeight.public).to.be.eq(0)

      })

      it('list', async () => {

        const { orderSymbolPair } = liveData

        const {
          orders,
          requestWeight,
        } = await exchangeAuthed.order.list()

        expect(orders).to.exist
        expect(orders.length).to.be.greaterThan(0)
        expect(orders[0].symbolPair).to.be.eq(orderSymbolPair)

        expect(requestWeight.authed).to.be.greaterThan(0)
        expect(requestWeight.public).to.be.eq(0)

      })

      it('getRaw', async () => {

        const {
          stopLimitOrderId,
          orderSymbolPair,
        } = liveData

        const {
          rawOrder,
          requestWeight,
        } = await exchangeAuthed.order.getRaw({
          symbolPair: orderSymbolPair!,
          id: stopLimitOrderId!,
        })

        expect(rawOrder).to.exist

        expect(requestWeight.authed).to.be.greaterThan(0)
        expect(requestWeight.public).to.be.eq(0)

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
        expect(requestWeight.public).to.be.eq(0)

      })

      it('edit', async () => {

        const {
          stopLimitOrderId,
          orderSymbolPair,
        } = liveData

        const {
          orderAccount,
          orderAmount,
          orderLimitRate,
          orderStopRate,
        } = exchangeConfigs

        const newAmount = new BigNumber(orderAmount).times(1.02).toNumber()

        const {
          order,
          requestWeight,
        } = await exchangeAuthed.order.edit({
          id: stopLimitOrderId!,
          symbolPair: orderSymbolPair!,
          account: orderAccount || AlunaAccountEnum.EXCHANGE,
          amount: newAmount,
          limitRate: orderLimitRate,
          stopRate: orderStopRate,
          side: AlunaOrderSideEnum.BUY,
          type: AlunaOrderTypesEnum.STOP_LIMIT,
        })

        expect(order).to.exist
        expect(order.amount).to.be.eq(newAmount)

        expect(requestWeight.authed).to.be.greaterThan(0)
        expect(requestWeight.public).to.be.eq(0)

        liveData.stopLimitOrderId = order.id!
        liveData.orderSymbolPair = order.symbolPair
        liveData.orderEditedAmount = newAmount

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
        expect(requestWeight.public).to.be.eq(0)

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
        expect(requestWeight.public).to.be.eq(0)

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
        expect(requestWeight.public).to.be.eq(0)

      })

    })

  }

  /**
   * Stop Limit Orders
   */
  const isStopMarketOrderSupported = isOrderTypeSupportedAndImplemented({
    account: orderAccount || AlunaAccountEnum.EXCHANGE,
    exchangeAuthed,
    orderType: AlunaOrderTypesEnum.STOP_MARKET,
  })

  if (isStopMarketOrderSupported) {

    describe('type:stopMarket', () => {

      it('place', async () => {

        const {
          order,
          requestWeight,
        } = await placeStopMarketOrder(params)

        expect(order).to.exist
        expect(order.type).to.be.eq(AlunaOrderTypesEnum.STOP_MARKET)

        expect(requestWeight.authed).to.be.greaterThan(0)
        expect(requestWeight.public).to.be.eq(0)

        liveData.stopMarketOrderId = order.id!
        liveData.orderSymbolPair = order.symbolPair

      })

      it('listRaw', async () => {

        const {
          rawOrders,
          requestWeight,
        } = await exchangeAuthed.order.listRaw()

        expect(rawOrders).to.exist
        expect(rawOrders.length).to.be.greaterThan(0)

        expect(requestWeight.authed).to.be.greaterThan(0)
        expect(requestWeight.public).to.be.eq(0)

      })

      it('list', async () => {

        const { orderSymbolPair } = liveData

        const {
          orders,
          requestWeight,
        } = await exchangeAuthed.order.list()

        expect(orders).to.exist
        expect(orders.length).to.be.greaterThan(0)
        expect(orders[0].symbolPair).to.be.eq(orderSymbolPair)

        expect(requestWeight.authed).to.be.greaterThan(0)
        expect(requestWeight.public).to.be.eq(0)

      })

      it('getRaw', async () => {

        const {
          stopMarketOrderId,
          orderSymbolPair,
        } = liveData

        const {
          rawOrder,
          requestWeight,
        } = await exchangeAuthed.order.getRaw({
          symbolPair: orderSymbolPair!,
          id: stopMarketOrderId!,
        })

        expect(rawOrder).to.exist

        expect(requestWeight.authed).to.be.greaterThan(0)
        expect(requestWeight.public).to.be.eq(0)

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
        expect(requestWeight.public).to.be.eq(0)

      })

      it('edit', async () => {

        const {
          stopMarketOrderId,
          orderSymbolPair,
        } = liveData

        const {
          orderAccount,
          orderAmount,
          orderStopRate,
        } = exchangeConfigs

        const newAmount = new BigNumber(orderAmount).times(1.02).toNumber()

        const {
          order,
          requestWeight,
        } = await exchangeAuthed.order.edit({
          id: stopMarketOrderId!,
          symbolPair: orderSymbolPair!,
          account: orderAccount || AlunaAccountEnum.EXCHANGE,
          stopRate: orderStopRate,
          amount: newAmount,
          side: AlunaOrderSideEnum.BUY,
          type: AlunaOrderTypesEnum.STOP_MARKET,
        })

        expect(order).to.exist
        expect(order.amount).to.be.eq(newAmount)

        expect(requestWeight.authed).to.be.greaterThan(0)
        expect(requestWeight.public).to.be.eq(0)

        liveData.stopMarketOrderId = order.id!
        liveData.orderSymbolPair = order.symbolPair
        liveData.orderEditedAmount = newAmount

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
        expect(requestWeight.public).to.be.eq(0)

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
        expect(requestWeight.public).to.be.eq(0)

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
        expect(requestWeight.public).to.be.eq(0)

      })

    })

  }

}
