import { expect } from 'chai'

import { AlunaError } from '../../../../lib/core/AlunaError'
import { AlunaOrderTypesEnum } from '../../../../lib/enums/AlunaOrderTypesEnum'
import { PoloniexOrderTypeEnum } from '../PoloniexOrderTypeEnum'
import {
  translateOrderTypeToAluna,
  translateOrderTypeToPoloniex,
} from './poloniexOrderTypeAdapter'



describe(__filename, () => {

  const notSupported = 'not-supported'



  it('should properly translate Poloniex order types to Aluna order types', () => {

    expect(translateOrderTypeToAluna({
      from: PoloniexOrderTypeEnum.LIMIT,
    })).to.be.eq(AlunaOrderTypesEnum.LIMIT)

    expect(translateOrderTypeToAluna({
      from: PoloniexOrderTypeEnum.MARKET,
    })).to.be.eq(AlunaOrderTypesEnum.MARKET)

    expect(translateOrderTypeToAluna({
      from: PoloniexOrderTypeEnum.CEILING_LIMIT,
    })).to.be.eq(AlunaOrderTypesEnum.LIMIT_ORDER_BOOK)

    expect(translateOrderTypeToAluna({
      from: PoloniexOrderTypeEnum.CEILING_MARKET,
    })).to.be.eq(AlunaOrderTypesEnum.TAKE_PROFIT_MARKET)

    let result
    let error

    try {

      result = translateOrderTypeToAluna({
        from: notSupported as PoloniexOrderTypeEnum,
      })

    } catch (err) {

      error = err

    }

    expect(result).not.to.be.ok

    expect(error instanceof AlunaError).to.be.ok
    expect(error.message)
      .to.be.eq(`Order type not supported: ${notSupported}`)


  })



  it('should properly translate Aluna order types to Poloniex order types', () => {

    expect(translateOrderTypeToPoloniex({
      from: AlunaOrderTypesEnum.LIMIT,
    })).to.be.eq(PoloniexOrderTypeEnum.LIMIT)

    expect(translateOrderTypeToPoloniex({
      from: AlunaOrderTypesEnum.MARKET,
    })).to.be.eq(PoloniexOrderTypeEnum.MARKET)

    expect(translateOrderTypeToPoloniex({
      from: AlunaOrderTypesEnum.LIMIT_ORDER_BOOK,
    })).to.be.eq(PoloniexOrderTypeEnum.CEILING_LIMIT)

    expect(translateOrderTypeToPoloniex({
      from: AlunaOrderTypesEnum.TAKE_PROFIT_MARKET,
    })).to.be.eq(PoloniexOrderTypeEnum.CEILING_MARKET)

    let result
    let error

    try {

      translateOrderTypeToPoloniex({
        from: notSupported as AlunaOrderTypesEnum,
      })

    } catch (err) {

      error = err

    }


    expect(result).not.to.be.ok
    expect(error instanceof AlunaError).to.be.ok
    expect(error.message)
      .to.be.eq(`Order type not supported: ${notSupported}`)

  })

})
