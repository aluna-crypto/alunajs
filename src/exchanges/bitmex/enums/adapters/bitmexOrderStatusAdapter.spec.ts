import { expect } from 'chai'

import { AlunaError } from '../../../../lib/core/AlunaError'
import { AlunaOrderStatusEnum } from '../../../../lib/enums/AlunaOrderStatusEnum'
import { BitmexOrderStatusEnum } from '../BitmexOrderStatusEnum'
import {
  translateOrderStatusToAluna,
  translateOrderStatusToBitmex,
} from './bitmexOrderStatusAdapter'



describe(__filename, () => {

  const notSupported = 'not-supported'


  it('should translate Bitmex order status to Aluna order status', () => {

    const quantity = '5'
    const zeroedfillQty = '0'
    const partiallyFillQty = '3'
    const totalFillQty = '5'

    expect(translateOrderStatusToAluna({
      fillQuantity: zeroedfillQty,
      quantity,
      from: BitmexOrderStatusEnum.CLOSED,
    })).to.be.eq(AlunaOrderStatusEnum.CANCELED)

    expect(translateOrderStatusToAluna({
      fillQuantity: partiallyFillQty,
      quantity,
      from: BitmexOrderStatusEnum.CLOSED,
    })).to.be.eq(AlunaOrderStatusEnum.PARTIALLY_FILLED)

    expect(translateOrderStatusToAluna({
      fillQuantity: totalFillQty,
      quantity,
      from: BitmexOrderStatusEnum.CLOSED,
    })).to.be.eq(AlunaOrderStatusEnum.FILLED)

    expect(translateOrderStatusToAluna({
      fillQuantity: totalFillQty,
      quantity,
      from: BitmexOrderStatusEnum.OPEN,
    })).to.be.eq(AlunaOrderStatusEnum.OPEN)

  })



  it('should translate Aluna order status to Bitmex order status', () => {

    expect(translateOrderStatusToBitmex({
      from: AlunaOrderStatusEnum.OPEN,
    })).to.be.eq(BitmexOrderStatusEnum.OPEN)

    expect(translateOrderStatusToBitmex({
      from: AlunaOrderStatusEnum.PARTIALLY_FILLED,
    })).to.be.eq(BitmexOrderStatusEnum.OPEN)

    expect(translateOrderStatusToBitmex({
      from: AlunaOrderStatusEnum.FILLED,
    })).to.be.eq(BitmexOrderStatusEnum.CLOSED)

    expect(translateOrderStatusToBitmex({
      from: AlunaOrderStatusEnum.CANCELED,
    })).to.be.eq(BitmexOrderStatusEnum.CLOSED)

    let result
    let error

    try {

      result = translateOrderStatusToBitmex({
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
