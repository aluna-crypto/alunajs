import { expect } from 'chai'

import { AlunaError } from '../../../../lib/core/AlunaError'
import { AlunaOrderTypesEnum } from '../../../../lib/enums/AlunaOrderTypesEnum'
import { BinanceOrderTypeEnum } from '../BinanceOrderTypeEnum'
import {
  translateOrderTypeToAluna,
  translateOrderTypeToBinance,
} from './binanceOrderTypeAdapter'



describe(__filename, () => {

  const notSupported = 'not-supported'



  it('should properly translate Binance order types to Aluna order types', () => {

    expect(translateOrderTypeToAluna({
      from: BinanceOrderTypeEnum.LIMIT,
    })).to.be.eq(AlunaOrderTypesEnum.LIMIT)

    expect(translateOrderTypeToAluna({
      from: BinanceOrderTypeEnum.MARKET,
    })).to.be.eq(AlunaOrderTypesEnum.MARKET)

    expect(translateOrderTypeToAluna({
      from: BinanceOrderTypeEnum.CEILING_LIMIT,
    })).to.be.eq(AlunaOrderTypesEnum.LIMIT_ORDER_BOOK)

    expect(translateOrderTypeToAluna({
      from: BinanceOrderTypeEnum.CEILING_MARKET,
    })).to.be.eq(AlunaOrderTypesEnum.TAKE_PROFIT_MARKET)

    let result
    let error

    try {

      result = translateOrderTypeToAluna({
        from: notSupported as BinanceOrderTypeEnum,
      })

    } catch (err) {

      error = err

    }

    expect(result).not.to.be.ok

    expect(error instanceof AlunaError).to.be.ok
    expect(error.message)
      .to.be.eq(`Order type not supported: ${notSupported}`)


  })



  it('should properly translate Aluna order types to Binance order types', () => {

    expect(translateOrderTypeToBinance({
      from: AlunaOrderTypesEnum.LIMIT,
    })).to.be.eq(BinanceOrderTypeEnum.LIMIT)

    expect(translateOrderTypeToBinance({
      from: AlunaOrderTypesEnum.MARKET,
    })).to.be.eq(BinanceOrderTypeEnum.MARKET)

    expect(translateOrderTypeToBinance({
      from: AlunaOrderTypesEnum.LIMIT_ORDER_BOOK,
    })).to.be.eq(BinanceOrderTypeEnum.CEILING_LIMIT)

    expect(translateOrderTypeToBinance({
      from: AlunaOrderTypesEnum.TAKE_PROFIT_MARKET,
    })).to.be.eq(BinanceOrderTypeEnum.CEILING_MARKET)

    let result
    let error

    try {

      translateOrderTypeToBinance({
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
