import { expect } from 'chai'

import { AlunaError } from '../../../../lib/core/AlunaError'
import { AlunaOrderStatusEnum } from '../../../../lib/enums/AlunaOrderStatusEnum'
import { BitfinexOrderStatusEnum } from '../BitfinexOrderStatusEnum'
import { BitfinexOrderStatusAdapter } from './BitfinexOrderStatusAdapter'



describe('BitfinexOrderStatusAdapter', () => {

  const notSupported = 'not-supported'

  it('should translate Bitfinex order status to Aluna order status', () => {

    expect(BitfinexOrderStatusAdapter.translateToAluna({
      from: 'ACTIVE',
    })).to.be.eq(AlunaOrderStatusEnum.OPEN)

    expect(BitfinexOrderStatusAdapter.translateToAluna({
      from: 'EXECUTED',
    })).to.be.eq(AlunaOrderStatusEnum.FILLED)

    expect(BitfinexOrderStatusAdapter.translateToAluna({
      from: 'EXECUTED @ 0.065691(0.0008): was ACTIVE (note:POSCLOSE)',
    })).to.be.eq(AlunaOrderStatusEnum.FILLED)

    expect(BitfinexOrderStatusAdapter.translateToAluna({
      from: 'PARTIALLY FILLED',
    })).to.be.eq(AlunaOrderStatusEnum.PARTIALLY_FILLED)

    expect(BitfinexOrderStatusAdapter.translateToAluna({
      from: 'PARTIALLY FILLED was ACTIVE (note:POSCLOSE)',
    })).to.be.eq(AlunaOrderStatusEnum.PARTIALLY_FILLED)

    expect(BitfinexOrderStatusAdapter.translateToAluna({
      from: 'INSUFFICIENT BALANCE (G1) was: PARTIALLY FILLED @ 0.079206(0.0008',
    })).to.be.eq(AlunaOrderStatusEnum.PARTIALLY_FILLED)

    expect(BitfinexOrderStatusAdapter.translateToAluna({
      from: 'CANCELED was: PARTIALLY FILLED @ 0.079206(0.0008',
    })).to.be.eq(AlunaOrderStatusEnum.PARTIALLY_FILLED)

    expect(BitfinexOrderStatusAdapter.translateToAluna({
      from: 'CANCELED',
    })).to.be.eq(AlunaOrderStatusEnum.CANCELED)


    try {

      BitfinexOrderStatusAdapter.translateToAluna({
        from: notSupported as BitfinexOrderStatusEnum,
      })

    } catch (err) {

      expect(err instanceof AlunaError).to.be.ok

      const { message } = err as AlunaError
      expect(message).to.be.eq(`Order status not supported: ${notSupported}`)

    }

  })

  it('should translate Aluna order status to Bitfinex order status', () => {

    expect(BitfinexOrderStatusAdapter.translateToBitfinex({
      from: AlunaOrderStatusEnum.OPEN,
    })).to.be.eq(BitfinexOrderStatusEnum.ACTIVE)

    expect(BitfinexOrderStatusAdapter.translateToBitfinex({
      from: AlunaOrderStatusEnum.PARTIALLY_FILLED,
    })).to.be.eq(BitfinexOrderStatusEnum.PARTIALLY_FILLED)

    expect(BitfinexOrderStatusAdapter.translateToBitfinex({
      from: AlunaOrderStatusEnum.FILLED,
    })).to.be.eq(BitfinexOrderStatusEnum.EXECUTED)

    expect(BitfinexOrderStatusAdapter.translateToBitfinex({
      from: AlunaOrderStatusEnum.CANCELED,
    })).to.be.eq(BitfinexOrderStatusEnum.CANCELED)

    try {

      BitfinexOrderStatusAdapter.translateToBitfinex({
        from: notSupported as AlunaOrderStatusEnum,
      })

    } catch (err) {

      expect(err instanceof AlunaError).to.be.ok

      const { message } = err as AlunaError
      expect(message).to.be.eq(`Order status not supported: ${notSupported}`)

    }

  })

})
