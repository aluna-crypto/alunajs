import { expect } from 'chai'

import { AlunaError } from '../../../../lib/core/AlunaError'
import { AlunaOrderSideEnum } from '../../../../lib/enums/AlunaOrderSideEnum'
import { GateioSideEnum } from '../GateioSideEnum'
import { GateioOrderSideAdapter } from './GateioOrderSideAdapter'



describe('GateioOrderSideAdapter', () => {

  const notSupported = 'not-supported'



  it('should properly translate Gateio order sides to Aluna order sides',
    () => {

      expect(GateioOrderSideAdapter.translateToAluna({
        from: GateioSideEnum.BUY,
      })).to.be.eq(AlunaOrderSideEnum.BUY)

      expect(GateioOrderSideAdapter.translateToAluna({
        from: GateioSideEnum.SELL,
      })).to.be.eq(AlunaOrderSideEnum.SELL)

      let result

      try {

        result = GateioOrderSideAdapter.translateToAluna({
          from: notSupported as GateioSideEnum,
        })

      } catch (err) {

        expect(result).not.to.be.ok

        expect(err instanceof AlunaError).to.be.ok
        expect(err.message)
          .to.be.eq(`Order side not supported: ${notSupported}`)

      }



    })



  it('should properly translate Aluna order sides to Gateio order sides',
    () => {

      expect(GateioOrderSideAdapter.translateToGateio({
        from: AlunaOrderSideEnum.BUY,
      })).to.be.eq(GateioSideEnum.BUY)

      expect(GateioOrderSideAdapter.translateToGateio({
        from: AlunaOrderSideEnum.SELL,
      })).to.be.eq(GateioSideEnum.SELL)


      try {

        GateioOrderSideAdapter.translateToGateio({
          from: notSupported as AlunaOrderSideEnum,
        })

      } catch (err) {

        expect(err instanceof AlunaError).to.be.ok
        expect(err.message)
          .to.be.eq(`Order side not supported: ${notSupported}`)

      }

    })

})
