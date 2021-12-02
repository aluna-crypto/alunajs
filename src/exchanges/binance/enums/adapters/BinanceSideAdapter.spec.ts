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

      let error
      let result

      try {

        result = BinanceSideAdapter.translateToAluna({
          from: notSupported as BinanceSideEnum,
        })

      } catch (err) {

        // TODO: review and fix all occurrencies of try catch
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


      try {

        BinanceSideAdapter.translateToBinance({
          from: notSupported as AlunaSideEnum,
        })

      } catch (err) {

        expect(err instanceof AlunaError).to.be.ok
        expect(err.message)
          .to.be.eq(`Order side not supported: ${notSupported}`)

      }

    })

})
