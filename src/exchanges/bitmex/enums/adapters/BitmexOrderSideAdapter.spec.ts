import { expect } from 'chai'

import { AlunaOrderSideEnum } from '../../../../lib/enums/AlunaOrderSideEnum'
import { BitmexSideEnum } from '../BitmexSideEnum'
import { BitmexOrderSideAdapter } from './BitmexOrderSideAdapter'



describe('BitmexOrderSideAdapter', () => {

  const notSupported = 'not-supported'

  it('should properly translate Bitmex order side to Aluna order sides', () => {

    let error

    expect(BitmexOrderSideAdapter.translateToAluna({
      from: BitmexSideEnum.BUY,
    })).to.be.eq(AlunaOrderSideEnum.BUY)

    expect(BitmexOrderSideAdapter.translateToAluna({
      from: BitmexSideEnum.SELL,
    })).to.be.eq(AlunaOrderSideEnum.SELL)

    try {

      BitmexOrderSideAdapter.translateToAluna({
        from: notSupported as BitmexSideEnum,
      })

    } catch (err) {

      error = err

    }

    expect(error).to.be.ok

    const { message } = error
    expect(message).to.be.eq(`Side not supported: ${notSupported}`)

  })

  it('should properly translate Aluna order side to Bitmex order side', () => {

    let error

    expect(BitmexOrderSideAdapter.translateToBitmex({
      from: AlunaOrderSideEnum.BUY,
    })).to.be.eq(BitmexSideEnum.BUY)

    expect(BitmexOrderSideAdapter.translateToBitmex({
      from: AlunaOrderSideEnum.SELL,
    })).to.be.eq(BitmexSideEnum.SELL)

    try {

      BitmexOrderSideAdapter.translateToBitmex({
        from: notSupported as AlunaOrderSideEnum,
      })

    } catch (err) {

      error = err

    }

    expect(error).to.be.ok

    const { message } = error
    expect(message).to.be.eq(`Side not supported: ${notSupported}`)

  })

})
