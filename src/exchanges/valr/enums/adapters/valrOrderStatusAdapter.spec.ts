import { expect } from 'chai'

import { AlunaError } from '../../../../lib/core/AlunaError'
import { AlunaOrderStatusEnum } from '../../../../lib/enums/AlunaOrderStatusEnum'
import { ValrOrderStatusEnum } from '../ValrOrderStatusEnum'
import {
  translateOrderStatusToAluna,
  translateOrderStatusToValr,
} from './valrOrderStatusAdapter'



describe(__filename, () => {

  const notSupported = 'not-supported'


  it('should translate Valr order status to Aluna order status',
    () => {

      expect(translateOrderStatusToAluna({
        from: ValrOrderStatusEnum.ACTIVE,
      })).to.be.eq(AlunaOrderStatusEnum.OPEN)

      expect(translateOrderStatusToAluna({
        from: ValrOrderStatusEnum.PLACED,
      })).to.be.eq(AlunaOrderStatusEnum.OPEN)

      expect(translateOrderStatusToAluna({
        from: ValrOrderStatusEnum.REQUESTED,
      })).to.be.eq(AlunaOrderStatusEnum.OPEN)

      expect(translateOrderStatusToAluna({
        from: ValrOrderStatusEnum.PARTIALLY_FILLED,
      })).to.be.eq(AlunaOrderStatusEnum.PARTIALLY_FILLED)

      expect(translateOrderStatusToAluna({
        from: ValrOrderStatusEnum.FILLED,
      })).to.be.eq(AlunaOrderStatusEnum.FILLED)

      expect(translateOrderStatusToAluna({
        from: ValrOrderStatusEnum.FAILED,
      })).to.be.eq(AlunaOrderStatusEnum.CANCELED)

      expect(translateOrderStatusToAluna({
        from: ValrOrderStatusEnum.EXPIRED,
      })).to.be.eq(AlunaOrderStatusEnum.CANCELED)

      expect(translateOrderStatusToAluna({
        from: ValrOrderStatusEnum.CANCELLED,
      })).to.be.eq(AlunaOrderStatusEnum.CANCELED)

      let result
      let error

      try {

        translateOrderStatusToAluna({
          from: notSupported as ValrOrderStatusEnum,
        })

      } catch (err) {

        error = err

      }


      expect(result).not.to.be.ok
      expect(error instanceof AlunaError).to.be.ok
      expect(error.message)
        .to.be.eq(`Order status not supported: ${notSupported}`)

    })



  it('should translate Aluna order status to Valr order status', () => {

    expect(translateOrderStatusToValr({
      from: AlunaOrderStatusEnum.OPEN,
    })).to.be.eq(ValrOrderStatusEnum.PLACED)

    expect(translateOrderStatusToValr({
      from: AlunaOrderStatusEnum.PARTIALLY_FILLED,
    })).to.be.eq(ValrOrderStatusEnum.PARTIALLY_FILLED)

    expect(translateOrderStatusToValr({
      from: AlunaOrderStatusEnum.FILLED,
    })).to.be.eq(ValrOrderStatusEnum.FILLED)

    expect(translateOrderStatusToValr({
      from: AlunaOrderStatusEnum.CANCELED,
    })).to.be.eq(ValrOrderStatusEnum.CANCELLED)

    let result
    let error

    try {

      result = translateOrderStatusToValr({
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
