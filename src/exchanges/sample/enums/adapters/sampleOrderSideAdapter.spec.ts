import { expect } from 'chai'

import { AlunaError } from '../../../../lib/core/AlunaError'
import { AlunaOrderSideEnum } from '../../../../lib/enums/AlunaOrderSideEnum'
import { SampleOrderSideEnum } from '../SampleOderSideEnum'
import {
  translateOrderSideToAluna,
  translateOrderSideToSample,
} from './sampleOrderSideAdapter'



describe(__filename, () => {

  const notSupported = 'not-supported'



  it(
    'should properly translate Sample order sides to Aluna order sides',
    () => {

      expect(translateOrderSideToAluna({
        from: SampleOrderSideEnum.BUY,
      })).to.be.eq(AlunaOrderSideEnum.BUY)

      expect(translateOrderSideToAluna({
        from: SampleOrderSideEnum.SELL,
      })).to.be.eq(AlunaOrderSideEnum.SELL)

      let result
      let error

      try {

        result = translateOrderSideToAluna({
          from: notSupported as SampleOrderSideEnum,
        })

      } catch (err) {

        error = err

      }

      expect(result).not.to.be.ok

      expect(error instanceof AlunaError).to.be.ok
      expect(error.message)
        .to.be.eq(`Order side not supported: ${notSupported}`)

    },
  )



  it(
    'should properly translate Aluna order sides to Sample order sides',
    () => {

      expect(translateOrderSideToSample({
        from: AlunaOrderSideEnum.BUY,
      })).to.be.eq(SampleOrderSideEnum.BUY)

      expect(translateOrderSideToSample({
        from: AlunaOrderSideEnum.SELL,
      })).to.be.eq(SampleOrderSideEnum.SELL)

      let result
      let error

      try {

        result = translateOrderSideToSample({
          from: notSupported as AlunaOrderSideEnum,
        })

      } catch (err) {

        error = err

      }

      expect(result).not.to.be.ok
      expect(error instanceof AlunaError).to.be.ok
      expect(error.message)
        .to.be.eq(`Order side not supported: ${notSupported}`)

    },
  )

})
