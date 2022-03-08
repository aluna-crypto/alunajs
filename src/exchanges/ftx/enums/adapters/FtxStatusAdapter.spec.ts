import { expect } from 'chai'

import { AlunaError } from '../../../../lib/core/AlunaError'
import { AlunaOrderStatusEnum } from '../../../../lib/enums/AlunaOrderStatusEnum'
import { FtxOrderStatusEnum } from '../FtxOrderStatusEnum'
import { FtxStatusAdapter } from './FtxStatusAdapter'



describe('FtxStatusAdapter', () => {

  const notSupported = 'not-supported'



  it('should translate Ftx order status to Aluna order status',
    () => {

      const zeroedFilledAmount = 0
      const partiallyFilledAmount = 2.5
      const totalFilledAmount = 5
      const size = 5

      expect(FtxStatusAdapter.translateToAluna({
        from: FtxOrderStatusEnum.NEW,
        filledSize: zeroedFilledAmount,
        size,
      })).to.be.eq(AlunaOrderStatusEnum.OPEN)

      expect(FtxStatusAdapter.translateToAluna({
        from: FtxOrderStatusEnum.OPEN,
        filledSize: zeroedFilledAmount,
        size,
      })).to.be.eq(AlunaOrderStatusEnum.OPEN)

      expect(FtxStatusAdapter.translateToAluna({
        from: FtxOrderStatusEnum.OPEN,
        filledSize: partiallyFilledAmount,
        size,
      })).to.be.eq(AlunaOrderStatusEnum.PARTIALLY_FILLED)

      expect(FtxStatusAdapter.translateToAluna({
        from: FtxOrderStatusEnum.CLOSED,
        filledSize: totalFilledAmount,
        size,
      })).to.be.eq(AlunaOrderStatusEnum.FILLED)

      expect(FtxStatusAdapter.translateToAluna({
        from: FtxOrderStatusEnum.CLOSED,
        filledSize: zeroedFilledAmount,
        size,
      })).to.be.eq(AlunaOrderStatusEnum.CANCELED)

    })



  it('should translate Aluna order status to Ftx order status', () => {

    expect(FtxStatusAdapter.translateToFtx({
      from: AlunaOrderStatusEnum.OPEN,
    })).to.be.eq(FtxOrderStatusEnum.OPEN)

    expect(FtxStatusAdapter.translateToFtx({
      from: AlunaOrderStatusEnum.PARTIALLY_FILLED,
    })).to.be.eq(FtxOrderStatusEnum.OPEN)

    expect(FtxStatusAdapter.translateToFtx({
      from: AlunaOrderStatusEnum.CANCELED,
    })).to.be.eq(FtxOrderStatusEnum.CLOSED)

    expect(FtxStatusAdapter.translateToFtx({
      from: AlunaOrderStatusEnum.FILLED,
    })).to.be.eq(FtxOrderStatusEnum.CLOSED)

    let result
    let error

    try {

      result = FtxStatusAdapter.translateToFtx({
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
