import { expect } from 'chai'

import { AlunaError } from '../../../../lib/core/AlunaError'
import { AlunaOrderStatusEnum } from '../../../../lib/enums/AlunaOrderStatusEnum'
import { FtxOrderStatusEnum } from '../FtxOrderStatusEnum'
import {
  translateOrderStatusToAluna,
  translateOrderStatusToFtx,
} from './ftxOrderStatusAdapter'



describe(__filename, () => {

  const notSupported = 'not-supported'


  it('should translate Ftx order status to Aluna order status', () => {

    const zeroedFilledAmount = 0
    const partiallyFilledAmount = 2.5
    const totalFilledAmount = 5
    const size = 5

    expect(translateOrderStatusToAluna({
      status: FtxOrderStatusEnum.NEW,
      filledSize: zeroedFilledAmount,
      size,
    })).to.be.eq(AlunaOrderStatusEnum.OPEN)

    expect(translateOrderStatusToAluna({
      status: FtxOrderStatusEnum.OPEN,
      filledSize: zeroedFilledAmount,
      size,
    })).to.be.eq(AlunaOrderStatusEnum.OPEN)

    expect(translateOrderStatusToAluna({
      status: FtxOrderStatusEnum.OPEN,
      filledSize: partiallyFilledAmount,
      size,
    })).to.be.eq(AlunaOrderStatusEnum.PARTIALLY_FILLED)

    expect(translateOrderStatusToAluna({
      status: FtxOrderStatusEnum.CANCELLED,
      filledSize: partiallyFilledAmount,
      size,
    })).to.be.eq(AlunaOrderStatusEnum.CANCELED)

    expect(translateOrderStatusToAluna({
      status: FtxOrderStatusEnum.CLOSED,
      filledSize: totalFilledAmount,
      size,
    })).to.be.eq(AlunaOrderStatusEnum.FILLED)

    expect(translateOrderStatusToAluna({
      status: FtxOrderStatusEnum.CLOSED,
      filledSize: zeroedFilledAmount,
      size,
    })).to.be.eq(AlunaOrderStatusEnum.CANCELED)

    expect(translateOrderStatusToAluna({
      status: FtxOrderStatusEnum.TRIGGERED,
      filledSize: zeroedFilledAmount,
      size,
    })).to.be.eq(AlunaOrderStatusEnum.FILLED)

  })



  it('should translate Aluna order status to Ftx order status', () => {

    expect(translateOrderStatusToFtx({
      from: AlunaOrderStatusEnum.OPEN,
    })).to.be.eq(FtxOrderStatusEnum.OPEN)

    expect(translateOrderStatusToFtx({
      from: AlunaOrderStatusEnum.PARTIALLY_FILLED,
    })).to.be.eq(FtxOrderStatusEnum.OPEN)

    expect(translateOrderStatusToFtx({
      from: AlunaOrderStatusEnum.FILLED,
    })).to.be.eq(FtxOrderStatusEnum.CLOSED)

    expect(translateOrderStatusToFtx({
      from: AlunaOrderStatusEnum.CANCELED,
    })).to.be.eq(FtxOrderStatusEnum.CLOSED)

    let result
    let error

    try {

      result = translateOrderStatusToFtx({
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
