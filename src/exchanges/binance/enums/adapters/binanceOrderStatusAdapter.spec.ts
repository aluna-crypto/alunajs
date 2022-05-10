import { expect } from 'chai'

import { AlunaError } from '../../../../lib/core/AlunaError'
import { AlunaOrderStatusEnum } from '../../../../lib/enums/AlunaOrderStatusEnum'
import { binanceOrderStatusEnum } from '../binanceOrderStatusEnum'
import {
  translateOrderStatusToAluna,
  translateOrderStatusTobinance,
} from './binanceOrderStatusAdapter'



describe(__filename, () => {

  const notSupported = 'not-supported'


  it('should translate binance order status to Aluna order status', () => {

    const quantity = '5'
    const zeroedfillQty = '0'
    const partiallyFillQty = '3'
    const totalFillQty = '5'

    expect(translateOrderStatusToAluna({
      fillQuantity: zeroedfillQty,
      quantity,
      from: binanceOrderStatusEnum.CLOSED,
    })).to.be.eq(AlunaOrderStatusEnum.CANCELED)

    expect(translateOrderStatusToAluna({
      fillQuantity: partiallyFillQty,
      quantity,
      from: binanceOrderStatusEnum.CLOSED,
    })).to.be.eq(AlunaOrderStatusEnum.PARTIALLY_FILLED)

    expect(translateOrderStatusToAluna({
      fillQuantity: totalFillQty,
      quantity,
      from: binanceOrderStatusEnum.CLOSED,
    })).to.be.eq(AlunaOrderStatusEnum.FILLED)

    expect(translateOrderStatusToAluna({
      fillQuantity: totalFillQty,
      quantity,
      from: binanceOrderStatusEnum.OPEN,
    })).to.be.eq(AlunaOrderStatusEnum.OPEN)

  })



  it('should translate Aluna order status to binance order status', () => {

    expect(translateOrderStatusTobinance({
      from: AlunaOrderStatusEnum.OPEN,
    })).to.be.eq(binanceOrderStatusEnum.OPEN)

    expect(translateOrderStatusTobinance({
      from: AlunaOrderStatusEnum.PARTIALLY_FILLED,
    })).to.be.eq(binanceOrderStatusEnum.OPEN)

    expect(translateOrderStatusTobinance({
      from: AlunaOrderStatusEnum.FILLED,
    })).to.be.eq(binanceOrderStatusEnum.CLOSED)

    expect(translateOrderStatusTobinance({
      from: AlunaOrderStatusEnum.CANCELED,
    })).to.be.eq(binanceOrderStatusEnum.CLOSED)

    let result
    let error

    try {

      result = translateOrderStatusTobinance({
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
