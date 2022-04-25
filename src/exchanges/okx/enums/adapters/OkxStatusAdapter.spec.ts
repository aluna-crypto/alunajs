import { expect } from 'chai'

import { AlunaError } from '../../../../lib/core/AlunaError'
import { AlunaOrderStatusEnum } from '../../../../lib/enums/AlunaOrderStatusEnum'
import { OkxOrderStatusEnum } from '../OkxOrderStatusEnum'
import { OkxStatusAdapter } from './OkxStatusAdapter'



describe('OkxStatusAdapter', () => {

  const notSupported = 'not-supported'



  it('should translate Okx order status to Aluna order status',
    () => {

      expect(OkxStatusAdapter.translateToAluna({
        from: OkxOrderStatusEnum.LIVE,
      })).to.be.eq(AlunaOrderStatusEnum.OPEN)

      expect(OkxStatusAdapter.translateToAluna({
        from: OkxOrderStatusEnum.PARTIALLY_FILLED,
      })).to.be.eq(AlunaOrderStatusEnum.PARTIALLY_FILLED)

      expect(OkxStatusAdapter.translateToAluna({
        from: OkxOrderStatusEnum.FILLED,
      })).to.be.eq(AlunaOrderStatusEnum.FILLED)

      expect(OkxStatusAdapter.translateToAluna({
        from: OkxOrderStatusEnum.CANCELED,
      })).to.be.eq(AlunaOrderStatusEnum.CANCELED)

      let result
      let error

      try {

        result = OkxStatusAdapter.translateToAluna({
          from: notSupported as OkxOrderStatusEnum,
        })

      } catch (err) {

        error = err

      }

      expect(result).not.to.be.ok

      expect(error instanceof AlunaError).to.be.ok
      expect(error.message)
        .to.be.eq(`Order status not supported: ${notSupported}`)

    })



  it('should translate Aluna order status to Okx order status', () => {

    expect(OkxStatusAdapter.translateToOkx({
      from: AlunaOrderStatusEnum.OPEN,
    })).to.be.eq(OkxOrderStatusEnum.LIVE)

    expect(OkxStatusAdapter.translateToOkx({
      from: AlunaOrderStatusEnum.PARTIALLY_FILLED,
    })).to.be.eq(OkxOrderStatusEnum.PARTIALLY_FILLED)

    expect(OkxStatusAdapter.translateToOkx({
      from: AlunaOrderStatusEnum.FILLED,
    })).to.be.eq(OkxOrderStatusEnum.FILLED)

    expect(OkxStatusAdapter.translateToOkx({
      from: AlunaOrderStatusEnum.CANCELED,
    })).to.be.eq(OkxOrderStatusEnum.CANCELED)

    let result
    let error

    try {

      result = OkxStatusAdapter.translateToOkx({
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
