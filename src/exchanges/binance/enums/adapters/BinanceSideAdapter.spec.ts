import { expect } from 'chai'

import { AlunaError } from '../../../../lib/core/AlunaError'
import { AlunaSideEnum } from '../../../../lib/enums/AlunaSideEnum'
import { BinanceSideEnum } from '../BinanceSideEnum'
import { BinanceSideAdapter } from './BinanceSideAdapter'



describe('BinanceSideAdapter', () => {

  const notSupported = 'not-supported'



  it('should properly translate Binance order sides to Aluna order sides',
    () => {

      expect(BinanceSideAdapter.translateToAluna({
        from: BinanceSideEnum.BUY,
      })).to.be.eq(AlunaSideEnum.LONG)

      expect(BinanceSideAdapter.translateToAluna({
        from: BinanceSideEnum.SELL,
      })).to.be.eq(AlunaSideEnum.SHORT)

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
        from: AlunaSideEnum.LONG,
      })).to.be.eq(BinanceSideEnum.BUY)

      expect(BinanceSideAdapter.translateToBinance({
        from: AlunaSideEnum.SHORT,
      })).to.be.eq(BinanceSideEnum.SELL)

      let result
      let error

      try {

        result = BinanceSideAdapter.translateToBinance({
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
