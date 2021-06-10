import { expect } from 'chai'

import { AlunaError } from '../../../../lib/core/AlunaError'
import { OrderStatusEnum } from '../../../../lib/enums/OrderStatusEnum'
import { ValrOrderStatusEnum } from '../ValrOrderStatusEnum'
import { ValrStatusAdapter } from './ValrStatusAdapter'



describe('ValrStatusAdapter', () => {

  const notSupported = 'not-supported'



  it('should translate Valr order status to Aluna order status', () => {

    expect(ValrStatusAdapter.translateToAluna({
      from: ValrOrderStatusEnum.ACTIVE,
    })).to.be.eq(OrderStatusEnum.OPEN)

    expect(ValrStatusAdapter.translateToAluna({
      from: ValrOrderStatusEnum.PLACED,
    })).to.be.eq(OrderStatusEnum.OPEN)

    expect(ValrStatusAdapter.translateToAluna({
      from: ValrOrderStatusEnum.PARTIALLY_FILLED,
    })).to.be.eq(OrderStatusEnum.PARTIALLY_FILLED)

    expect(ValrStatusAdapter.translateToAluna({
      from: ValrOrderStatusEnum.FILLED,
    })).to.be.eq(OrderStatusEnum.FILLED)

    expect(ValrStatusAdapter.translateToAluna({
      from: ValrOrderStatusEnum.FAILED,
    })).to.be.eq(OrderStatusEnum.CANCELED)

    expect(ValrStatusAdapter.translateToAluna({
      from: ValrOrderStatusEnum.CANCELLED,
    })).to.be.eq(OrderStatusEnum.CANCELED)


    try {

      ValrStatusAdapter.translateToAluna({
        from: notSupported as ValrOrderStatusEnum,
      })

    } catch (err) {

      expect(err instanceof AlunaError).to.be.true
      expect(err.message)
        .to.be.eq(`Order status not supported: ${notSupported}`)

    }


  })



  it('should translate Aluna order status to Valr order status', () => {

    expect(ValrStatusAdapter.translateToValr({
      from: OrderStatusEnum.OPEN,
    })).to.be.eq(ValrOrderStatusEnum.PLACED)

    expect(ValrStatusAdapter.translateToValr({
      from: OrderStatusEnum.PARTIALLY_FILLED,
    })).to.be.eq(ValrOrderStatusEnum.PARTIALLY_FILLED)

    expect(ValrStatusAdapter.translateToValr({
      from: OrderStatusEnum.FILLED,
    })).to.be.eq(ValrOrderStatusEnum.FILLED)

    expect(ValrStatusAdapter.translateToValr({
      from: OrderStatusEnum.CANCELED,
    })).to.be.eq(ValrOrderStatusEnum.CANCELLED)


    try {

      ValrStatusAdapter.translateToValr({
        from: notSupported as OrderStatusEnum,
      })

    } catch (err) {

      expect(err instanceof AlunaError).to.be.true
      expect(err.message)
        .to.be.eq(`Order status not supported: ${notSupported}`)

    }

  })

})
