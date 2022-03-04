import { expect } from 'chai'

import { AlunaError } from '../../../../lib/core/AlunaError'
import { AlunaOrderSideEnum } from '../../../../lib/enums/AlunaOrderSideEnum'
import { BinanceSideEnum } from '../BinanceSideEnum'
import { BinanceSideAdapter } from './BinanceSideAdapter'



describe('BinanceSideAdapter', () => {

  const notSupported = 'not-supported'



  it('should properly translate Binance order sides to Aluna order sides',
    () => {

      expect(BinanceSideAdapter.translateToAluna({
        from: BinanceSideEnum.BUY,
      })).to.be.eq(AlunaOrderSideEnum.BUY)

      expect(BinanceSideAdapter.translateToAluna({
        from: BinanceSideEnum.SELL,
      })).to.be.eq(AlunaOrderSideEnum.SELL)

      let result
      let error

      try {

        result = BinanceSideAdapter.translateToAluna({
          from: notSupported as BinanceSideEnum,
        })

      } catch (err) {

        error = err

      }

      expect(result).not.to.be.ok

      expect(error instanceof AlunaError).to.be.ok
      expect(error.message)
        .to.be.eq(`Order side not supported: ${notSupported}`)


    })



  it('should properly translate Aluna order sides to Binance order sides',
    () => {

      expect(BinanceSideAdapter.translateToBinance({
        from: AlunaOrderSideEnum.BUY,
      })).to.be.eq(BinanceSideEnum.BUY)

      expect(BinanceSideAdapter.translateToBinance({
        from: AlunaOrderSideEnum.SELL,
      })).to.be.eq(BinanceSideEnum.SELL)

      let result
      let error

      try {

        result = BinanceSideAdapter.translateToBinance({
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
