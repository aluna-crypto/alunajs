import { expect } from 'chai'

import { AlunaError } from '../../../../lib/core/AlunaError'
import { AlunaOrderSideEnum } from '../../../../lib/enums/AlunaOrderSideEnum'
import { BitmexOrderSideEnum } from '../BitmexOrderSideEnum'
import {
  translateOrderSideToAluna,
  translateOrderSideToBitmex,
} from './bitmexOrderSideAdapter'



describe(__filename, () => {

  const notSupported = 'not-supported'



  it('should properly translate Bitmex order sides to Aluna order sides', () => {

    expect(translateOrderSideToAluna({
      from: BitmexOrderSideEnum.BUY,
    })).to.be.eq(AlunaOrderSideEnum.BUY)

    expect(translateOrderSideToAluna({
      from: BitmexOrderSideEnum.SELL,
    })).to.be.eq(AlunaOrderSideEnum.SELL)

    let result
    let error

    try {

      result = translateOrderSideToAluna({
        from: notSupported as BitmexOrderSideEnum,
      })

    } catch (err) {

      error = err

    }

    expect(result).not.to.be.ok

    expect(error instanceof AlunaError).to.be.ok
    expect(error.message)
      .to.be.eq(`Order side not supported: ${notSupported}`)

  })



  it('should properly translate Aluna order sides to Bitmex order sides', () => {

    expect(translateOrderSideToBitmex({
      from: AlunaOrderSideEnum.BUY,
    })).to.be.eq(BitmexOrderSideEnum.BUY)

    expect(translateOrderSideToBitmex({
      from: AlunaOrderSideEnum.SELL,
    })).to.be.eq(BitmexOrderSideEnum.SELL)

    let result
    let error

    try {

      result = translateOrderSideToBitmex({
        from: notSupported as AlunaOrderSideEnum,
      })

    } catch (err) {

      error = err

    }

    expect(result).not.to.be.ok
    expect(error instanceof AlunaError).to.be.ok
    expect(error.message)
      .to.be.eq(`Order side not supported: ${notSupported}`)

  })

})
