import { expect } from 'chai'

import { AlunaOrderSideEnum } from '../../../../lib/enums/AlunaOrderSideEnum'
import { BitfinexOrderSideAdapter } from './BitfinexOrderSideAdapter'



describe('BitfinexOrderSideAdapter', () => {

  it('should properly translate Bitfinex order types to Aluna types', () => {

    expect(BitfinexOrderSideAdapter.translateToAluna({
      amount: 100,
    })).to.be.eq(AlunaOrderSideEnum.BUY)

    expect(BitfinexOrderSideAdapter.translateToAluna({
      amount: -6,
    })).to.be.eq(AlunaOrderSideEnum.SELL)

  })

  it('should properly translate Aluna order types to Bitfinex types', () => {

    expect(BitfinexOrderSideAdapter.translateToBitfinex({
      amount: 80,
      side: AlunaOrderSideEnum.BUY,
    })).to.be.eq('80')

    expect(BitfinexOrderSideAdapter.translateToBitfinex({
      amount: 60,
      side: AlunaOrderSideEnum.SELL,
    })).to.be.eq('-60')

  })

})
