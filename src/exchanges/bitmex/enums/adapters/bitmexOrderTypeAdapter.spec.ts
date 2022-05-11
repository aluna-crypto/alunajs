import { expect } from 'chai'

import { AlunaError } from '../../../../lib/core/AlunaError'
import { AlunaOrderTypesEnum } from '../../../../lib/enums/AlunaOrderTypesEnum'
import { BitmexOrderTypeEnum } from '../BitmexOrderTypeEnum'
import {
  translateOrderTypeToAluna,
  translateOrderTypeToBitmex,
} from './bitmexOrderTypeAdapter'



describe(__filename, () => {

  const notSupported = 'not-supported'



  it('should properly translate Bitmex order types to Aluna order types', () => {

    expect(translateOrderTypeToAluna({
      from: BitmexOrderTypeEnum.LIMIT,
    })).to.be.eq(AlunaOrderTypesEnum.LIMIT)

    expect(translateOrderTypeToAluna({
      from: BitmexOrderTypeEnum.MARKET,
    })).to.be.eq(AlunaOrderTypesEnum.MARKET)

    expect(translateOrderTypeToAluna({
      from: BitmexOrderTypeEnum.CEILING_LIMIT,
    })).to.be.eq(AlunaOrderTypesEnum.LIMIT_ORDER_BOOK)

    expect(translateOrderTypeToAluna({
      from: BitmexOrderTypeEnum.CEILING_MARKET,
    })).to.be.eq(AlunaOrderTypesEnum.TAKE_PROFIT_MARKET)

    let result
    let error

    try {

      result = translateOrderTypeToAluna({
        from: notSupported as BitmexOrderTypeEnum,
      })

    } catch (err) {

      error = err

    }

    expect(result).not.to.be.ok

    expect(error instanceof AlunaError).to.be.ok
    expect(error.message)
      .to.be.eq(`Order type not supported: ${notSupported}`)


  })



  it('should properly translate Aluna order types to Bitmex order types', () => {

    expect(translateOrderTypeToBitmex({
      from: AlunaOrderTypesEnum.LIMIT,
    })).to.be.eq(BitmexOrderTypeEnum.LIMIT)

    expect(translateOrderTypeToBitmex({
      from: AlunaOrderTypesEnum.MARKET,
    })).to.be.eq(BitmexOrderTypeEnum.MARKET)

    expect(translateOrderTypeToBitmex({
      from: AlunaOrderTypesEnum.LIMIT_ORDER_BOOK,
    })).to.be.eq(BitmexOrderTypeEnum.CEILING_LIMIT)

    expect(translateOrderTypeToBitmex({
      from: AlunaOrderTypesEnum.TAKE_PROFIT_MARKET,
    })).to.be.eq(BitmexOrderTypeEnum.CEILING_MARKET)

    let result
    let error

    try {

      translateOrderTypeToBitmex({
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
