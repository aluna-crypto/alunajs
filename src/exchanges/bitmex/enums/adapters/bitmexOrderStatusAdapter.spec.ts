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

    expect(translateOrderStatusToAluna({
      from: BitmexOrderStatusEnum.NEW,
    })).to.be.eq(AlunaOrderStatusEnum.OPEN)

    expect(translateOrderStatusToAluna({
      from: BitmexOrderStatusEnum.PARTIALLY_FILLED,
    })).to.be.eq(AlunaOrderStatusEnum.PARTIALLY_FILLED)

    expect(translateOrderStatusToAluna({
      from: BitmexOrderStatusEnum.FILLED,
    })).to.be.eq(AlunaOrderStatusEnum.FILLED)

    expect(translateOrderStatusToAluna({
      from: BitmexOrderStatusEnum.CANCELED,
    })).to.be.eq(AlunaOrderStatusEnum.CANCELED)

    expect(translateOrderStatusToAluna({
      from: BitmexOrderStatusEnum.REJECTED,
    })).to.be.eq(AlunaOrderStatusEnum.CANCELED)

    expect(translateOrderStatusToAluna({
      from: BitmexOrderStatusEnum.EXPIRED,
    })).to.be.eq(AlunaOrderStatusEnum.CANCELED)

    expect(translateOrderStatusToAluna({
      from: BitmexOrderStatusEnum.DONE_FOR_DAY,
    })).to.be.eq(AlunaOrderStatusEnum.CANCELED)

    expect(translateOrderStatusToAluna({
      from: BitmexOrderStatusEnum.PENDING_CANCEL,
    })).to.be.eq(AlunaOrderStatusEnum.CANCELED)

    expect(translateOrderStatusToAluna({
      from: BitmexOrderStatusEnum.PENDING_NEW,
    })).to.be.eq(AlunaOrderStatusEnum.CANCELED)

    expect(translateOrderStatusToAluna({
      from: BitmexOrderStatusEnum.STOPPED,
    })).to.be.eq(AlunaOrderStatusEnum.CANCELED)

  })

  it('should translate Aluna order status to Bitmex order status', () => {

    expect(translateOrderStatusToBitmex({
      from: AlunaOrderStatusEnum.OPEN,
    })).to.be.eq(BitmexOrderStatusEnum.NEW)

    expect(translateOrderStatusToBitmex({
      from: AlunaOrderStatusEnum.PARTIALLY_FILLED,
    })).to.be.eq(BitmexOrderStatusEnum.PARTIALLY_FILLED)

    expect(translateOrderStatusToBitmex({
      from: AlunaOrderStatusEnum.FILLED,
    })).to.be.eq(BitmexOrderStatusEnum.FILLED)

    expect(translateOrderStatusToBitmex({
      from: AlunaOrderStatusEnum.CANCELED,
    })).to.be.eq(BitmexOrderStatusEnum.CANCELED)

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
