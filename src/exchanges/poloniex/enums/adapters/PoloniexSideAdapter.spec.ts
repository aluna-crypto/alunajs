import { expect } from 'chai'

import { AlunaError } from '../../../../lib/core/AlunaError'
import { AlunaSideEnum } from '../../../../lib/enums/AlunaSideEnum'
import { PoloniexOrderTypeEnum } from '../PoloniexOrderTypeEnum'
import { PoloniexSideAdapter } from './PoloniexSideAdapter'



describe('PoloniexSideAdapter', () => {

  const notSupported = 'not-supported'



  it('should properly translate Poloniex order sides to Aluna order sides',
    () => {

      expect(PoloniexSideAdapter.translateToAluna({
        from: PoloniexOrderTypeEnum.BUY,
      })).to.be.eq(AlunaSideEnum.LONG)

      expect(PoloniexSideAdapter.translateToAluna({
        from: PoloniexOrderTypeEnum.SELL,
      })).to.be.eq(AlunaSideEnum.SHORT)

      let result
      let error

      try {

        result = PoloniexSideAdapter.translateToAluna({
          from: notSupported as PoloniexOrderTypeEnum,
        })

      } catch (err) {

        error = err

      }

      expect(result).not.to.be.ok

      expect(error instanceof AlunaError).to.be.ok
      expect(error.message)
        .to.be.eq(`Order side not supported: ${notSupported}`)

    })



  it('should properly translate Aluna order sides to Poloniex order sides',
    () => {

      expect(PoloniexSideAdapter.translateToPoloniex({
        from: AlunaSideEnum.LONG,
      })).to.be.eq(PoloniexOrderTypeEnum.BUY)

      expect(PoloniexSideAdapter.translateToPoloniex({
        from: AlunaSideEnum.SHORT,
      })).to.be.eq(PoloniexOrderTypeEnum.SELL)

      let result
      let error

      try {

        result = PoloniexSideAdapter.translateToPoloniex({
          from: notSupported as AlunaSideEnum,
        })

      } catch (err) {

        error = err

      }

      expect(result).not.to.be.ok
      expect(error instanceof AlunaError).to.be.ok
      expect(error.message)
        .to.be.eq(`Order side not supported: ${notSupported}`)

    })

})
