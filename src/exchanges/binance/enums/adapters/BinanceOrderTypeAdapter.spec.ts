import { expect } from 'chai'

import { AlunaError } from '../../../../lib/core/AlunaError'
import { AlunaOrderTypesEnum } from '../../../../lib/enums/AlunaOrderTypesEnum'
import { BinanceOrderTypeEnum } from '../BinanceOrderTypeEnum'
import { BinanceOrderTypeAdapter } from './BinanceOrderTypeAdapter'



describe('BinanceOrderTypeAdapter', () => {

  const notSupported = 'not-supported'



  it('should properly translate Binance order types to Aluna order types',
    () => {

    expect(BinanceOrderTypeAdapter.translateToAluna({
      from: BinanceOrderTypeEnum.LIMIT,
    })).to.be.eq(AlunaOrderTypesEnum.LIMIT)

    expect(BinanceOrderTypeAdapter.translateToAluna({
      from: BinanceOrderTypeEnum.MARKET,
    })).to.be.eq(AlunaOrderTypesEnum.MARKET)

    expect(BinanceOrderTypeAdapter.translateToAluna({
      from: BinanceOrderTypeEnum.STOP_LOSS_LIMIT,
    })).to.be.eq(AlunaOrderTypesEnum.STOP_LIMIT)
    
    expect(BinanceOrderTypeAdapter.translateToAluna({
      from: BinanceOrderTypeEnum.STOP_LOSS,
    })).to.be.eq(AlunaOrderTypesEnum.STOP_MARKET)

    expect(BinanceOrderTypeAdapter.translateToAluna({
      from: BinanceOrderTypeEnum.TAKE_PROFIT_LIMIT,
    })).to.be.eq(AlunaOrderTypesEnum.TAKE_PROFIT_LIMIT)
    
    expect(BinanceOrderTypeAdapter.translateToAluna({
      from: BinanceOrderTypeEnum.LIMIT_MAKER,
    })).to.be.eq(AlunaOrderTypesEnum.LIMIT)
    
    expect(BinanceOrderTypeAdapter.translateToAluna({
      from: BinanceOrderTypeEnum.TAKE_PROFIT,
    })).to.be.eq(AlunaOrderTypesEnum.TAKE_PROFIT_MARKET)


    try {

      BinanceOrderTypeAdapter.translateToAluna({
        from: notSupported as BinanceOrderTypeEnum,
      })

    } catch (err) {

      expect(err instanceof AlunaError).to.be.ok
      expect(err.message).to.be.eq(`Order type not supported: ${notSupported}`)

    }


  })



  it('should properly translate Aluna order types to Binance order types',
    () => {

    expect(BinanceOrderTypeAdapter.translateToBinance({
      from: AlunaOrderTypesEnum.LIMIT,
    })).to.be.eq(BinanceOrderTypeEnum.LIMIT)

    expect(BinanceOrderTypeAdapter.translateToBinance({
      from: AlunaOrderTypesEnum.MARKET,
    })).to.be.eq(BinanceOrderTypeEnum.MARKET)

    expect(BinanceOrderTypeAdapter.translateToBinance({
      from: AlunaOrderTypesEnum.STOP_LIMIT,
    })).to.be.eq(BinanceOrderTypeEnum.STOP_LOSS_LIMIT)

    expect(BinanceOrderTypeAdapter.translateToBinance({
      from: AlunaOrderTypesEnum.TAKE_PROFIT_LIMIT,
    })).to.be.eq(BinanceOrderTypeEnum.TAKE_PROFIT_LIMIT)
    
    expect(BinanceOrderTypeAdapter.translateToBinance({
      from: AlunaOrderTypesEnum.TAKE_PROFIT_MARKET,
    })).to.be.eq(BinanceOrderTypeEnum.TAKE_PROFIT)

    expect(BinanceOrderTypeAdapter.translateToBinance({
      from: AlunaOrderTypesEnum.STOP_MARKET,
    })).to.be.eq(BinanceOrderTypeEnum.STOP_LOSS)


    try {

      BinanceOrderTypeAdapter.translateToBinance({
        from: notSupported as AlunaOrderTypesEnum,
      })

    } catch (err) {

      expect(err instanceof AlunaError).to.be.ok
      expect(err.message).to.be.eq(`Order type not supported: ${notSupported}`)

    }

  })

})
