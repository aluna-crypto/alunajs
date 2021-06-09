import { expect } from 'chai'

import { OrderStatusEnum } from '../../../../lib/enums/OrderStatusEnum'
import { ValrError } from '../../ValrError'
import { ValrOrderStatusEnum } from '../ValrOrderStatusEnum'
import { ValrStatusAdapter } from './ValrStatusAdapter'



describe('ValrStatusAdapter', () => {

  const notSupported = 'not-supported'



  it('should translate Valr order status to Aluna order status', () => {

    expect(ValrStatusAdapter.translateToAluna({
      status: ValrOrderStatusEnum.ACTIVE,
    })).to.be.eq(OrderStatusEnum.OPEN)

    expect(ValrStatusAdapter.translateToAluna({
      status: ValrOrderStatusEnum.PLACED,
    })).to.be.eq(OrderStatusEnum.OPEN)

    expect(ValrStatusAdapter.translateToAluna({
      status: ValrOrderStatusEnum.PARTIALLY_FILLED,
    })).to.be.eq(OrderStatusEnum.PARTIALLY_FILLED)

    expect(ValrStatusAdapter.translateToAluna({
      status: ValrOrderStatusEnum.FILLED,
    })).to.be.eq(OrderStatusEnum.FILLED)

    expect(ValrStatusAdapter.translateToAluna({
      status: ValrOrderStatusEnum.FAILED,
    })).to.be.eq(OrderStatusEnum.CANCELED)

    expect(ValrStatusAdapter.translateToAluna({
      status: ValrOrderStatusEnum.CANCELLED,
    })).to.be.eq(OrderStatusEnum.CANCELED)


    try {

      ValrStatusAdapter.translateToAluna({
        status: notSupported as ValrOrderStatusEnum,
      })

    } catch (err) {

      expect(err instanceof ValrError).to.be.true
      expect(err.message)
        .to.be.eq(`Order status not supported: ${notSupported}`)

    }


  })



  it('should translate Aluna order status to Valr order status', () => {

    expect(ValrStatusAdapter.translateToValr({
      status: OrderStatusEnum.OPEN,
    })).to.be.eq(ValrOrderStatusEnum.PLACED)

    expect(ValrStatusAdapter.translateToValr({
      status: OrderStatusEnum.PARTIALLY_FILLED,
    })).to.be.eq(ValrOrderStatusEnum.PARTIALLY_FILLED)

    expect(ValrStatusAdapter.translateToValr({
      status: OrderStatusEnum.FILLED,
    })).to.be.eq(ValrOrderStatusEnum.FILLED)

    expect(ValrStatusAdapter.translateToValr({
      status: OrderStatusEnum.CANCELED,
    })).to.be.eq(ValrOrderStatusEnum.CANCELLED)


    try {

      ValrStatusAdapter.translateToValr({
        status: notSupported as OrderStatusEnum,
      })

    } catch (err) {

      expect(err instanceof ValrError).to.be.true
      expect(err.message)
        .to.be.eq(`Order status not supported: ${notSupported}`)

    }

  })

})
