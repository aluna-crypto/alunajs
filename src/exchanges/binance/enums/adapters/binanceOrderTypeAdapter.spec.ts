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
      from: BinanceOrderTypeEnum.STOP_LOSS_LIMIT,
    })).to.be.eq(AlunaOrderTypesEnum.STOP_LIMIT)

    expect(translateOrderTypeToAluna({
      from: BinanceOrderTypeEnum.STOP_LOSS,
    })).to.be.eq(AlunaOrderTypesEnum.STOP_MARKET)

    expect(translateOrderTypeToAluna({
      from: BinanceOrderTypeEnum.TAKE_PROFIT_LIMIT,
    })).to.be.eq(AlunaOrderTypesEnum.TAKE_PROFIT_LIMIT)

    expect(translateOrderTypeToAluna({
      from: BinanceOrderTypeEnum.LIMIT_MAKER,
    })).to.be.eq(AlunaOrderTypesEnum.LIMIT)

    expect(translateOrderTypeToAluna({
      from: BinanceOrderTypeEnum.TAKE_PROFIT,
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
      from: AlunaOrderTypesEnum.STOP_LIMIT,
    })).to.be.eq(BinanceOrderTypeEnum.STOP_LOSS_LIMIT)

    expect(translateOrderTypeToBinance({
      from: AlunaOrderTypesEnum.TAKE_PROFIT_LIMIT,
    })).to.be.eq(BinanceOrderTypeEnum.TAKE_PROFIT_LIMIT)

    expect(translateOrderTypeToBinance({
      from: AlunaOrderTypesEnum.TAKE_PROFIT_MARKET,
    })).to.be.eq(BinanceOrderTypeEnum.TAKE_PROFIT)

    expect(translateOrderTypeToBinance({
      from: AlunaOrderTypesEnum.STOP_MARKET,
    })).to.be.eq(BinanceOrderTypeEnum.STOP_LOSS)

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
