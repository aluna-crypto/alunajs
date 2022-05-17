import { expect } from 'chai'

import { AlunaError } from '../../../../lib/core/AlunaError'
import { AlunaOrderStatusEnum } from '../../../../lib/enums/AlunaOrderStatusEnum'
import { PoloniexOrderStatusEnum } from '../PoloniexOrderStatusEnum'
import {
  translateOrderStatusToAluna,
  translateOrderStatusToPoloniex,
  translatePoloniexOrderStatus,
} from './poloniexOrderStatusAdapter'



describe(__filename, () => {

  const notSupported = 'not-supported'


  it('should translate Poloniex status', () => {

    const rawAmount = '0.05'
    const rawPartiallyFilledAmount = '0.04'
    const rawZeroedFilledAmount = '0.05'

    expect(translatePoloniexOrderStatus({
      amount: rawAmount,
      startingAmount: rawPartiallyFilledAmount,
    })).to.be.eq(PoloniexOrderStatusEnum.PARTIALLY_FILLED)

    expect(translatePoloniexOrderStatus({
      amount: rawAmount,
      startingAmount: rawPartiallyFilledAmount,
      status: PoloniexOrderStatusEnum.FILLED,
    })).to.be.eq(PoloniexOrderStatusEnum.FILLED)

    expect(translatePoloniexOrderStatus({
      amount: rawAmount,
      startingAmount: rawZeroedFilledAmount,
    })).to.be.eq(PoloniexOrderStatusEnum.OPEN)

  })


  it('should translate Poloniex order status to Aluna order status', () => {

    expect(translateOrderStatusToAluna({
      from: PoloniexOrderStatusEnum.OPEN,
    })).to.be.eq(AlunaOrderStatusEnum.OPEN)

    expect(translateOrderStatusToAluna({
      from: PoloniexOrderStatusEnum.PARTIALLY_FILLED,
    })).to.be.eq(AlunaOrderStatusEnum.PARTIALLY_FILLED)

    expect(translateOrderStatusToAluna({
      from: PoloniexOrderStatusEnum.CANCELED,
    })).to.be.eq(AlunaOrderStatusEnum.CANCELED)

    let result
    let error

    try {

      result = translateOrderStatusToAluna({
        from: notSupported as PoloniexOrderStatusEnum,
      })

    } catch (err) {

      error = err

    }

    expect(result).not.to.be.ok
    expect(error instanceof AlunaError).to.be.ok
    expect(error.message)
      .to.be.eq(`Order status not supported: ${notSupported}`)

  })



  it('should translate Aluna order status to Poloniex order status', () => {

    expect(translateOrderStatusToPoloniex({
      from: AlunaOrderStatusEnum.OPEN,
    })).to.be.eq(PoloniexOrderStatusEnum.OPEN)

    expect(translateOrderStatusToPoloniex({
      from: AlunaOrderStatusEnum.PARTIALLY_FILLED,
    })).to.be.eq(PoloniexOrderStatusEnum.PARTIALLY_FILLED)

    expect(translateOrderStatusToPoloniex({
      from: AlunaOrderStatusEnum.CANCELED,
    })).to.be.eq(PoloniexOrderStatusEnum.CANCELED)

    expect(translateOrderStatusToPoloniex({
      from: AlunaOrderStatusEnum.FILLED,
    })).to.be.eq(PoloniexOrderStatusEnum.FILLED)

    let result
    let error

    try {

      result = translateOrderStatusToPoloniex({
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
