import { expect } from 'chai'

import { AlunaPositionSideEnum } from '../../../../lib/enums/AlunaPositionSideEnum'
import { BitmexSideEnum } from '../BitmexSideEnum'
import { BitmexPositionSideAdapter } from './BitmexPositionSideAdapter'



describe('BitmexPositionSideAdapter', () => {

  const notSupported = 'not-supported'

  it(
    'should properly translate Bitmex position side to Aluna position sides',
    () => {

      expect(BitmexPositionSideAdapter.translateToAluna({
        homeNotional: 1,
      })).to.be.eq(AlunaPositionSideEnum.LONG)

      expect(BitmexPositionSideAdapter.translateToAluna({
        homeNotional: -0.23,
      })).to.be.eq(AlunaPositionSideEnum.SHORT)

    },
  )

  it(
    'should properly translate Aluna position side to Bitmex position side',
    () => {

      let error

      expect(BitmexPositionSideAdapter.translateToBitmex({
        from: AlunaPositionSideEnum.LONG,
      })).to.be.eq(BitmexSideEnum.BUY)

      expect(BitmexPositionSideAdapter.translateToBitmex({
        from: AlunaPositionSideEnum.SHORT,
      })).to.be.eq(BitmexSideEnum.SELL)

      try {

        BitmexPositionSideAdapter.translateToBitmex({
          from: notSupported as AlunaPositionSideEnum,
        })

      } catch (err) {

        error = err

      }

      expect(error).to.be.ok

      const { message } = error
      expect(message).to.be.eq(`Side not supported: ${notSupported}`)

    },
  )

})
