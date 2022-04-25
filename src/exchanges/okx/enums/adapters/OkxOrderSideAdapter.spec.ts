import { expect } from 'chai'

import { AlunaError } from '../../../../lib/core/AlunaError'
import { AlunaOrderSideEnum } from '../../../../lib/enums/AlunaOrderSideEnum'
import { OkxSideEnum } from '../OkxSideEnum'
import { OkxOrderSideAdapter } from './OkxOrderSideAdapter'



describe('OkxOrderSideAdapter', () => {

  const notSupported = 'not-supported'



  it('should properly translate Okx order sides to Aluna order sides',
    () => {

      expect(OkxOrderSideAdapter.translateToAluna({
        from: OkxSideEnum.LONG,
      })).to.be.eq(AlunaOrderSideEnum.BUY)

      expect(OkxOrderSideAdapter.translateToAluna({
        from: OkxSideEnum.SHORT,
      })).to.be.eq(AlunaOrderSideEnum.SELL)

      let result
      let error

      try {

        result = OkxOrderSideAdapter.translateToAluna({
          from: notSupported as OkxSideEnum,
        })

      } catch (err) {

        error = err

      }

      expect(result).not.to.be.ok

      expect(error instanceof AlunaError).to.be.ok
      expect(error.message)
        .to.be.eq(`Order side not supported: ${notSupported}`)


    })



  it('should properly translate Aluna order sides to Okx order sides',
    () => {

      expect(OkxOrderSideAdapter.translateToOkx({
        from: AlunaOrderSideEnum.BUY,
      })).to.be.eq(OkxSideEnum.LONG)

      expect(OkxOrderSideAdapter.translateToOkx({
        from: AlunaOrderSideEnum.SELL,
      })).to.be.eq(OkxSideEnum.SHORT)

      let result
      let error

      try {

        result = OkxOrderSideAdapter.translateToOkx({
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
