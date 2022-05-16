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

    const quantity = '5'
    const zeroedfillQty = '0'
    const partiallyFillQty = '3'
    const totalFillQty = '5'

    expect(translateOrderStatusToAluna({
      fillQuantity: zeroedfillQty,
      quantity,
      from: FtxOrderStatusEnum.CLOSED,
    })).to.be.eq(AlunaOrderStatusEnum.CANCELED)

    expect(translateOrderStatusToAluna({
      fillQuantity: partiallyFillQty,
      quantity,
      from: FtxOrderStatusEnum.CLOSED,
    })).to.be.eq(AlunaOrderStatusEnum.PARTIALLY_FILLED)

    expect(translateOrderStatusToAluna({
      fillQuantity: totalFillQty,
      quantity,
      from: FtxOrderStatusEnum.CLOSED,
    })).to.be.eq(AlunaOrderStatusEnum.FILLED)

    expect(translateOrderStatusToAluna({
      fillQuantity: totalFillQty,
      quantity,
      from: FtxOrderStatusEnum.OPEN,
    })).to.be.eq(AlunaOrderStatusEnum.OPEN)

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
