import { expect } from 'chai'

import { AlunaError } from '../../../../lib/core/AlunaError'
import { AlunaOrderSideEnum } from '../../../../lib/enums/AlunaOrderSideEnum'
import { BitfinexOrderSideEnum } from '../BitfinexOderSideEnum'
import {
  translateOrderSideToAluna,
  translateOrderSideToBitfinex,
} from './bitfinexOrderSideAdapter'



describe(__filename, () => {

  const notSupported = 'not-supported'



  it(
    'should properly translate Bitfinex order sides to Aluna order sides',
    () => {

      expect(translateOrderSideToAluna({
        from: BitfinexOrderSideEnum.BUY,
      })).to.be.eq(AlunaOrderSideEnum.BUY)

      expect(translateOrderSideToAluna({
        from: BitfinexOrderSideEnum.SELL,
      })).to.be.eq(AlunaOrderSideEnum.SELL)

      let result
      let error

      try {

        result = translateOrderSideToAluna({
          from: notSupported as BitfinexOrderSideEnum,
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
    'should properly translate Aluna order sides to Bitfinex order sides',
    () => {

      expect(translateOrderSideToBitfinex({
        from: AlunaOrderSideEnum.BUY,
      })).to.be.eq(BitfinexOrderSideEnum.BUY)

      expect(translateOrderSideToBitfinex({
        from: AlunaOrderSideEnum.SELL,
      })).to.be.eq(BitfinexOrderSideEnum.SELL)

      let result
      let error

      try {

        result = translateOrderSideToBitfinex({
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
