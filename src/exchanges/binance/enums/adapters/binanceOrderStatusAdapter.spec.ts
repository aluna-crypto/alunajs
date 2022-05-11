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

    const quantity = '5'
    const zeroedfillQty = '0'
    const partiallyFillQty = '3'
    const totalFillQty = '5'

    expect(translateOrderStatusToAluna({
      fillQuantity: zeroedfillQty,
      quantity,
      from: BinanceOrderStatusEnum.CLOSED,
    })).to.be.eq(AlunaOrderStatusEnum.CANCELED)

    expect(translateOrderStatusToAluna({
      fillQuantity: partiallyFillQty,
      quantity,
      from: BinanceOrderStatusEnum.CLOSED,
    })).to.be.eq(AlunaOrderStatusEnum.PARTIALLY_FILLED)

    expect(translateOrderStatusToAluna({
      fillQuantity: totalFillQty,
      quantity,
      from: BinanceOrderStatusEnum.CLOSED,
    })).to.be.eq(AlunaOrderStatusEnum.FILLED)

    expect(translateOrderStatusToAluna({
      fillQuantity: totalFillQty,
      quantity,
      from: BinanceOrderStatusEnum.OPEN,
    })).to.be.eq(AlunaOrderStatusEnum.OPEN)

  })



  it('should translate Aluna order status to Binance order status', () => {

    expect(translateOrderStatusToBinance({
      from: AlunaOrderStatusEnum.OPEN,
    })).to.be.eq(BinanceOrderStatusEnum.OPEN)

    expect(translateOrderStatusToBinance({
      from: AlunaOrderStatusEnum.PARTIALLY_FILLED,
    })).to.be.eq(BinanceOrderStatusEnum.OPEN)

    expect(translateOrderStatusToBinance({
      from: AlunaOrderStatusEnum.FILLED,
    })).to.be.eq(BinanceOrderStatusEnum.CLOSED)

    expect(translateOrderStatusToBinance({
      from: AlunaOrderStatusEnum.CANCELED,
    })).to.be.eq(BinanceOrderStatusEnum.CLOSED)

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