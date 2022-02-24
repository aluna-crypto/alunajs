import { expect } from 'chai'

import { AlunaError } from '../../../../lib/core/AlunaError'
import { AlunaSideEnum } from '../../../../lib/enums/AlunaSideEnum'
import { PoloniexPositionSideEnum } from '../PoloniexPositionSideEnum'
import { PoloniexPositionSideAdapter } from './PoloniexPositionSideAdapter'



describe('PoloniexPositionSideAdapter', () => {

  const notSupported = 'not-supported'



  it('should properly translate Poloniex position to Aluna position sides',
    () => {

      expect(PoloniexPositionSideAdapter.translateToAluna({
        from: PoloniexPositionSideEnum.LONG,
      })).to.be.eq(AlunaSideEnum.LONG)

      expect(PoloniexPositionSideAdapter.translateToAluna({
        from: PoloniexPositionSideEnum.SHORT,
      })).to.be.eq(AlunaSideEnum.SHORT)

      let result
      let error

      try {

        result = PoloniexPositionSideAdapter.translateToAluna({
          from: notSupported as PoloniexPositionSideEnum,
        })

      } catch (err) {

        error = err

      }

      expect(result).not.to.be.ok

      expect(error instanceof AlunaError).to.be.ok
      expect(error.message)
        .to.be.eq(`Position side not supported: ${notSupported}`)

    })



  it('should properly translate Aluna position sides to Poloniex position',
    () => {

      expect(PoloniexPositionSideAdapter.translateToPoloniex({
        from: AlunaSideEnum.LONG,
      })).to.be.eq(PoloniexPositionSideEnum.LONG)

      expect(PoloniexPositionSideAdapter.translateToPoloniex({
        from: AlunaSideEnum.SHORT,
      })).to.be.eq(PoloniexPositionSideEnum.SHORT)

      let result
      let error

      try {

        result = PoloniexPositionSideAdapter.translateToPoloniex({
          from: notSupported as AlunaSideEnum,
        })

      } catch (err) {

        error = err

      }

      expect(result).not.to.be.ok
      expect(error instanceof AlunaError).to.be.ok
      expect(error.message)
        .to.be.eq(`Position side not supported: ${notSupported}`)

    })

})
