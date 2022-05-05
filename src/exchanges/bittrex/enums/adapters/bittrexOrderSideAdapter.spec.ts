import { expect } from 'chai'

import { AlunaError } from '../../../../lib/core/AlunaError'
import { AlunaOrderSideEnum } from '../../../../lib/enums/AlunaOrderSideEnum'
import { BittrexOrderSideEnum } from '../BittrexOrderSideEnum'
import {
  translateOrderSideToAluna,
  translateOrderSideToBittrex,
} from './bittrexOrderSideAdapter'



describe(__filename, () => {

  const notSupported = 'not-supported'



  it(
    'should properly translate Bittrex order sides to Aluna order sides',
    () => {

      expect(translateOrderSideToAluna({
        from: BittrexOrderSideEnum.BUY,
      })).to.be.eq(AlunaOrderSideEnum.BUY)

      expect(translateOrderSideToAluna({
        from: BittrexOrderSideEnum.SELL,
      })).to.be.eq(AlunaOrderSideEnum.SELL)

      let result
      let error

      try {

        result = translateOrderSideToAluna({
          from: notSupported as BittrexOrderSideEnum,
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
    'should properly translate Aluna order sides to Bittrex order sides',
    () => {

      expect(translateOrderSideToBittrex({
        from: AlunaOrderSideEnum.BUY,
      })).to.be.eq(BittrexOrderSideEnum.BUY)

      expect(translateOrderSideToBittrex({
        from: AlunaOrderSideEnum.SELL,
      })).to.be.eq(BittrexOrderSideEnum.SELL)

      let result
      let error

      try {

        result = translateOrderSideToBittrex({
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
