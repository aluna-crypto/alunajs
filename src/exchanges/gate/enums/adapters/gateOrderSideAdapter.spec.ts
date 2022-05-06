import { expect } from 'chai'

import { AlunaError } from '../../../../lib/core/AlunaError'
import { AlunaOrderSideEnum } from '../../../../lib/enums/AlunaOrderSideEnum'
import { GateOrderSideEnum } from '../GateOrderSideEnum'
import {
  translateOrderSideToAluna,
  translateOrderSideToGate,
} from './gateOrderSideAdapter'



describe(__filename, () => {

  const notSupported = 'not-supported'



  it(
    'should properly translate Gate order sides to Aluna order sides',
    () => {

      expect(translateOrderSideToAluna({
        from: GateOrderSideEnum.BUY,
      })).to.be.eq(AlunaOrderSideEnum.BUY)

      expect(translateOrderSideToAluna({
        from: GateOrderSideEnum.SELL,
      })).to.be.eq(AlunaOrderSideEnum.SELL)

      let result
      let error

      try {

        result = translateOrderSideToAluna({
          from: notSupported as GateOrderSideEnum,
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
    'should properly translate Aluna order sides to Gate order sides',
    () => {

      expect(translateOrderSideToGate({
        from: AlunaOrderSideEnum.BUY,
      })).to.be.eq(GateOrderSideEnum.BUY)

      expect(translateOrderSideToGate({
        from: AlunaOrderSideEnum.SELL,
      })).to.be.eq(GateOrderSideEnum.SELL)

      let result
      let error

      try {

        result = translateOrderSideToGate({
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
