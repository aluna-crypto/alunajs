import { expect } from 'chai'

import { AlunaError } from '../../../../lib/core/AlunaError'
import { AlunaOrderSideEnum } from '../../../../lib/enums/AlunaOrderSideEnum'
import { FtxOrderSideEnum } from '../FtxOrderSideEnum'
import {
  translateOrderSideToAluna,
  translateOrderSideToFtx,
} from './ftxOrderSideAdapter'



describe(__filename, () => {

  const notSupported = 'not-supported'



  it('should properly translate Ftx order sides to Aluna order sides', () => {

    expect(translateOrderSideToAluna({
      from: FtxOrderSideEnum.BUY,
    })).to.be.eq(AlunaOrderSideEnum.BUY)

    expect(translateOrderSideToAluna({
      from: FtxOrderSideEnum.SELL,
    })).to.be.eq(AlunaOrderSideEnum.SELL)

    let result
    let error

    try {

      result = translateOrderSideToAluna({
        from: notSupported as FtxOrderSideEnum,
      })

    } catch (err) {

      error = err

    }

    expect(result).not.to.be.ok

    expect(error instanceof AlunaError).to.be.ok
    expect(error.message)
      .to.be.eq(`Order side not supported: ${notSupported}`)

  })



  it('should properly translate Aluna order sides to Ftx order sides', () => {

    expect(translateOrderSideToFtx({
      from: AlunaOrderSideEnum.BUY,
    })).to.be.eq(FtxOrderSideEnum.BUY)

    expect(translateOrderSideToFtx({
      from: AlunaOrderSideEnum.SELL,
    })).to.be.eq(FtxOrderSideEnum.SELL)

    let result
    let error

    try {

      result = translateOrderSideToFtx({
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
