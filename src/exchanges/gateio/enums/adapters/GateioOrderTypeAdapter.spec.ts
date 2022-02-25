import { expect } from 'chai'

import { AlunaError } from '../../../../lib/core/AlunaError'
import { AlunaOrderTypesEnum } from '../../../../lib/enums/AlunaOrderTypesEnum'
import { GateioOrderTypeEnum } from '../GateioOrderTypeEnum'
import { GateioOrderTypeAdapter } from './GateioOrderTypeAdapter'



describe('GateioOrderTypeAdapter', () => {

  const notSupported = 'not-supported'



  it('should properly translate Gateio order types to Aluna order types',
    () => {

      expect(GateioOrderTypeAdapter.translateToAluna({
        from: GateioOrderTypeEnum.LIMIT,
      })).to.be.eq(AlunaOrderTypesEnum.LIMIT)

      try {

        GateioOrderTypeAdapter.translateToAluna({
          from: notSupported as GateioOrderTypeEnum,
        })

      } catch (err) {

        expect(err instanceof AlunaError).to.be.ok
        expect(err.message)
          .to.be.eq(`Order type not supported: ${notSupported}`)

      }


    })



  it('should properly translate Aluna order types to Gateio order types',
    () => {

      expect(GateioOrderTypeAdapter.translateToGateio({
        from: AlunaOrderTypesEnum.LIMIT,
      })).to.be.eq(GateioOrderTypeEnum.LIMIT)

      try {

        GateioOrderTypeAdapter.translateToGateio({
          from: notSupported as AlunaOrderTypesEnum,
        })

      } catch (err) {

        expect(err instanceof AlunaError).to.be.ok
        expect(err.message)
          .to.be.eq(`Order type not supported: ${notSupported}`)

      }

    })

})
