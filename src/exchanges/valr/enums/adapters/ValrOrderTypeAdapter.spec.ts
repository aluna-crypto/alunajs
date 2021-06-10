import { expect } from 'chai'

import { AlunaError } from '../../../../lib/core/AlunaError'
import { OrderTypesEnum } from '../../../../lib/enums/OrderTypeEnum'
import { ValrOrderTypesEnum } from '../ValrOrderTypesEnum'
import { ValrOrderTypeAdapter } from './ValrOrderTypeAdapter'



describe('ValrOrderTypeAdapter', () => {

  const notSupported = 'not-supported'



  it('should properly translate Valr order types to Aluna order types', () => {

    expect(ValrOrderTypeAdapter.translateToAluna({
      from: ValrOrderTypesEnum.LIMIT,
    })).to.be.eq(OrderTypesEnum.LIMIT)

    expect(ValrOrderTypeAdapter.translateToAluna({
      from: ValrOrderTypesEnum.LIMIT_POST_ONLY,
    })).to.be.eq(OrderTypesEnum.LIMIT)

    expect(ValrOrderTypeAdapter.translateToAluna({
      from: ValrOrderTypesEnum.MARKET,
    })).to.be.eq(OrderTypesEnum.MARKET)

    expect(ValrOrderTypeAdapter.translateToAluna({
      from: ValrOrderTypesEnum.SIMPLE,
    })).to.be.eq(OrderTypesEnum.MARKET)

    expect(ValrOrderTypeAdapter.translateToAluna({
      from: ValrOrderTypesEnum.STOP_LOSS_LIMIT,
    })).to.be.eq(OrderTypesEnum.STOP_LIMIT)

    expect(ValrOrderTypeAdapter.translateToAluna({
      from: ValrOrderTypesEnum.TAKE_PROFIT_LIMIT,
    })).to.be.eq(OrderTypesEnum.TAKE_PROFIT_LIMIT)


    try {

      ValrOrderTypeAdapter.translateToAluna({
        from: notSupported as ValrOrderTypesEnum,
      })

    } catch (err) {

      expect(err instanceof AlunaError).to.be.true
      expect(err.message).to.be.eq(`Order type not supported: ${notSupported}`)

    }


  })



  it('should properly translate Aluna order types to Valr order types', () => {

    expect(ValrOrderTypeAdapter.translateToValr({
      from: OrderTypesEnum.LIMIT,
    })).to.be.eq(ValrOrderTypesEnum.LIMIT)

    expect(ValrOrderTypeAdapter.translateToValr({
      from: OrderTypesEnum.MARKET,
    })).to.be.eq(ValrOrderTypesEnum.MARKET)

    expect(ValrOrderTypeAdapter.translateToValr({
      from: OrderTypesEnum.STOP_LIMIT,
    })).to.be.eq(ValrOrderTypesEnum.STOP_LOSS_LIMIT)

    expect(ValrOrderTypeAdapter.translateToValr({
      from: OrderTypesEnum.TAKE_PROFIT_LIMIT,
    })).to.be.eq(ValrOrderTypesEnum.TAKE_PROFIT_LIMIT)


    try {

      ValrOrderTypeAdapter.translateToValr({
        from: notSupported as OrderTypesEnum,
      })

    } catch (err) {

      expect(err instanceof AlunaError).to.be.true
      expect(err.message).to.be.eq(`Order type not supported: ${notSupported}`)

    }

  })

})
