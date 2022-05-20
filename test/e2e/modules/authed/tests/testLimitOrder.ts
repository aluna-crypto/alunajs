import { expect } from 'chai'
import sleep from 'sleep-promise'

import { AlunaAccountEnum } from '../../../../../src/lib/enums/AlunaAccountEnum'
import { AlunaOrderSideEnum } from '../../../../../src/lib/enums/AlunaOrderSideEnum'
import { AlunaOrderStatusEnum } from '../../../../../src/lib/enums/AlunaOrderStatusEnum'
import { AlunaOrderTypesEnum } from '../../../../../src/lib/enums/AlunaOrderTypesEnum'
import { AlunaBalanceErrorCodes } from '../../../../../src/lib/errors/AlunaBalanceErrorCodes'
import { executeAndCatch } from '../../../../../src/utils/executeAndCatch'
import { IAuthedParams } from '../../IAuthedParams'
import { placeLimitOrder } from '../helpers/order/placeLimitOrder'



export const testLimitOrder = (params: IAuthedParams) => {

  const {
    liveData,
    exchangeAuthed,
    exchangeConfigs,
  } = params

  const { supportsGetCanceledOrders = true } = exchangeConfigs

  describe('type:limit', () => {

    it('place', async () => {

      const {
        order,
        requestWeight,
      } = await placeLimitOrder({
        authedParams: params,
      })

      expect(order).to.exist
      expect(order.type).to.be.eq(AlunaOrderTypesEnum.LIMIT)

      expect(requestWeight.authed).to.be.greaterThan(0)

      liveData.limitOrderId = order.id!
      liveData.orderSymbolPair = order.symbolPair

      // Wait to ensure server has processed the operation
      await sleep(1000)

    })

    it('listRaw', async () => {

      const {
        rawOrders,
        requestWeight,
      } = await exchangeAuthed.order.listRaw()

      expect(rawOrders).to.exist

      expect(requestWeight.authed).to.be.greaterThan(0)

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

    })

    it('edit', async () => {

      const {
        limitOrderId,
        orderSymbolPair,
      } = liveData

      const {
        orderAccount,
        orderRate,
        orderAmount,
        orderEditAmount,
      } = exchangeConfigs

      const {
        order,
        requestWeight,
      } = await exchangeAuthed.order.edit({
        id: limitOrderId!,
        symbolPair: orderSymbolPair!,
        account: orderAccount || AlunaAccountEnum.SPOT,
        rate: orderRate,
        amount: orderEditAmount,
        side: AlunaOrderSideEnum.BUY,
        type: AlunaOrderTypesEnum.LIMIT,
      })

      expect(order).to.exist
      expect(order.amount).not.to.be.eq(orderAmount)

      expect(requestWeight.authed).to.be.greaterThan(0)

      liveData.limitOrderId = order.id!
      liveData.orderSymbolPair = order.symbolPair
      liveData.orderEditedAmount = order.amount

      // Wait to ensure server has processed the operation
      await sleep(1000)

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
      expect(order.status).to.be.eq(AlunaOrderStatusEnum.CANCELED)

      expect(requestWeight.authed).to.be.greaterThan(0)

      // Wait to ensure server has processed the operation
      await sleep(1000)

    })

    if (supportsGetCanceledOrders) {

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

      })

    }

    it('place:insufficientAmount', async () => {

      const {
        error,
        result,
      } = await executeAndCatch(() => placeLimitOrder({
        authedParams: params,
        insufficientBalanceAmount: true,
      }))

      expect(result).not.to.be.ok

      expect(error).to.exist
      expect(error!.code).to.be.eq(AlunaBalanceErrorCodes.INSUFFICIENT_BALANCE)

    })

  })

}
