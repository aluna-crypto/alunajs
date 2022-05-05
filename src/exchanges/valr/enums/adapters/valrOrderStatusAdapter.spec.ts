import { expect } from 'chai'

import { AlunaError } from '../../../../lib/core/AlunaError'
import { AlunaOrderStatusEnum } from '../../../../lib/enums/AlunaOrderStatusEnum'
import { ValrOrderStatusEnum } from '../ValrOrderStatusEnum'
import {
  translateOrderStatusToAluna,
  translateOrderStatusToValr,
} from './valrOrderStatusAdapter'



describe(__filename, () => {

  const notSupported = 'not-supported'


  it('should translate Valr order status to Aluna order status',
    () => {

      const quantity = '5'
      const zeroedfillQty = '0'
      const partiallyFillQty = '3'
      const totalFillQty = '5'

      expect(translateOrderStatusToAluna({
        fillQuantity: zeroedfillQty,
        quantity,
        from: ValrOrderStatusEnum.CLOSED,
      })).to.be.eq(AlunaOrderStatusEnum.CANCELED)

      expect(translateOrderStatusToAluna({
        fillQuantity: partiallyFillQty,
        quantity,
        from: ValrOrderStatusEnum.CLOSED,
      })).to.be.eq(AlunaOrderStatusEnum.PARTIALLY_FILLED)

      expect(translateOrderStatusToAluna({
        fillQuantity: totalFillQty,
        quantity,
        from: ValrOrderStatusEnum.CLOSED,
      })).to.be.eq(AlunaOrderStatusEnum.FILLED)

      expect(translateOrderStatusToAluna({
        fillQuantity: totalFillQty,
        quantity,
        from: ValrOrderStatusEnum.OPEN,
      })).to.be.eq(AlunaOrderStatusEnum.OPEN)

    })



  it('should translate Aluna order status to Valr order status', () => {

    expect(translateOrderStatusToValr({
      from: AlunaOrderStatusEnum.OPEN,
    })).to.be.eq(ValrOrderStatusEnum.OPEN)

    expect(translateOrderStatusToValr({
      from: AlunaOrderStatusEnum.PARTIALLY_FILLED,
    })).to.be.eq(ValrOrderStatusEnum.OPEN)

    expect(translateOrderStatusToValr({
      from: AlunaOrderStatusEnum.FILLED,
    })).to.be.eq(ValrOrderStatusEnum.CLOSED)

    expect(translateOrderStatusToValr({
      from: AlunaOrderStatusEnum.CANCELED,
    })).to.be.eq(ValrOrderStatusEnum.CLOSED)

    let result
    let error

    try {

      result = translateOrderStatusToValr({
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
