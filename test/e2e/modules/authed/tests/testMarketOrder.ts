import { expect } from 'chai'

import { AlunaOrderSideEnum } from '../../../../../src/lib/enums/AlunaOrderSideEnum'
import { AlunaOrderStatusEnum } from '../../../../../src/lib/enums/AlunaOrderStatusEnum'
import { AlunaOrderTypesEnum } from '../../../../../src/lib/enums/AlunaOrderTypesEnum'
import { IAuthedParams } from '../../IAuthedParams'
import { placeMarketOrder } from '../helpers/order/placeMarketOrder'



export const testMarketOrder = (params: IAuthedParams) => {

  const {
    liveData,
    exchangeAuthed,
  } = params

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

      liveData.marketOrderId = order.id!
      liveData.orderSymbolPair = order.symbolPair

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

    })

  })

}
