import { expect } from 'chai'

import { AlunaError } from '../../../../lib/core/AlunaError'
import { AlunaOrderStatusEnum } from '../../../../lib/enums/AlunaOrderStatusEnum'
import { HuobiOrderStatusEnum } from '../HuobiOrderStatusEnum'
import { HuobiStatusAdapter } from './HuobiStatusAdapter'



describe('HuobiStatusAdapter', () => {

  const notSupported = 'not-supported'



  it('should translate Huobi order status to Aluna order status',
    () => {

      expect(HuobiStatusAdapter.translateToAluna({
        from: HuobiOrderStatusEnum.CREATED,
      })).to.be.eq(AlunaOrderStatusEnum.OPEN)

      expect(HuobiStatusAdapter.translateToAluna({
        from: HuobiOrderStatusEnum.SUBMITTED,
      })).to.be.eq(AlunaOrderStatusEnum.OPEN)

      expect(HuobiStatusAdapter.translateToAluna({
        from: HuobiOrderStatusEnum.PARTIAL_FILLED,
      })).to.be.eq(AlunaOrderStatusEnum.PARTIALLY_FILLED)

      expect(HuobiStatusAdapter.translateToAluna({
        from: HuobiOrderStatusEnum.FILLED,
      })).to.be.eq(AlunaOrderStatusEnum.FILLED)

      expect(HuobiStatusAdapter.translateToAluna({
        from: HuobiOrderStatusEnum.CANCELED,
      })).to.be.eq(AlunaOrderStatusEnum.CANCELED)

      let result
      let error

      try {

        result = HuobiStatusAdapter.translateToAluna({
          from: notSupported as HuobiOrderStatusEnum,
        })

      } catch (err) {

        error = err

      }

      expect(result).not.to.be.ok

      expect(error instanceof AlunaError).to.be.ok
      expect(error.message)
        .to.be.eq(`Order status not supported: ${notSupported}`)

    })



  it('should translate Aluna order status to Huobi order status', () => {

    expect(HuobiStatusAdapter.translateToHuobi({
      from: AlunaOrderStatusEnum.OPEN,
    })).to.be.eq(HuobiOrderStatusEnum.CREATED)

    expect(HuobiStatusAdapter.translateToHuobi({
      from: AlunaOrderStatusEnum.PARTIALLY_FILLED,
    })).to.be.eq(HuobiOrderStatusEnum.PARTIAL_FILLED)

    expect(HuobiStatusAdapter.translateToHuobi({
      from: AlunaOrderStatusEnum.FILLED,
    })).to.be.eq(HuobiOrderStatusEnum.FILLED)

    expect(HuobiStatusAdapter.translateToHuobi({
      from: AlunaOrderStatusEnum.CANCELED,
    })).to.be.eq(HuobiOrderStatusEnum.CANCELED)

    let result
    let error

    try {

      result = HuobiStatusAdapter.translateToHuobi({
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
