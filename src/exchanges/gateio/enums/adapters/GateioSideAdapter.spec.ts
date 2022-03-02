import { expect } from 'chai'

import { AlunaError } from '../../../../lib/core/AlunaError'
import { AlunaSideEnum } from '../../../../lib/enums/AlunaSideEnum'
import { GateioSideEnum } from '../GateioSideEnum'
import { GateioSideAdapter } from './GateioSideAdapter'



describe('GateioSideAdapter', () => {

  const notSupported = 'not-supported'



  it('should properly translate Gateio order sides to Aluna order sides',
    () => {

      expect(GateioSideAdapter.translateToAluna({
        from: GateioSideEnum.BUY,
      })).to.be.eq(AlunaSideEnum.LONG)

      expect(GateioSideAdapter.translateToAluna({
        from: GateioSideEnum.SELL,
      })).to.be.eq(AlunaSideEnum.SHORT)

      let result

      try {

        result = GateioSideAdapter.translateToAluna({
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

      expect(GateioSideAdapter.translateToGateio({
        from: AlunaSideEnum.LONG,
      })).to.be.eq(GateioSideEnum.BUY)

      expect(GateioSideAdapter.translateToGateio({
        from: AlunaSideEnum.SHORT,
      })).to.be.eq(GateioSideEnum.SELL)


      try {

        GateioSideAdapter.translateToGateio({
          from: notSupported as AlunaSideEnum,
        })

      } catch (err) {

        expect(err instanceof AlunaError).to.be.ok
        expect(err.message)
          .to.be.eq(`Order side not supported: ${notSupported}`)

      }

    })

})
