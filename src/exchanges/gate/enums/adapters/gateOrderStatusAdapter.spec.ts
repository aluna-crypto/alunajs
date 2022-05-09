import { expect } from 'chai'

import { AlunaError } from '../../../../lib/core/AlunaError'
import { AlunaOrderStatusEnum } from '../../../../lib/enums/AlunaOrderStatusEnum'
import { GateOrderStatusEnum } from '../GateOrderStatusEnum'
import {
  translateOrderStatusToAluna,
  translateOrderStatusToGate,
} from './gateOrderStatusAdapter'



describe(__filename, () => {

  const notSupported = 'not-supported'


  it('should translate Gate order status to Aluna order status', () => {


    const zeroedLeftToFill = 0
    const leftToFill = 2
    const totalLeftToFillAmount = 2
    const additionalAmount = 3

    expect(translateOrderStatusToAluna({
      from: GateOrderStatusEnum.OPEN,
      leftToFill,
      amount: additionalAmount,
    })).to.be.eq(AlunaOrderStatusEnum.PARTIALLY_FILLED)

    expect(translateOrderStatusToAluna({
      from: GateOrderStatusEnum.OPEN,
      leftToFill: zeroedLeftToFill,
      amount: totalLeftToFillAmount,
    })).to.be.eq(AlunaOrderStatusEnum.OPEN)

    expect(translateOrderStatusToAluna({
      from: GateOrderStatusEnum.CLOSED,
      leftToFill: zeroedLeftToFill,
      amount: totalLeftToFillAmount,
    })).to.be.eq(AlunaOrderStatusEnum.FILLED)

    expect(translateOrderStatusToAluna({
      from: GateOrderStatusEnum.CANCELLED,
      leftToFill: zeroedLeftToFill,
      amount: totalLeftToFillAmount,
    })).to.be.eq(AlunaOrderStatusEnum.CANCELED)

    try {

      translateOrderStatusToAluna({
        from: notSupported as GateOrderStatusEnum,
        leftToFill: zeroedLeftToFill,
        amount: totalLeftToFillAmount,
      })

    } catch (err) {

      expect(err instanceof AlunaError).to.be.ok
      expect(err.message)
        .to.be.eq(`Order status not supported: ${notSupported}`)

    }

  })



  it('should translate Aluna order status to Gate order status', () => {

    expect(translateOrderStatusToGate({
      from: AlunaOrderStatusEnum.OPEN,
    })).to.be.eq(GateOrderStatusEnum.OPEN)

    expect(translateOrderStatusToGate({
      from: AlunaOrderStatusEnum.PARTIALLY_FILLED,
    })).to.be.eq(GateOrderStatusEnum.OPEN)

    expect(translateOrderStatusToGate({
      from: AlunaOrderStatusEnum.FILLED,
    })).to.be.eq(GateOrderStatusEnum.CLOSED)

    expect(translateOrderStatusToGate({
      from: AlunaOrderStatusEnum.CANCELED,
    })).to.be.eq(GateOrderStatusEnum.CANCELLED)

    let result
    let error

    try {

      result = translateOrderStatusToGate({
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
