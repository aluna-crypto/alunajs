import { expect } from 'chai'

import { AlunaError } from '../../../../lib/core/AlunaError'
import { AlunaOrderStatusEnum } from '../../../../lib/enums/AlunaOrderStatusEnum'
import { SampleOrderStatusEnum } from '../SampleOrderStatusEnum'
import {
  translateOrderStatusToAluna,
  translateOrderStatusToSample,
} from './sampleOrderStatusAdapter'



describe(__filename, () => {

  const notSupported = 'not-supported'


  it('should translate Sample order status to Aluna order status', () => {

    const quantity = '5'
    const zeroedfillQty = '0'
    const partiallyFillQty = '3'
    const totalFillQty = '5'

    expect(translateOrderStatusToAluna({
      fillQuantity: zeroedfillQty,
      quantity,
      from: SampleOrderStatusEnum.CLOSED,
    })).to.be.eq(AlunaOrderStatusEnum.CANCELED)

    expect(translateOrderStatusToAluna({
      fillQuantity: partiallyFillQty,
      quantity,
      from: SampleOrderStatusEnum.CLOSED,
    })).to.be.eq(AlunaOrderStatusEnum.PARTIALLY_FILLED)

    expect(translateOrderStatusToAluna({
      fillQuantity: totalFillQty,
      quantity,
      from: SampleOrderStatusEnum.CLOSED,
    })).to.be.eq(AlunaOrderStatusEnum.FILLED)

    expect(translateOrderStatusToAluna({
      fillQuantity: totalFillQty,
      quantity,
      from: SampleOrderStatusEnum.OPEN,
    })).to.be.eq(AlunaOrderStatusEnum.OPEN)

  })



  it('should translate Aluna order status to Sample order status', () => {

    expect(translateOrderStatusToSample({
      from: AlunaOrderStatusEnum.OPEN,
    })).to.be.eq(SampleOrderStatusEnum.OPEN)

    expect(translateOrderStatusToSample({
      from: AlunaOrderStatusEnum.PARTIALLY_FILLED,
    })).to.be.eq(SampleOrderStatusEnum.OPEN)

    expect(translateOrderStatusToSample({
      from: AlunaOrderStatusEnum.FILLED,
    })).to.be.eq(SampleOrderStatusEnum.CLOSED)

    expect(translateOrderStatusToSample({
      from: AlunaOrderStatusEnum.CANCELED,
    })).to.be.eq(SampleOrderStatusEnum.CLOSED)

    let result
    let error

    try {

      result = translateOrderStatusToSample({
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
