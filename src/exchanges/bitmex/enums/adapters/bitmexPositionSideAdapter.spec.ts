import { expect } from 'chai'

import { AlunaPositionSideEnum } from '../../../../lib/enums/AlunaPositionSideEnum'
import { BitmexOrderSideEnum } from '../BitmexOrderSideEnum'
import {
  translatePositionSideToAluna,
  translatePositionSideToBitmex,
} from './bitmexPositionSideAdapter'



describe(__filename, () => {

  const notSupported = 'not-supported'

  it(
    'should properly translate Bitmex position side to Aluna position sides',
    () => {

      expect(translatePositionSideToAluna({
        homeNotional: 1,
      })).to.be.eq(AlunaPositionSideEnum.LONG)

      expect(translatePositionSideToAluna({
        homeNotional: -0.23,
      })).to.be.eq(AlunaPositionSideEnum.SHORT)

    },
  )

  it(
    'should properly translate Aluna position side to Bitmex position side',
    () => {

      let error

      expect(translatePositionSideToBitmex({
        from: AlunaPositionSideEnum.LONG,
      })).to.be.eq(BitmexOrderSideEnum.BUY)

      expect(translatePositionSideToBitmex({
        from: AlunaPositionSideEnum.SHORT,
      })).to.be.eq(BitmexOrderSideEnum.SELL)

      try {

        translatePositionSideToBitmex({
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
