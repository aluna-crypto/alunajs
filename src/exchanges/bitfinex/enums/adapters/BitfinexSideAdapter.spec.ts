import { expect } from 'chai'

import { AlunaSideEnum } from '../../../../lib/enums/AlunaSideEnum'
import { BitfinexSideAdapter } from './BitfinexSideAdapter'



describe('BitfinexSideAdapter', () => {

  it('should properly translate Bitfinex order types to Aluna types', () => {

    expect(BitfinexSideAdapter.translateToAluna({
      amount: 100,
    })).to.be.eq(AlunaSideEnum.LONG)

    expect(BitfinexSideAdapter.translateToAluna({
      amount: -6,
    })).to.be.eq(AlunaSideEnum.SHORT)

  })

  it('should properly translate Aluna order types to Bitfinex types', () => {

    expect(BitfinexSideAdapter.translateToBitfinex({
      amount: 80,
      side: AlunaSideEnum.LONG,
    })).to.be.eq('80')

    expect(BitfinexSideAdapter.translateToBitfinex({
      amount: 60,
      side: AlunaSideEnum.SHORT,
    })).to.be.eq('-60')

  })

})
