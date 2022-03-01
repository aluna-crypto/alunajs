import { expect } from 'chai'

import { AlunaSideEnum } from '../../../../lib/enums/AlunaSideEnum'
import { BitmexSideEnum } from '../BitmexSideEnum'
import { BitmexSideAdapter } from './BitmexSideAdapter'



describe('BitmexSideAdapter', () => {

  const notSupported = 'not-supported'

  it('should properly translate Bitmex order side to Aluna order sides', () => {

    let error

    expect(BitmexSideAdapter.translateToAluna({
      from: BitmexSideEnum.BUY,
    })).to.be.eq(AlunaSideEnum.LONG)

    expect(BitmexSideAdapter.translateToAluna({
      from: BitmexSideEnum.SELL,
    })).to.be.eq(AlunaSideEnum.SHORT)

    try {

      BitmexSideAdapter.translateToAluna({
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

    expect(BitmexSideAdapter.translateToBitmex({
      from: AlunaSideEnum.LONG,
    })).to.be.eq(BitmexSideEnum.BUY)

    expect(BitmexSideAdapter.translateToBitmex({
      from: AlunaSideEnum.SHORT,
    })).to.be.eq(BitmexSideEnum.SELL)

    try {

      BitmexSideAdapter.translateToBitmex({
        from: notSupported as AlunaSideEnum,
      })

    } catch (err) {

      error = err

    }

    expect(error).to.be.ok

    const { message } = error
    expect(message).to.be.eq(`Side not supported: ${notSupported}`)

  })

})
