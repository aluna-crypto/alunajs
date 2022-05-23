import { expect } from 'chai'

import { AlunaError } from '../../../../lib/core/AlunaError'
import { AlunaOrderStatusEnum } from '../../../../lib/enums/AlunaOrderStatusEnum'
import { HuobiOrderStatusEnum } from '../HuobiOrderStatusEnum'
import {
  translateOrderStatusToAluna,
  translateOrderStatusToHuobi,
} from './huobiOrderStatusAdapter'



describe(__filename, () => {

  const notSupported = 'not-supported'


  it('should translate Huobi order status to Aluna order status', () => {

    const quantity = '5'
    const zeroedfillQty = '0'
    const partiallyFillQty = '3'
    const totalFillQty = '5'

    expect(translateOrderStatusToAluna({
      fillQuantity: zeroedfillQty,
      quantity,
      from: HuobiOrderStatusEnum.CLOSED,
    })).to.be.eq(AlunaOrderStatusEnum.CANCELED)

    expect(translateOrderStatusToAluna({
      fillQuantity: partiallyFillQty,
      quantity,
      from: HuobiOrderStatusEnum.CLOSED,
    })).to.be.eq(AlunaOrderStatusEnum.PARTIALLY_FILLED)

    expect(translateOrderStatusToAluna({
      fillQuantity: totalFillQty,
      quantity,
      from: HuobiOrderStatusEnum.CLOSED,
    })).to.be.eq(AlunaOrderStatusEnum.FILLED)

    expect(translateOrderStatusToAluna({
      fillQuantity: totalFillQty,
      quantity,
      from: HuobiOrderStatusEnum.OPEN,
    })).to.be.eq(AlunaOrderStatusEnum.OPEN)

  })



  it('should translate Aluna order status to Huobi order status', () => {

    expect(translateOrderStatusToHuobi({
      from: AlunaOrderStatusEnum.OPEN,
    })).to.be.eq(HuobiOrderStatusEnum.OPEN)

    expect(translateOrderStatusToHuobi({
      from: AlunaOrderStatusEnum.PARTIALLY_FILLED,
    })).to.be.eq(HuobiOrderStatusEnum.OPEN)

    expect(translateOrderStatusToHuobi({
      from: AlunaOrderStatusEnum.FILLED,
    })).to.be.eq(HuobiOrderStatusEnum.CLOSED)

    expect(translateOrderStatusToHuobi({
      from: AlunaOrderStatusEnum.CANCELED,
    })).to.be.eq(HuobiOrderStatusEnum.CLOSED)

    let result
    let error

    try {

      result = translateOrderStatusToHuobi({
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
