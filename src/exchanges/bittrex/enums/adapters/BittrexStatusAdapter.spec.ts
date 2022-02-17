import { expect } from 'chai'

import { AlunaError } from '../../../../lib/core/AlunaError'
import { AlunaOrderStatusEnum } from '../../../../lib/enums/AlunaOrderStatusEnum'
import { BittrexOrderStatusEnum } from '../BittrexOrderStatusEnum'
import { BittrexStatusAdapter } from './BittrexStatusAdapter'



describe('BittrexStatusAdapter', () => {

  const notSupported = 'not-supported'


  it('should translate Bittrex order status to Aluna order status',
    () => {

      const quantity = '5'
      const zeroedfillQty = '0'
      const partiallyFillQty = '3'
      const totalFillQty = '5'

      expect(BittrexStatusAdapter.translateToAluna({
        fillQuantity: zeroedfillQty,
        quantity,
        from: BittrexOrderStatusEnum.CLOSED,
      })).to.be.eq(AlunaOrderStatusEnum.CANCELED)

      expect(BittrexStatusAdapter.translateToAluna({
        fillQuantity: partiallyFillQty,
        quantity,
        from: BittrexOrderStatusEnum.CLOSED,
      })).to.be.eq(AlunaOrderStatusEnum.PARTIALLY_FILLED)

      expect(BittrexStatusAdapter.translateToAluna({
        fillQuantity: totalFillQty,
        quantity,
        from: BittrexOrderStatusEnum.CLOSED,
      })).to.be.eq(AlunaOrderStatusEnum.FILLED)

      expect(BittrexStatusAdapter.translateToAluna({
        fillQuantity: totalFillQty,
        quantity,
        from: BittrexOrderStatusEnum.OPEN,
      })).to.be.eq(AlunaOrderStatusEnum.OPEN)

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
