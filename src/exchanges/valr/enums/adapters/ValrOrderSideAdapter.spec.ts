import { expect } from 'chai'

import { AlunaOrderSideEnum } from '../../../../lib/enums/AlunaOrderSideEnum'
import { ValrSideEnum } from '../ValrSideEnum'
import { ValrOrderSideAdapter } from './ValrOrderSideAdapter'



describe('ValrOrderSideAdapter', () => {

  const notSupported = 'not-supported'

  it('should properly translate Valr order sides to Aluna order sides', () => {

    let error

    expect(ValrOrderSideAdapter.translateToAluna({
      from: ValrSideEnum.BUY,
    })).to.be.eq(AlunaOrderSideEnum.BUY)

    expect(ValrOrderSideAdapter.translateToAluna({
      from: ValrSideEnum.SELL,
    })).to.be.eq(AlunaOrderSideEnum.SELL)

    try {

      ValrOrderSideAdapter.translateToAluna({
        from: notSupported as ValrSideEnum,
      })

    } catch (err) {

      error = err

    }

    expect(error).to.be.ok

    const { message } = error
    expect(message).to.be.eq(`Order side not supported: ${notSupported}`)

  })

  it('should properly translate Aluna order sides to Valr order sides', () => {

    let error

    expect(ValrOrderSideAdapter.translateToValr({
      from: AlunaOrderSideEnum.BUY,
    })).to.be.eq(ValrSideEnum.BUY)

    expect(ValrOrderSideAdapter.translateToValr({
      from: AlunaOrderSideEnum.SELL,
    })).to.be.eq(ValrSideEnum.SELL)

    try {

      ValrOrderSideAdapter.translateToValr({
        from: notSupported as AlunaOrderSideEnum,
      })

    } catch (err) {

      error = err

    }

    expect(error).to.be.ok

    const { message } = error
    expect(message).to.be.eq(`Order side not supported: ${notSupported}`)

  })

})
