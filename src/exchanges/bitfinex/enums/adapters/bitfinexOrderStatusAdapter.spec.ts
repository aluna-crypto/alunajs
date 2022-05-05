import { expect } from 'chai'

import { AlunaError } from '../../../../lib/core/AlunaError'
import { AlunaOrderStatusEnum } from '../../../../lib/enums/AlunaOrderStatusEnum'
import { BitfinexOrderStatusEnum } from '../BitfinexOrderStatusEnum'
import {
  translateOrderStatusToAluna,
  translateOrderStatusToBitfinex,
} from './bitfinexOrderStatusAdapter'



describe(__filename, () => {

  const notSupported = 'not-supported'


  it('should translate Bitfinex order status to Aluna order status',
    () => {

      const quantity = '5'
      const zeroedfillQty = '0'
      const partiallyFillQty = '3'
      const totalFillQty = '5'

      expect(translateOrderStatusToAluna({
        fillQuantity: zeroedfillQty,
        quantity,
        from: BitfinexOrderStatusEnum.CLOSED,
      })).to.be.eq(AlunaOrderStatusEnum.CANCELED)

      expect(translateOrderStatusToAluna({
        fillQuantity: partiallyFillQty,
        quantity,
        from: BitfinexOrderStatusEnum.CLOSED,
      })).to.be.eq(AlunaOrderStatusEnum.PARTIALLY_FILLED)

      expect(translateOrderStatusToAluna({
        fillQuantity: totalFillQty,
        quantity,
        from: BitfinexOrderStatusEnum.CLOSED,
      })).to.be.eq(AlunaOrderStatusEnum.FILLED)

      expect(translateOrderStatusToAluna({
        fillQuantity: totalFillQty,
        quantity,
        from: BitfinexOrderStatusEnum.OPEN,
      })).to.be.eq(AlunaOrderStatusEnum.OPEN)

    })



  it('should translate Aluna order status to Bitfinex order status', () => {

    expect(translateOrderStatusToBitfinex({
      from: AlunaOrderStatusEnum.OPEN,
    })).to.be.eq(BitfinexOrderStatusEnum.OPEN)

    expect(translateOrderStatusToBitfinex({
      from: AlunaOrderStatusEnum.PARTIALLY_FILLED,
    })).to.be.eq(BitfinexOrderStatusEnum.OPEN)

    expect(translateOrderStatusToBitfinex({
      from: AlunaOrderStatusEnum.FILLED,
    })).to.be.eq(BitfinexOrderStatusEnum.CLOSED)

    expect(translateOrderStatusToBitfinex({
      from: AlunaOrderStatusEnum.CANCELED,
    })).to.be.eq(BitfinexOrderStatusEnum.CLOSED)

    let result
    let error

    try {

      result = translateOrderStatusToBitfinex({
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
