import { expect } from 'chai'

import { AlunaError } from '../../../../lib/core/AlunaError'
import { AlunaOrderStatusEnum } from '../../../../lib/enums/AlunaOrderStatusEnum'
import { PoloniexOrderStatusEnum } from '../PoloniexOrderStatusEnum'
import {
  translateOrderStatusToAluna,
  translateOrderStatusToPoloniex,
} from './poloniexOrderStatusAdapter'



describe(__filename, () => {

  const notSupported = 'not-supported'


  it('should translate Poloniex order status to Aluna order status', () => {

    const quantity = '5'
    const zeroedfillQty = '0'
    const partiallyFillQty = '3'
    const totalFillQty = '5'

    expect(translateOrderStatusToAluna({
      fillQuantity: zeroedfillQty,
      quantity,
      from: PoloniexOrderStatusEnum.CLOSED,
    })).to.be.eq(AlunaOrderStatusEnum.CANCELED)

    expect(translateOrderStatusToAluna({
      fillQuantity: partiallyFillQty,
      quantity,
      from: PoloniexOrderStatusEnum.CLOSED,
    })).to.be.eq(AlunaOrderStatusEnum.PARTIALLY_FILLED)

    expect(translateOrderStatusToAluna({
      fillQuantity: totalFillQty,
      quantity,
      from: PoloniexOrderStatusEnum.CLOSED,
    })).to.be.eq(AlunaOrderStatusEnum.FILLED)

    expect(translateOrderStatusToAluna({
      fillQuantity: totalFillQty,
      quantity,
      from: PoloniexOrderStatusEnum.OPEN,
    })).to.be.eq(AlunaOrderStatusEnum.OPEN)

  })



  it('should translate Aluna order status to Poloniex order status', () => {

    expect(translateOrderStatusToPoloniex({
      from: AlunaOrderStatusEnum.OPEN,
    })).to.be.eq(PoloniexOrderStatusEnum.OPEN)

    expect(translateOrderStatusToPoloniex({
      from: AlunaOrderStatusEnum.PARTIALLY_FILLED,
    })).to.be.eq(PoloniexOrderStatusEnum.OPEN)

    expect(translateOrderStatusToPoloniex({
      from: AlunaOrderStatusEnum.FILLED,
    })).to.be.eq(PoloniexOrderStatusEnum.CLOSED)

    expect(translateOrderStatusToPoloniex({
      from: AlunaOrderStatusEnum.CANCELED,
    })).to.be.eq(PoloniexOrderStatusEnum.CLOSED)

    let result
    let error

    try {

      result = translateOrderStatusToPoloniex({
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
