import { expect } from 'chai'

import { AlunaError } from '../../../../lib/core/AlunaError'
import { AlunaOrderTypesEnum } from '../../../../lib/enums/AlunaOrderTypesEnum'
import { binanceOrderTypeEnum } from '../binanceOrderTypeEnum'
import {
  translateOrderTypeToAluna,
  translateOrderTypeTobinance,
} from './binanceOrderTypeAdapter'



describe(__filename, () => {

  const notSupported = 'not-supported'



  it('should properly translate binance order types to Aluna order types', () => {

    expect(translateOrderTypeToAluna({
      from: binanceOrderTypeEnum.LIMIT,
    })).to.be.eq(AlunaOrderTypesEnum.LIMIT)

    expect(translateOrderTypeToAluna({
      from: binanceOrderTypeEnum.MARKET,
    })).to.be.eq(AlunaOrderTypesEnum.MARKET)

    expect(translateOrderTypeToAluna({
      from: binanceOrderTypeEnum.CEILING_LIMIT,
    })).to.be.eq(AlunaOrderTypesEnum.LIMIT_ORDER_BOOK)

    expect(translateOrderTypeToAluna({
      from: binanceOrderTypeEnum.CEILING_MARKET,
    })).to.be.eq(AlunaOrderTypesEnum.TAKE_PROFIT_MARKET)

    let result
    let error

    try {

      result = translateOrderTypeToAluna({
        from: notSupported as binanceOrderTypeEnum,
      })

    } catch (err) {

      error = err

    }

    expect(result).not.to.be.ok

    expect(error instanceof AlunaError).to.be.ok
    expect(error.message)
      .to.be.eq(`Order type not supported: ${notSupported}`)


  })



  it('should properly translate Aluna order types to binance order types', () => {

    expect(translateOrderTypeTobinance({
      from: AlunaOrderTypesEnum.LIMIT,
    })).to.be.eq(binanceOrderTypeEnum.LIMIT)

    expect(translateOrderTypeTobinance({
      from: AlunaOrderTypesEnum.MARKET,
    })).to.be.eq(binanceOrderTypeEnum.MARKET)

    expect(translateOrderTypeTobinance({
      from: AlunaOrderTypesEnum.LIMIT_ORDER_BOOK,
    })).to.be.eq(binanceOrderTypeEnum.CEILING_LIMIT)

    expect(translateOrderTypeTobinance({
      from: AlunaOrderTypesEnum.TAKE_PROFIT_MARKET,
    })).to.be.eq(binanceOrderTypeEnum.CEILING_MARKET)

    let result
    let error

    try {

      translateOrderTypeTobinance({
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
