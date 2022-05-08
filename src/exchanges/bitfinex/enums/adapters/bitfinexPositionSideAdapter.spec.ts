import { expect } from 'chai'

import { AlunaPositionSideEnum } from '../../../../lib/enums/AlunaPositionSideEnum'
import {
  translatePositionSideToAluna,
  translatePositionSideToBitfinex,
} from './bitfinexPositionSideAdapter'



describe(__filename, () => {

  it('should properly translate Bitfinex order types to Aluna types', () => {

    expect(translatePositionSideToAluna({
      amount: 100,
    })).to.be.eq(AlunaPositionSideEnum.LONG)

    expect(translatePositionSideToAluna({
      amount: -6,
    })).to.be.eq(AlunaPositionSideEnum.SHORT)

  })

  it('should properly translate Aluna order types to Bitfinex types', () => {

    expect(translatePositionSideToBitfinex({
      amount: 80,
      side: AlunaPositionSideEnum.LONG,
    })).to.be.eq('80')

    expect(translatePositionSideToBitfinex({
      amount: 60,
      side: AlunaPositionSideEnum.SHORT,
    })).to.be.eq('-60')

  })

})
