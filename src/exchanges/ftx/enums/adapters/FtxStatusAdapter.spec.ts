import { expect } from 'chai'

import { AlunaError } from '../../../../lib/core/AlunaError'
import { AlunaOrderStatusEnum } from '../../../../lib/enums/AlunaOrderStatusEnum'
import { FtxOrderStatusEnum } from '../FtxOrderStatusEnum'
import { FtxStatusAdapter } from './FtxStatusAdapter'



describe('FtxStatusAdapter', () => {

  const notSupported = 'not-supported'



  it('should translate Ftx order status to Aluna order status',
    () => {

      expect(FtxStatusAdapter.translateToAluna({
        from: FtxOrderStatusEnum.NEW,
      })).to.be.eq(AlunaOrderStatusEnum.OPEN)

      expect(FtxStatusAdapter.translateToAluna({
        from: FtxOrderStatusEnum.OPEN,
      })).to.be.eq(AlunaOrderStatusEnum.OPEN)

      expect(FtxStatusAdapter.translateToAluna({
        from: FtxOrderStatusEnum.CLOSED,
      })).to.be.eq(AlunaOrderStatusEnum.FILLED)

      let result
      let error

      try {

        result = FtxStatusAdapter.translateToAluna({
          from: notSupported as FtxOrderStatusEnum,
        })

      } catch (err) {

        error = err

      }

      expect(result).not.to.be.ok

      expect(error instanceof AlunaError).to.be.ok
      expect(error.message)
        .to.be.eq(`Order status not supported: ${notSupported}`)

    })



  it('should translate Aluna order status to Ftx order status', () => {

    expect(FtxStatusAdapter.translateToFtx({
      from: AlunaOrderStatusEnum.OPEN,
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
