import { expect } from 'chai'

import { AlunaOrderStatusEnum } from '../../../../lib/enums/AlunaOrderStatusEnum'
import { BitfinexOrderStatusEnum } from '../BitfinexOrderStatusEnum'
import {
  translateOrderStatusToAluna,
  translateOrderStatusToBitfinex,
} from './bitfinexOrderStatusAdapter'



describe(__filename, () => {

  const notSupported = 'not-supported'
  let error: any

  it('should translate Bitfinex order status to Aluna order status', () => {

    expect(translateOrderStatusToAluna({
      from: BitfinexOrderStatusEnum.ACTIVE,
    })).to.be.eq(AlunaOrderStatusEnum.OPEN)

    expect(translateOrderStatusToAluna({
      from: BitfinexOrderStatusEnum.EXECUTED,
    })).to.be.eq(AlunaOrderStatusEnum.FILLED)

    expect(translateOrderStatusToAluna({
      from: 'EXECUTED @ 0.065691(0.0008): was ACTIVE (note:POSCLOSE)',
    })).to.be.eq(AlunaOrderStatusEnum.FILLED)

    expect(translateOrderStatusToAluna({
      from: 'PARTIALLY FILLED',
    })).to.be.eq(AlunaOrderStatusEnum.PARTIALLY_FILLED)

    expect(translateOrderStatusToAluna({
      from: 'PARTIALLY FILLED was ACTIVE (note:POSCLOSE)',
    })).to.be.eq(AlunaOrderStatusEnum.PARTIALLY_FILLED)

    expect(translateOrderStatusToAluna({
      from: 'INSUFFICIENT BALANCE (G1) was: PARTIALLY FILLED @ 0.079206(0.0008',
    })).to.be.eq(AlunaOrderStatusEnum.PARTIALLY_FILLED)

    expect(translateOrderStatusToAluna({
      from: 'CANCELED was: PARTIALLY FILLED @ 0.079206(0.0008',
    })).to.be.eq(AlunaOrderStatusEnum.PARTIALLY_FILLED)

    expect(translateOrderStatusToAluna({
      from: 'CANCELED',
    })).to.be.eq(AlunaOrderStatusEnum.CANCELED)


    try {

      translateOrderStatusToAluna({
        from: notSupported as BitfinexOrderStatusEnum,
      })

    } catch (err) {

      error = err

    }

    expect(error).to.be.ok

    const { message } = error

    expect(message).to.be.eq(`Order status not supported: ${notSupported}`)

  })

  it('should translate Aluna order status to Bitfinex order status', () => {

    let error

    expect(translateOrderStatusToBitfinex({
      from: AlunaOrderStatusEnum.OPEN,
    })).to.be.eq(BitfinexOrderStatusEnum.ACTIVE)

    expect(translateOrderStatusToBitfinex({
      from: AlunaOrderStatusEnum.PARTIALLY_FILLED,
    })).to.be.eq(BitfinexOrderStatusEnum.PARTIALLY_FILLED)

    expect(translateOrderStatusToBitfinex({
      from: AlunaOrderStatusEnum.FILLED,
    })).to.be.eq(BitfinexOrderStatusEnum.EXECUTED)

    expect(translateOrderStatusToBitfinex({
      from: AlunaOrderStatusEnum.CANCELED,
    })).to.be.eq(BitfinexOrderStatusEnum.CANCELED)

    try {

      translateOrderStatusToBitfinex({
        from: notSupported as AlunaOrderStatusEnum,
      })

    } catch (err) {

      error = err

    }

    expect(error).to.be.ok

    const { message } = error
    expect(message).to.be.eq(`Order status not supported: ${notSupported}`)

  })

})
