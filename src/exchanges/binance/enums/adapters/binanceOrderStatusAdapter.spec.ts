import { expect } from 'chai'

import { AlunaError } from '../../../../lib/core/AlunaError'
import { AlunaOrderStatusEnum } from '../../../../lib/enums/AlunaOrderStatusEnum'
import { BinanceOrderStatusEnum } from '../BinanceOrderStatusEnum'
import {
  translateOrderStatusToAluna,
  translateOrderStatusToBinance,
} from './binanceOrderStatusAdapter'



describe(__filename, () => {

  const notSupported = 'not-supported'


  it('should translate Binance order status to Aluna order status', () => {

    expect(translateOrderStatusToAluna({
      from: BinanceOrderStatusEnum.NEW,
    })).to.be.eq(AlunaOrderStatusEnum.OPEN)

    expect(translateOrderStatusToAluna({
      from: BinanceOrderStatusEnum.PARTIALLY_FILLED,
    })).to.be.eq(AlunaOrderStatusEnum.PARTIALLY_FILLED)

    expect(translateOrderStatusToAluna({
      from: BinanceOrderStatusEnum.FILLED,
    })).to.be.eq(AlunaOrderStatusEnum.FILLED)

    expect(translateOrderStatusToAluna({
      from: BinanceOrderStatusEnum.REJECTED,
    })).to.be.eq(AlunaOrderStatusEnum.CANCELED)

    expect(translateOrderStatusToAluna({
      from: BinanceOrderStatusEnum.CANCELED,
    })).to.be.eq(AlunaOrderStatusEnum.CANCELED)

    expect(translateOrderStatusToAluna({
      from: BinanceOrderStatusEnum.EXPIRED,
    })).to.be.eq(AlunaOrderStatusEnum.CANCELED)

    let error
    let result

    try {

      result = translateOrderStatusToAluna({
        from: notSupported as BinanceOrderStatusEnum,
      })

    } catch (err) {

      error = err

    }

    expect(result).not.to.be.ok
    expect(error instanceof AlunaError).to.be.ok
    expect(error.message)
      .to.be.eq(`Order status not supported: ${notSupported}`)

  })



  it('should translate Aluna order status to Binance order status', () => {

    expect(translateOrderStatusToBinance({
      from: AlunaOrderStatusEnum.OPEN,
    })).to.be.eq(BinanceOrderStatusEnum.NEW)

    expect(translateOrderStatusToBinance({
      from: AlunaOrderStatusEnum.PARTIALLY_FILLED,
    })).to.be.eq(BinanceOrderStatusEnum.PARTIALLY_FILLED)

    expect(translateOrderStatusToBinance({
      from: AlunaOrderStatusEnum.FILLED,
    })).to.be.eq(BinanceOrderStatusEnum.FILLED)

    expect(translateOrderStatusToBinance({
      from: AlunaOrderStatusEnum.CANCELED,
    })).to.be.eq(BinanceOrderStatusEnum.CANCELED)

    let result
    let error

    try {

      result = translateOrderStatusToBinance({
        from: notSupported as AlunaOrderStatusEnum,
      })

    } catch (err) {

      error = err

    }

    expect(result).not.to.be.ok
    expect(error instanceof AlunaError).to.be.ok
    expect(error.message)
      .to.be.eq(`Order status not supported: ${notSupported}`)

  })

})
