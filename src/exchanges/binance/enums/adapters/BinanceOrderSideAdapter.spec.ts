import { expect } from 'chai'

import { AlunaError } from '../../../../lib/core/AlunaError'
import { AlunaOrderSideEnum } from '../../../../lib/enums/AlunaOrderSideEnum'
import { BinanceSideEnum } from '../BinanceSideEnum'
import { BinanceOrderSideAdapter } from './BinanceOrderSideAdapter'



describe('BinanceOrderSideAdapter', () => {

  const notSupported = 'not-supported'



  it('should properly translate Binance order sides to Aluna order sides',
    () => {

      expect(BinanceOrderSideAdapter.translateToAluna({
        from: BinanceSideEnum.BUY,
      })).to.be.eq(AlunaOrderSideEnum.BUY)

      expect(BinanceOrderSideAdapter.translateToAluna({
        from: BinanceSideEnum.SELL,
      })).to.be.eq(AlunaOrderSideEnum.SELL)

      let result
      let error

      try {

        result = BinanceOrderSideAdapter.translateToAluna({
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

      expect(BinanceOrderSideAdapter.translateToBinance({
        from: AlunaOrderSideEnum.BUY,
      })).to.be.eq(BinanceSideEnum.BUY)

      expect(BinanceOrderSideAdapter.translateToBinance({
        from: AlunaOrderSideEnum.SELL,
      })).to.be.eq(BinanceSideEnum.SELL)

      let result
      let error

      try {

        result = BinanceOrderSideAdapter.translateToBinance({
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
