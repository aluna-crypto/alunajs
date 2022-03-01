import { expect } from 'chai'

import { AlunaOrderStatusEnum } from '../../../../lib/enums/AlunaOrderStatusEnum'
import { BitmexOrderStatusEnum } from '../BitmexOrderStatusEnum'
import { BitmexStatusAdapter } from './BitmexStatusAdapter'



describe('BitmexStatusAdapter', () => {

  const notSupported = 'not-supported'

  it('should translate Bitmex order status to Aluna order status', () => {

    let error

    expect(BitmexStatusAdapter.translateToAluna({
      from: BitmexOrderStatusEnum.NEW,
    })).to.be.eq(AlunaOrderStatusEnum.OPEN)

    expect(BitmexStatusAdapter.translateToAluna({
      from: BitmexOrderStatusEnum.PARTIALLY_FILLED,
    })).to.be.eq(AlunaOrderStatusEnum.PARTIALLY_FILLED)

    expect(BitmexStatusAdapter.translateToAluna({
      from: BitmexOrderStatusEnum.FILLED,
    })).to.be.eq(AlunaOrderStatusEnum.FILLED)

    expect(BitmexStatusAdapter.translateToAluna({
      from: BitmexOrderStatusEnum.CANCELED,
    })).to.be.eq(AlunaOrderStatusEnum.CANCELED)

    expect(BitmexStatusAdapter.translateToAluna({
      from: BitmexOrderStatusEnum.EXPIRED,
    })).to.be.eq(AlunaOrderStatusEnum.CANCELED)

    expect(BitmexStatusAdapter.translateToAluna({
      from: BitmexOrderStatusEnum.PENDING_CANCEL,
    })).to.be.eq(AlunaOrderStatusEnum.CANCELED)

    expect(BitmexStatusAdapter.translateToAluna({
      from: BitmexOrderStatusEnum.DONE_FOR_DAY,
    })).to.be.eq(AlunaOrderStatusEnum.CANCELED)

    expect(BitmexStatusAdapter.translateToAluna({
      from: BitmexOrderStatusEnum.REJECTED,
    })).to.be.eq(AlunaOrderStatusEnum.CANCELED)

    expect(BitmexStatusAdapter.translateToAluna({
      from: BitmexOrderStatusEnum.PENDING_NEW,
    })).to.be.eq(AlunaOrderStatusEnum.CANCELED)

    expect(BitmexStatusAdapter.translateToAluna({
      from: BitmexOrderStatusEnum.STOPPED,
    })).to.be.eq(AlunaOrderStatusEnum.CANCELED)

    try {

      BitmexStatusAdapter.translateToAluna({
        from: notSupported as BitmexOrderStatusEnum,
      })

    } catch (err) {

      error = err

    }

    expect(error).to.be.ok

    const { message } = error
    expect(message).to.be.eq(`Order status not supported: ${notSupported}`)

  })

  it('should translate Aluna order status to Bitmex order status', () => {

    let error

    expect(BitmexStatusAdapter.translateToBitmex({
      from: AlunaOrderStatusEnum.OPEN,
    })).to.be.eq(BitmexOrderStatusEnum.NEW)

    expect(BitmexStatusAdapter.translateToBitmex({
      from: AlunaOrderStatusEnum.PARTIALLY_FILLED,
    })).to.be.eq(BitmexOrderStatusEnum.PARTIALLY_FILLED)

    expect(BitmexStatusAdapter.translateToBitmex({
      from: AlunaOrderStatusEnum.FILLED,
    })).to.be.eq(BitmexOrderStatusEnum.FILLED)

    expect(BitmexStatusAdapter.translateToBitmex({
      from: AlunaOrderStatusEnum.CANCELED,
    })).to.be.eq(BitmexOrderStatusEnum.CANCELED)

    try {

      BitmexStatusAdapter.translateToBitmex({
        from: notSupported as AlunaOrderStatusEnum,
      })

    } catch (err) {

      error = err

    }

    expect(error).to.be.ok

    const { message } = error
    expect(message).to.be.eq(`Order status not supported: ${notSupported}`)

  })

})
