import { expect } from 'chai'

import { AlunaError } from '../../../../lib/core/AlunaError'
import { AlunaOrderStatusEnum } from '../../../../lib/enums/AlunaOrderStatusEnum'
import { GateioOrderStatusEnum } from '../GateioOrderStatusEnum'
import { GateioStatusAdapter } from './GateioStatusAdapter'



describe('GateioStatusAdapter', () => {

  const notSupported = 'not-supported'



  it('should translate Gateio order status to Aluna order status',
    () => {

      const zeroedLeftToFill = 0
      const leftToFill = 2
      const totalLeftToFillAmount = 2
      const additionalAmount = 3

      expect(GateioStatusAdapter.translateToAluna({
        from: GateioOrderStatusEnum.OPEN,
        leftToFill,
        amount: additionalAmount,
      })).to.be.eq(AlunaOrderStatusEnum.PARTIALLY_FILLED)

      expect(GateioStatusAdapter.translateToAluna({
        from: GateioOrderStatusEnum.OPEN,
        leftToFill: zeroedLeftToFill,
        amount: totalLeftToFillAmount,
      })).to.be.eq(AlunaOrderStatusEnum.OPEN)

      expect(GateioStatusAdapter.translateToAluna({
        from: GateioOrderStatusEnum.CLOSED,
        leftToFill: zeroedLeftToFill,
        amount: totalLeftToFillAmount,
      })).to.be.eq(AlunaOrderStatusEnum.FILLED)

      expect(GateioStatusAdapter.translateToAluna({
        from: GateioOrderStatusEnum.CANCELLED,
        leftToFill: zeroedLeftToFill,
        amount: totalLeftToFillAmount,
      })).to.be.eq(AlunaOrderStatusEnum.CANCELED)

      try {

        GateioStatusAdapter.translateToAluna({
          from: notSupported as GateioOrderStatusEnum,
          leftToFill: zeroedLeftToFill,
          amount: totalLeftToFillAmount,
        })

      } catch (err) {

        expect(err instanceof AlunaError).to.be.ok
        expect(err.message)
          .to.be.eq(`Order status not supported: ${notSupported}`)

      }


    })



  it('should translate Aluna order status to Gateio order status', () => {

    expect(GateioStatusAdapter.translateToGateio({
      from: AlunaOrderStatusEnum.OPEN,
    })).to.be.eq(GateioOrderStatusEnum.OPEN)

    expect(GateioStatusAdapter.translateToGateio({
      from: AlunaOrderStatusEnum.PARTIALLY_FILLED,
    })).to.be.eq(GateioOrderStatusEnum.OPEN)

    expect(GateioStatusAdapter.translateToGateio({
      from: AlunaOrderStatusEnum.FILLED,
    })).to.be.eq(GateioOrderStatusEnum.CLOSED)

    expect(GateioStatusAdapter.translateToGateio({
      from: AlunaOrderStatusEnum.CANCELED,
    })).to.be.eq(GateioOrderStatusEnum.CANCELLED)


    try {

      GateioStatusAdapter.translateToGateio({
        from: notSupported as AlunaOrderStatusEnum,
      })

    } catch (err) {

      expect(err instanceof AlunaError).to.be.ok
      expect(err.message)
        .to.be.eq(`Order status not supported: ${notSupported}`)

    }

  })

})
