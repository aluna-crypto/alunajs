import { expect } from 'chai'

import { AlunaError } from '../../../../lib/core/AlunaError'
import { AlunaOrderStatusEnum } from '../../../../lib/enums/AlunaOrderStatusEnum'
import { OkxOrderStatusEnum } from '../OkxOrderStatusEnum'
import {
  translateOrderStatusToAluna,
  translateOrderStatusToOkx,
} from './okxOrderStatusAdapter'



describe(__filename, () => {

  const notSupported = 'not-supported'


  it('should translate Okx order status to Aluna order status', () => {

    expect(translateOrderStatusToAluna({
      from: OkxOrderStatusEnum.LIVE,
    })).to.be.eq(AlunaOrderStatusEnum.OPEN)

    expect(translateOrderStatusToAluna({
      from: OkxOrderStatusEnum.PARTIALLY_FILLED,
    })).to.be.eq(AlunaOrderStatusEnum.PARTIALLY_FILLED)

    expect(translateOrderStatusToAluna({
      from: OkxOrderStatusEnum.FILLED,
    })).to.be.eq(AlunaOrderStatusEnum.FILLED)

    expect(translateOrderStatusToAluna({
      from: OkxOrderStatusEnum.CANCELED,
    })).to.be.eq(AlunaOrderStatusEnum.CANCELED)

    let result
    let error

    try {

      result = translateOrderStatusToAluna({
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

    expect(translateOrderStatusToOkx({
      from: AlunaOrderStatusEnum.OPEN,
    })).to.be.eq(OkxOrderStatusEnum.LIVE)

    expect(translateOrderStatusToOkx({
      from: AlunaOrderStatusEnum.PARTIALLY_FILLED,
    })).to.be.eq(OkxOrderStatusEnum.PARTIALLY_FILLED)

    expect(translateOrderStatusToOkx({
      from: AlunaOrderStatusEnum.FILLED,
    })).to.be.eq(OkxOrderStatusEnum.FILLED)

    expect(translateOrderStatusToOkx({
      from: AlunaOrderStatusEnum.CANCELED,
    })).to.be.eq(OkxOrderStatusEnum.CANCELED)

    let result
    let error

    try {

      result = translateOrderStatusToOkx({
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
