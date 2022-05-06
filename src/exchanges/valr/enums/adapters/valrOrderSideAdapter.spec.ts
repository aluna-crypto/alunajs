import { expect } from 'chai'

import { AlunaError } from '../../../../lib/core/AlunaError'
import { AlunaOrderSideEnum } from '../../../../lib/enums/AlunaOrderSideEnum'
import { ValrOrderSideEnum } from '../ValrOrderSideEnum'
import {
  translateOrderSideToAluna,
  translateOrderSideToValr,
} from './valrOrderSideAdapter'



describe(__filename, () => {

  const notSupported = 'not-supported'



  it(
    'should properly translate Valr order sides to Aluna order sides',
    () => {

      expect(translateOrderSideToAluna({
        from: ValrOrderSideEnum.BUY,
      })).to.be.eq(AlunaOrderSideEnum.BUY)

      expect(translateOrderSideToAluna({
        from: ValrOrderSideEnum.SELL,
      })).to.be.eq(AlunaOrderSideEnum.SELL)

      let result
      let error

      try {

        result = translateOrderSideToAluna({
          from: notSupported as ValrOrderSideEnum,
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
    'should properly translate Aluna order sides to Valr order sides',
    () => {

      expect(translateOrderSideToValr({
        from: AlunaOrderSideEnum.BUY,
      })).to.be.eq(ValrOrderSideEnum.BUY)

      expect(translateOrderSideToValr({
        from: AlunaOrderSideEnum.SELL,
      })).to.be.eq(ValrOrderSideEnum.SELL)

      let result
      let error

      try {

        result = translateOrderSideToValr({
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
