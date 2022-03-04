import { expect } from 'chai'

import { AlunaOrderSideEnum } from '../../../../lib/enums/AlunaOrderSideEnum'
import { BitfinexSideAdapter } from './BitfinexSideAdapter'



describe('BitfinexSideAdapter', () => {

  it('should properly translate Bitfinex order types to Aluna types', () => {

    expect(BitfinexSideAdapter.translateToAluna({
      amount: 100,
    })).to.be.eq(AlunaOrderSideEnum.BUY)

    expect(BitfinexSideAdapter.translateToAluna({
      amount: -6,
    })).to.be.eq(AlunaOrderSideEnum.SELL)

  })

  it('should properly translate Aluna order types to Bitfinex types', () => {

    expect(BitfinexSideAdapter.translateToBitfinex({
      amount: 80,
      side: AlunaOrderSideEnum.BUY,
    })).to.be.eq('80')

    expect(BitfinexSideAdapter.translateToBitfinex({
      amount: 60,
      side: AlunaOrderSideEnum.SELL,
    })).to.be.eq('-60')

  })

})
