import { expect } from 'chai'

import { AlunaError } from '../../../../lib/core/AlunaError'
import { AlunaSideEnum } from '../../../../lib/enums/AlunaSideEnum'
import { BittrexSideEnum } from '../BittrexSideEnum'
import { BittrexSideAdapter } from './BittrexSideAdapter'



describe('BittrexSideAdapter', () => {

  const notSupported = 'not-supported'



  it('should properly translate Bittrex order sides to Aluna order sides',
    () => {

      expect(BittrexSideAdapter.translateToAluna({
        from: BittrexSideEnum.BUY,
      })).to.be.eq(AlunaSideEnum.LONG)

      expect(BittrexSideAdapter.translateToAluna({
        from: BittrexSideEnum.SELL,
      })).to.be.eq(AlunaSideEnum.SHORT)

      let result

      try {

        result = BittrexSideAdapter.translateToAluna({
          from: notSupported as BittrexSideEnum,
        })

      } catch (err) {

        expect(result).not.to.be.ok

        expect(err instanceof AlunaError).to.be.ok
        expect(err.message)
          .to.be.eq(`Order side not supported: ${notSupported}`)

      }



    })



  it('should properly translate Aluna order sides to Bittrex order sides',
    () => {

      expect(BittrexSideAdapter.translateToBittrex({
        from: AlunaSideEnum.LONG,
      })).to.be.eq(BittrexSideEnum.BUY)

      expect(BittrexSideAdapter.translateToBittrex({
        from: AlunaSideEnum.SHORT,
      })).to.be.eq(BittrexSideEnum.SELL)


      try {

        BittrexSideAdapter.translateToBittrex({
          from: notSupported as AlunaSideEnum,
        })

      } catch (err) {

        expect(err instanceof AlunaError).to.be.ok
        expect(err.message)
          .to.be.eq(`Order side not supported: ${notSupported}`)

      }

    })

})
