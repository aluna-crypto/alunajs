import { expect } from 'chai'

import { AlunaError } from '../../../../lib/core/AlunaError'
import { AlunaOrderSideEnum } from '../../../../lib/enums/AlunaOrderSideEnum'
import { BittrexSideEnum } from '../BittrexSideEnum'
import { BittrexOrderSideAdapter } from './BittrexOrderSideAdapter'



describe('BittrexOrderSideAdapter', () => {

  const notSupported = 'not-supported'



  it('should properly translate Bittrex order sides to Aluna order sides',
    () => {

      expect(BittrexOrderSideAdapter.translateToAluna({
        from: BittrexSideEnum.BUY,
      })).to.be.eq(AlunaOrderSideEnum.BUY)

      expect(BittrexOrderSideAdapter.translateToAluna({
        from: BittrexSideEnum.SELL,
      })).to.be.eq(AlunaOrderSideEnum.SELL)

      let result
      let error

      try {

        result = BittrexOrderSideAdapter.translateToAluna({
          from: notSupported as BittrexSideEnum,
        })

      } catch (err) {

        error = err

      }

      expect(result).not.to.be.ok

      expect(error instanceof AlunaError).to.be.ok
      expect(error.message)
        .to.be.eq(`Order side not supported: ${notSupported}`)

    })



  it('should properly translate Aluna order sides to Bittrex order sides',
    () => {

      expect(BittrexOrderSideAdapter.translateToBittrex({
        from: AlunaOrderSideEnum.BUY,
      })).to.be.eq(BittrexSideEnum.BUY)

      expect(BittrexOrderSideAdapter.translateToBittrex({
        from: AlunaOrderSideEnum.SELL,
      })).to.be.eq(BittrexSideEnum.SELL)

      let result
      let error

      try {

        result = BittrexOrderSideAdapter.translateToBittrex({
          from: notSupported as AlunaOrderSideEnum,
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
