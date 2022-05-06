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


  it('should translate Gate order status to Aluna order status',
    () => {

      const quantity = '5'
      const zeroedfillQty = '0'
      const partiallyFillQty = '3'
      const totalFillQty = '5'

      expect(translateOrderStatusToAluna({
        fillQuantity: zeroedfillQty,
        quantity,
        from: GateOrderStatusEnum.CLOSED,
      })).to.be.eq(AlunaOrderStatusEnum.CANCELED)

      expect(translateOrderStatusToAluna({
        fillQuantity: partiallyFillQty,
        quantity,
        from: GateOrderStatusEnum.CLOSED,
      })).to.be.eq(AlunaOrderStatusEnum.PARTIALLY_FILLED)

      expect(translateOrderStatusToAluna({
        fillQuantity: totalFillQty,
        quantity,
        from: GateOrderStatusEnum.CLOSED,
      })).to.be.eq(AlunaOrderStatusEnum.FILLED)

      expect(translateOrderStatusToAluna({
        fillQuantity: totalFillQty,
        quantity,
        from: GateOrderStatusEnum.OPEN,
      })).to.be.eq(AlunaOrderStatusEnum.OPEN)

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
    })).to.be.eq(GateOrderStatusEnum.CLOSED)

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
