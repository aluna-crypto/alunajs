import { expect } from 'chai'

import { AlunaOrderSideEnum } from '../../../../lib/enums/AlunaOrderSideEnum'
import { AlunaOrderTypesEnum } from '../../../../lib/enums/AlunaOrderTypesEnum'
import { PoloniexOrderTypeEnum } from '../PoloniexOrderTypeEnum'
import { PoloniexSideAdapter } from './PoloniexSideAdapter'



describe('PoloniexSideAdapter', () => {

  it('should properly translate Poloniex order sides to Aluna order sides',
    () => {

      expect(PoloniexSideAdapter.translateToAluna({
        orderType: PoloniexOrderTypeEnum.BUY,
      })).to.be.eq(AlunaOrderSideEnum.BUY)

      expect(PoloniexSideAdapter.translateToAluna({
        orderType: PoloniexOrderTypeEnum.SELL,
      })).to.be.eq(AlunaOrderSideEnum.SELL)

      expect(PoloniexSideAdapter.translateToAluna({
        orderType: 'any-order-type' as any,
      })).to.be.eq(AlunaOrderSideEnum.BUY)

    })



  it('should properly translate Aluna order sides to Poloniex order sides',
    () => {

      expect(PoloniexSideAdapter.translateToPoloniex({
        side: AlunaOrderSideEnum.BUY,
      })).to.be.eq(PoloniexOrderTypeEnum.BUY)

      expect(PoloniexSideAdapter.translateToPoloniex({
        side: AlunaOrderSideEnum.SELL,
      })).to.be.eq(PoloniexOrderTypeEnum.SELL)

      expect(PoloniexSideAdapter.translateToPoloniex({
        side: 'any-side' as any,
      })).to.be.eq(PoloniexOrderTypeEnum.BUY)

    })

  it('should properly translate Poloniex order side to Aluna order types',
    () => {

      expect(PoloniexSideAdapter.translateToAlunaOrderType())
        .to.be.eq(AlunaOrderTypesEnum.LIMIT)

    })

})
