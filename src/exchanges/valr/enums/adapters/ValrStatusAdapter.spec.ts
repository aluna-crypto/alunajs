import { expect } from 'chai'

import { AlunaError } from '../../../../lib/core/AlunaError'
import { AlunaOrderStatusEnum } from '../../../../lib/enums/AlunaOrderStatusEnum'
import { ValrOrderStatusEnum } from '../ValrOrderStatusEnum'
import { ValrStatusAdapter } from './ValrStatusAdapter'



describe('ValrStatusAdapter', () => {

  const notSupported = 'not-supported'

  it('should translate Valr order status to Aluna order status', () => {

    expect(ValrStatusAdapter.translateToAluna({
      from: ValrOrderStatusEnum.ACTIVE,
    })).to.be.eq(AlunaOrderStatusEnum.OPEN)

    expect(ValrStatusAdapter.translateToAluna({
      from: ValrOrderStatusEnum.PLACED,
    })).to.be.eq(AlunaOrderStatusEnum.OPEN)

    expect(ValrStatusAdapter.translateToAluna({
      from: ValrOrderStatusEnum.PARTIALLY_FILLED,
    })).to.be.eq(AlunaOrderStatusEnum.PARTIALLY_FILLED)

    expect(ValrStatusAdapter.translateToAluna({
      from: ValrOrderStatusEnum.FILLED,
    })).to.be.eq(AlunaOrderStatusEnum.FILLED)

    expect(ValrStatusAdapter.translateToAluna({
      from: ValrOrderStatusEnum.FAILED,
    })).to.be.eq(AlunaOrderStatusEnum.CANCELED)

    expect(ValrStatusAdapter.translateToAluna({
      from: ValrOrderStatusEnum.CANCELLED,
    })).to.be.eq(AlunaOrderStatusEnum.CANCELED)

    try {

      ValrStatusAdapter.translateToAluna({
        from: notSupported as ValrOrderStatusEnum,
      })

    } catch (err) {

      expect(err instanceof AlunaError).to.be.ok

      const { data: { error } } = err as AlunaError
      expect(error).to.be.eq(`Order status not supported: ${notSupported}`)

    }

  })

  it('should translate Aluna order status to Valr order status', () => {

    expect(ValrStatusAdapter.translateToValr({
      from: AlunaOrderStatusEnum.OPEN,
    })).to.be.eq(ValrOrderStatusEnum.PLACED)

    expect(ValrStatusAdapter.translateToValr({
      from: AlunaOrderStatusEnum.PARTIALLY_FILLED,
    })).to.be.eq(ValrOrderStatusEnum.PARTIALLY_FILLED)

    expect(ValrStatusAdapter.translateToValr({
      from: AlunaOrderStatusEnum.FILLED,
    })).to.be.eq(ValrOrderStatusEnum.FILLED)

    expect(ValrStatusAdapter.translateToValr({
      from: AlunaOrderStatusEnum.CANCELED,
    })).to.be.eq(ValrOrderStatusEnum.CANCELLED)

    try {

      ValrStatusAdapter.translateToValr({
        from: notSupported as AlunaOrderStatusEnum,
      })

    } catch (err) {

      expect(err instanceof AlunaError).to.be.ok

      const { data: { error } } = err as AlunaError
      expect(error).to.be.eq(`Order status not supported: ${notSupported}`)

    }

  })

})
