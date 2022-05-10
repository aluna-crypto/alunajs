import { expect } from 'chai'

import { AlunaError } from '../../../../lib/core/AlunaError'
import { AlunaOrderSideEnum } from '../../../../lib/enums/AlunaOrderSideEnum'
import { BinanceOrderSideEnum } from '../BinanceOrderSideEnum'
import {
  translateOrderSideToAluna,
  translateOrderSideToBinance,
} from './BinanceOrderSideAdapter'



describe(__filename, () => {

  const notSupported = 'not-supported'



  it('should properly translate Binance order sides to Aluna order sides', () => {

    expect(translateOrderSideToAluna({
      from: BinanceOrderSideEnum.BUY,
    })).to.be.eq(AlunaOrderSideEnum.BUY)

    expect(translateOrderSideToAluna({
      from: BinanceOrderSideEnum.SELL,
    })).to.be.eq(AlunaOrderSideEnum.SELL)

    let result
    let error

    try {

      result = translateOrderSideToAluna({
        from: notSupported as BinanceOrderSideEnum,
      })

    } catch (err) {

      error = err

    }

    expect(result).not.to.be.ok

    expect(error instanceof AlunaError).to.be.ok
    expect(error.message)
      .to.be.eq(`Order side not supported: ${notSupported}`)

  })



  it('should properly translate Aluna order sides to Binance order sides', () => {

    expect(translateOrderSideToBinance({
      from: AlunaOrderSideEnum.BUY,
    })).to.be.eq(BinanceOrderSideEnum.BUY)

    expect(translateOrderSideToBinance({
      from: AlunaOrderSideEnum.SELL,
    })).to.be.eq(BinanceOrderSideEnum.SELL)

    let result
    let error

    try {

      result = translateOrderSideToBinance({
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
