import { expect } from 'chai'

import { AlunaError } from '../../../../lib/core/AlunaError'
import { AlunaOrderSideEnum } from '../../../../lib/enums/AlunaOrderSideEnum'
import { OkxOrderSideEnum } from '../OkxOrderSideEnum'
import {
  translateOrderSideToAluna,
  translateOrderSideToOkx,
} from './okxOrderSideAdapter'



describe(__filename, () => {

  const notSupported = 'not-supported'



  it('should properly translate Okx order sides to Aluna order sides', () => {

    expect(translateOrderSideToAluna({
      from: OkxOrderSideEnum.BUY,
    })).to.be.eq(AlunaOrderSideEnum.BUY)

    expect(translateOrderSideToAluna({
      from: OkxOrderSideEnum.SELL,
    })).to.be.eq(AlunaOrderSideEnum.SELL)

    let result
    let error

    try {

      result = translateOrderSideToAluna({
        from: notSupported as OkxOrderSideEnum,
      })

    } catch (err) {

      error = err

    }

    expect(result).not.to.be.ok

    expect(error instanceof AlunaError).to.be.ok
    expect(error.message)
      .to.be.eq(`Order side not supported: ${notSupported}`)

  })



  it('should properly translate Aluna order sides to Okx order sides', () => {

    expect(translateOrderSideToOkx({
      from: AlunaOrderSideEnum.BUY,
    })).to.be.eq(OkxOrderSideEnum.BUY)

    expect(translateOrderSideToOkx({
      from: AlunaOrderSideEnum.SELL,
    })).to.be.eq(OkxOrderSideEnum.SELL)

    let result
    let error

    try {

      result = translateOrderSideToOkx({
        from: notSupported as AlunaOrderSideEnum,
      })

    } catch (err) {

      error = err

    }

    expect(result).not.to.be.ok
    expect(error instanceof AlunaError).to.be.ok
    expect(error.message)
      .to.be.eq(`Order side not supported: ${notSupported}`)

  })

})
