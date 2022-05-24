import { expect } from 'chai'

import { AlunaError } from '../../../../lib/core/AlunaError'
import { AlunaOrderStatusEnum } from '../../../../lib/enums/AlunaOrderStatusEnum'
import { HuobiOrderStatusEnum } from '../HuobiOrderStatusEnum'
import {
  translateOrderStatusToAluna,
  translateOrderStatusToHuobi,
} from './huobiOrderStatusAdapter'



describe(__filename, () => {

  const notSupported = 'not-supported'


  it('should translate Huobi order status to Aluna order status', () => {

    expect(translateOrderStatusToAluna({
      from: HuobiOrderStatusEnum.CREATED,
    })).to.be.eq(AlunaOrderStatusEnum.OPEN)

    expect(translateOrderStatusToAluna({
      from: HuobiOrderStatusEnum.SUBMITTED,
    })).to.be.eq(AlunaOrderStatusEnum.OPEN)

    expect(translateOrderStatusToAluna({
      from: HuobiOrderStatusEnum.PARTIAL_FILLED,
    })).to.be.eq(AlunaOrderStatusEnum.PARTIALLY_FILLED)

    expect(translateOrderStatusToAluna({
      from: HuobiOrderStatusEnum.FILLED,
    })).to.be.eq(AlunaOrderStatusEnum.FILLED)

    expect(translateOrderStatusToAluna({
      from: HuobiOrderStatusEnum.CANCELED,
    })).to.be.eq(AlunaOrderStatusEnum.CANCELED)

    let result
    let error

    try {

      result = translateOrderStatusToAluna({
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

    expect(translateOrderStatusToHuobi({
      from: AlunaOrderStatusEnum.OPEN,
    })).to.be.eq(HuobiOrderStatusEnum.CREATED)

    expect(translateOrderStatusToHuobi({
      from: AlunaOrderStatusEnum.PARTIALLY_FILLED,
    })).to.be.eq(HuobiOrderStatusEnum.PARTIAL_FILLED)

    expect(translateOrderStatusToHuobi({
      from: AlunaOrderStatusEnum.FILLED,
    })).to.be.eq(HuobiOrderStatusEnum.FILLED)

    expect(translateOrderStatusToHuobi({
      from: AlunaOrderStatusEnum.CANCELED,
    })).to.be.eq(HuobiOrderStatusEnum.CANCELED)

    let result
    let error

    try {

      result = translateOrderStatusToHuobi({
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
