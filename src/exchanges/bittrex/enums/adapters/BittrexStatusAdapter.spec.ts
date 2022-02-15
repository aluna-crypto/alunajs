import { expect } from 'chai'

import { AlunaError } from '../../../../lib/core/AlunaError'
import { AlunaOrderStatusEnum } from '../../../../lib/enums/AlunaOrderStatusEnum'
import { BittrexOrderStatusEnum } from '../BittrexOrderStatusEnum'
import { BittrexStatusAdapter } from './BittrexStatusAdapter'



describe('BittrexStatusAdapter', () => {

  const notSupported = 'not-supported'



  it('should translate Bittrex order status to Aluna order status',
    () => {

      expect(BittrexStatusAdapter.translateToAluna({
        from: BittrexOrderStatusEnum.OPEN,
      })).to.be.eq(AlunaOrderStatusEnum.OPEN)

      expect(BittrexStatusAdapter.translateToAluna({
        from: BittrexOrderStatusEnum.CLOSED,
      })).to.be.eq(AlunaOrderStatusEnum.FILLED)

      let result
      let error

      try {

        result = BittrexStatusAdapter.translateToAluna({
          from: notSupported as BittrexOrderStatusEnum,
        })

      } catch (err) {

        error = err

      }

      expect(result).not.to.be.ok
      expect(error instanceof AlunaError).to.be.ok
      expect(error.message)
        .to.be.eq(`Order status not supported: ${notSupported}`)

    })

  it('should translate Bittrex Closed order status to Aluna order status',
    () => {

      const quantity = '5'
      const zeroedfillQty = '0'
      const partiallyFillQty = '3'
      const totalFillQty = '5'

      expect(BittrexStatusAdapter.translateClosedStatusToAluna({
        fillQuantity: zeroedfillQty,
        quantity,
      })).to.be.eq(AlunaOrderStatusEnum.CANCELED)

      expect(BittrexStatusAdapter.translateClosedStatusToAluna({
        fillQuantity: partiallyFillQty,
        quantity,
      })).to.be.eq(AlunaOrderStatusEnum.PARTIALLY_FILLED)

      expect(BittrexStatusAdapter.translateClosedStatusToAluna({
        fillQuantity: totalFillQty,
        quantity,
      })).to.be.eq(AlunaOrderStatusEnum.FILLED)

    })



  it('should translate Aluna order status to Bittrex order status', () => {

    expect(BittrexStatusAdapter.translateToBittrex({
      from: AlunaOrderStatusEnum.OPEN,
    })).to.be.eq(BittrexOrderStatusEnum.OPEN)

    expect(BittrexStatusAdapter.translateToBittrex({
      from: AlunaOrderStatusEnum.PARTIALLY_FILLED,
    })).to.be.eq(BittrexOrderStatusEnum.OPEN)

    expect(BittrexStatusAdapter.translateToBittrex({
      from: AlunaOrderStatusEnum.FILLED,
    })).to.be.eq(BittrexOrderStatusEnum.CLOSED)

    expect(BittrexStatusAdapter.translateToBittrex({
      from: AlunaOrderStatusEnum.CANCELED,
    })).to.be.eq(BittrexOrderStatusEnum.CLOSED)

    let result
    let error

    try {

      result = BittrexStatusAdapter.translateToBittrex({
        from: notSupported as AlunaOrderStatusEnum,
      })

    } catch (err) {

      error = err

    }

    expect(result).not.to.be.ok
    expect(error instanceof AlunaError).to.be.ok
    expect(error.message)
      .to.be.eq(`Order status not supported: ${notSupported}`)

  })

})
