import { expect } from 'chai'

import { AlunaPositionSideEnum } from '../../../../lib/enums/AlunaPositionSideEnum'
import { BitfinexPositionSideAdapter } from './BitfinexPositionSideAdapter'



describe('BitfinexPositionSideAdapter', () => {

  it('should properly translate Bitfinex order types to Aluna types', () => {

    expect(BitfinexPositionSideAdapter.translateToAluna({
      amount: 100,
    })).to.be.eq(AlunaPositionSideEnum.LONG)

    expect(BitfinexPositionSideAdapter.translateToAluna({
      amount: -6,
    })).to.be.eq(AlunaPositionSideEnum.SHORT)

  })

  it('should properly translate Aluna order types to Bitfinex types', () => {

    expect(BitfinexPositionSideAdapter.translateToBitfinex({
      amount: 80,
      side: AlunaPositionSideEnum.LONG,
    })).to.be.eq('80')

    expect(BitfinexPositionSideAdapter.translateToBitfinex({
      amount: 60,
      side: AlunaPositionSideEnum.SHORT,
    })).to.be.eq('-60')

  })

})
