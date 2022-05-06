import { expect } from 'chai'

import { AlunaOrderSideEnum } from '../../../../lib/enums/AlunaOrderSideEnum'
import {
  translateOrderSideToAluna,
  translateOrderSideToBitfinex,
} from './bitfinexOrderSideAdapter'



describe(__filename, () => {

  it('should properly translate Bitfinex order side to Aluna side', () => {

    expect(translateOrderSideToAluna({
      amount: 100,
    })).to.be.eq(AlunaOrderSideEnum.BUY)

    expect(translateOrderSideToAluna({
      amount: -6,
    })).to.be.eq(AlunaOrderSideEnum.SELL)

  })

  it('should properly translate Aluna order amount to Bitfinex amount', () => {

    expect(translateOrderSideToBitfinex({
      amount: 80,
      side: AlunaOrderSideEnum.BUY,
    })).to.be.eq('80')

    expect(translateOrderSideToBitfinex({
      amount: 60,
      side: AlunaOrderSideEnum.SELL,
    })).to.be.eq('-60')

  })

})
