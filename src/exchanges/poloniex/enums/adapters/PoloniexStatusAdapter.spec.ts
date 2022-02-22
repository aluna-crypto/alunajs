import { expect } from 'chai'

import { AlunaError } from '../../../../lib/core/AlunaError'
import { AlunaOrderStatusEnum } from '../../../../lib/enums/AlunaOrderStatusEnum'
import { PoloniexOrderStatusEnum } from '../PoloniexOrderStatusEnum'
import { PoloniexStatusAdapter } from './PoloniexStatusAdapter'



describe('PoloniexStatusAdapter', () => {

  const notSupported = 'not-supported'



  it('should translate Poloniex order status to Aluna order status',
    () => {

      expect(PoloniexStatusAdapter.translateToAluna({
        from: PoloniexOrderStatusEnum.OPEN,
      })).to.be.eq(AlunaOrderStatusEnum.OPEN)

      expect(PoloniexStatusAdapter.translateToAluna({
        from: PoloniexOrderStatusEnum.PARTIALLY_FILLED,
      })).to.be.eq(AlunaOrderStatusEnum.PARTIALLY_FILLED)

      expect(PoloniexStatusAdapter.translateToAluna({
        from: PoloniexOrderStatusEnum.CANCELED,
      })).to.be.eq(AlunaOrderStatusEnum.CANCELED)

      let result
      let error

      try {

        result = PoloniexStatusAdapter.translateToAluna({
          from: notSupported as PoloniexOrderStatusEnum,
        })

      } catch (err) {

        error = err

      }

      expect(result).not.to.be.ok

      expect(error instanceof AlunaError).to.be.ok
      expect(error.message)
        .to.be.eq(`Order status not supported: ${notSupported}`)

    })



  it('should translate Aluna order status to Poloniex order status', () => {

    expect(PoloniexStatusAdapter.translateToPoloniex({
      from: AlunaOrderStatusEnum.OPEN,
    })).to.be.eq(PoloniexOrderStatusEnum.OPEN)

    expect(PoloniexStatusAdapter.translateToPoloniex({
      from: AlunaOrderStatusEnum.PARTIALLY_FILLED,
    })).to.be.eq(PoloniexOrderStatusEnum.PARTIALLY_FILLED)

    expect(PoloniexStatusAdapter.translateToPoloniex({
      from: AlunaOrderStatusEnum.CANCELED,
    })).to.be.eq(PoloniexOrderStatusEnum.CANCELED)

    let result
    let error

    try {

      result = PoloniexStatusAdapter.translateToPoloniex({
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
