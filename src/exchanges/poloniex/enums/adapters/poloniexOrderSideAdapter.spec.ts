import { expect } from 'chai'

import { AlunaError } from '../../../../lib/core/AlunaError'
import { AlunaOrderSideEnum } from '../../../../lib/enums/AlunaOrderSideEnum'
import { PoloniexOrderSideEnum } from '../PoloniexOrderSideEnum'
import {
  translateOrderSideToAluna,
  translateOrderSideToPoloniex,
} from './poloniexOrderSideAdapter'



describe(__filename, () => {

  const notSupported = 'not-supported'



  it('should properly translate Poloniex order sides to Aluna order sides', () => {

    expect(translateOrderSideToAluna({
      from: PoloniexOrderSideEnum.BUY,
    })).to.be.eq(AlunaOrderSideEnum.BUY)

    expect(translateOrderSideToAluna({
      from: PoloniexOrderSideEnum.SELL,
    })).to.be.eq(AlunaOrderSideEnum.SELL)

    let result
    let error

    try {

      result = translateOrderSideToAluna({
        from: notSupported as PoloniexOrderSideEnum,
      })

    } catch (err) {

      error = err

    }

    expect(result).not.to.be.ok

    expect(error instanceof AlunaError).to.be.ok
    expect(error.message)
      .to.be.eq(`Order side not supported: ${notSupported}`)

  })



  it('should properly translate Aluna order sides to Poloniex order sides', () => {

    expect(translateOrderSideToPoloniex({
      from: AlunaOrderSideEnum.BUY,
    })).to.be.eq(PoloniexOrderSideEnum.BUY)

    expect(translateOrderSideToPoloniex({
      from: AlunaOrderSideEnum.SELL,
    })).to.be.eq(PoloniexOrderSideEnum.SELL)

    let result
    let error

    try {

      result = translateOrderSideToPoloniex({
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
