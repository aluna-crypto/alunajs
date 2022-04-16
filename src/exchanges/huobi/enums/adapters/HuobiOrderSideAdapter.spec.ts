import { expect } from 'chai'

import { AlunaError } from '../../../../lib/core/AlunaError'
import { AlunaOrderSideEnum } from '../../../../lib/enums/AlunaOrderSideEnum'
import { HuobiOrderSideEnum } from '../HuobiOrderSideEnum'
import { HuobiOrderSideAdapter } from './HuobiOrderSideAdapter'



describe('HuobiOrderSideAdapter', () => {

  const notSupported = 'not-supported'



  it('should properly translate Huobi order sides to Aluna order sides',
    () => {

      expect(HuobiOrderSideAdapter.translateToAluna({
        from: HuobiOrderSideEnum.BUY,
      })).to.be.eq(AlunaOrderSideEnum.BUY)

      expect(HuobiOrderSideAdapter.translateToAluna({
        from: HuobiOrderSideEnum.SELL,
      })).to.be.eq(AlunaOrderSideEnum.SELL)

      let result
      let error

      try {

        result = HuobiOrderSideAdapter.translateToAluna({
          from: notSupported as HuobiOrderSideEnum,
        })

      } catch (err) {

        error = err

      }

      expect(result).not.to.be.ok

      expect(error instanceof AlunaError).to.be.ok
      expect(error.message)
        .to.be.eq(`Order side not supported: ${notSupported}`)


    })



  it('should properly translate Aluna order sides to Huobi order sides',
    () => {

      expect(HuobiOrderSideAdapter.translateToHuobi({
        from: AlunaOrderSideEnum.BUY,
      })).to.be.eq(HuobiOrderSideEnum.BUY)

      expect(HuobiOrderSideAdapter.translateToHuobi({
        from: AlunaOrderSideEnum.SELL,
      })).to.be.eq(HuobiOrderSideEnum.SELL)

      let result
      let error

      try {

        result = HuobiOrderSideAdapter.translateToHuobi({
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
