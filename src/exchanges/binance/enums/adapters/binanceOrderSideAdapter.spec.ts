import { expect } from 'chai'

import { AlunaError } from '../../../../lib/core/AlunaError'
import { AlunaOrderSideEnum } from '../../../../lib/enums/AlunaOrderSideEnum'
import { binanceOrderSideEnum } from '../binanceOrderSideEnum'
import {
  translateOrderSideToAluna,
  translateOrderSideTobinance,
} from './binanceOrderSideAdapter'



describe(__filename, () => {

  const notSupported = 'not-supported'



  it('should properly translate binance order sides to Aluna order sides', () => {

    expect(translateOrderSideToAluna({
      from: binanceOrderSideEnum.BUY,
    })).to.be.eq(AlunaOrderSideEnum.BUY)

    expect(translateOrderSideToAluna({
      from: binanceOrderSideEnum.SELL,
    })).to.be.eq(AlunaOrderSideEnum.SELL)

    let result
    let error

    try {

      result = translateOrderSideToAluna({
        from: notSupported as binanceOrderSideEnum,
      })

    } catch (err) {

      error = err

    }

    expect(result).not.to.be.ok

    expect(error instanceof AlunaError).to.be.ok
    expect(error.message)
      .to.be.eq(`Order side not supported: ${notSupported}`)

  })



  it('should properly translate Aluna order sides to binance order sides', () => {

    expect(translateOrderSideTobinance({
      from: AlunaOrderSideEnum.BUY,
    })).to.be.eq(binanceOrderSideEnum.BUY)

    expect(translateOrderSideTobinance({
      from: AlunaOrderSideEnum.SELL,
    })).to.be.eq(binanceOrderSideEnum.SELL)

    let result
    let error

    try {

      result = translateOrderSideTobinance({
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
