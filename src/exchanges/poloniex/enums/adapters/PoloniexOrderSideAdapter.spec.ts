import { expect } from 'chai'

import { AlunaOrderSideEnum } from '../../../../lib/enums/AlunaOrderSideEnum'
import { AlunaOrderTypesEnum } from '../../../../lib/enums/AlunaOrderTypesEnum'
import { PoloniexOrderTypeEnum } from '../PoloniexOrderTypeEnum'
import { PoloniexOrderSideAdapter } from './PoloniexOrderSideAdapter'



describe('PoloniexOrderSideAdapter', () => {

  it('should properly translate Poloniex order sides to Aluna order sides',
    () => {

      expect(PoloniexOrderSideAdapter.translateToAluna({
        orderType: PoloniexOrderTypeEnum.BUY,
      })).to.be.eq(AlunaOrderSideEnum.BUY)

      expect(PoloniexOrderSideAdapter.translateToAluna({
        orderType: PoloniexOrderTypeEnum.SELL,
      })).to.be.eq(AlunaOrderSideEnum.SELL)

      expect(PoloniexOrderSideAdapter.translateToAluna({
        orderType: 'any-order-type' as any,
      })).to.be.eq(AlunaOrderSideEnum.BUY)

    })



  it('should properly translate Aluna order sides to Poloniex order sides',
    () => {

      expect(PoloniexOrderSideAdapter.translateToPoloniex({
        side: AlunaOrderSideEnum.BUY,
      })).to.be.eq(PoloniexOrderTypeEnum.BUY)

      expect(PoloniexOrderSideAdapter.translateToPoloniex({
        side: AlunaOrderSideEnum.SELL,
      })).to.be.eq(PoloniexOrderTypeEnum.SELL)

      expect(PoloniexOrderSideAdapter.translateToPoloniex({
        side: 'any-side' as any,
      })).to.be.eq(PoloniexOrderTypeEnum.BUY)

    })

  it('should properly translate Poloniex order side to Aluna order types',
    () => {

      expect(PoloniexOrderSideAdapter.translateToAlunaOrderType())
        .to.be.eq(AlunaOrderTypesEnum.LIMIT)

    })

})
