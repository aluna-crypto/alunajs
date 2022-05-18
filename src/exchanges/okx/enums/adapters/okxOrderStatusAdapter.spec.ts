import { expect } from 'chai'

import { AlunaError } from '../../../../lib/core/AlunaError'
import { AlunaOrderStatusEnum } from '../../../../lib/enums/AlunaOrderStatusEnum'
import { OkxOrderStatusEnum } from '../OkxOrderStatusEnum'
import {
  translateOrderStatusToAluna,
  translateOrderStatusToOkx,
} from './okxOrderStatusAdapter'



describe(__filename, () => {

  const notSupported = 'not-supported'


  it('should translate Okx order status to Aluna order status', () => {

    const quantity = '5'
    const zeroedfillQty = '0'
    const partiallyFillQty = '3'
    const totalFillQty = '5'

    expect(translateOrderStatusToAluna({
      fillQuantity: zeroedfillQty,
      quantity,
      from: OkxOrderStatusEnum.CLOSED,
    })).to.be.eq(AlunaOrderStatusEnum.CANCELED)

    expect(translateOrderStatusToAluna({
      fillQuantity: partiallyFillQty,
      quantity,
      from: OkxOrderStatusEnum.CLOSED,
    })).to.be.eq(AlunaOrderStatusEnum.PARTIALLY_FILLED)

    expect(translateOrderStatusToAluna({
      fillQuantity: totalFillQty,
      quantity,
      from: OkxOrderStatusEnum.CLOSED,
    })).to.be.eq(AlunaOrderStatusEnum.FILLED)

    expect(translateOrderStatusToAluna({
      fillQuantity: totalFillQty,
      quantity,
      from: OkxOrderStatusEnum.OPEN,
    })).to.be.eq(AlunaOrderStatusEnum.OPEN)

  })



  it('should translate Aluna order status to Okx order status', () => {

    expect(translateOrderStatusToOkx({
      from: AlunaOrderStatusEnum.OPEN,
    })).to.be.eq(OkxOrderStatusEnum.OPEN)

    expect(translateOrderStatusToOkx({
      from: AlunaOrderStatusEnum.PARTIALLY_FILLED,
    })).to.be.eq(OkxOrderStatusEnum.OPEN)

    expect(translateOrderStatusToOkx({
      from: AlunaOrderStatusEnum.FILLED,
    })).to.be.eq(OkxOrderStatusEnum.CLOSED)

    expect(translateOrderStatusToOkx({
      from: AlunaOrderStatusEnum.CANCELED,
    })).to.be.eq(OkxOrderStatusEnum.CLOSED)

    let result
    let error

    try {

      result = translateOrderStatusToOkx({
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
