import { expect } from 'chai'

import { AlunaError } from '../../../../lib/core/AlunaError'
import { AlunaOrderStatusEnum } from '../../../../lib/enums/AlunaOrderStatusEnum'
import { BinanceOrderStatusEnum } from '../BinanceOrderStatusEnum'
import { BinanceStatusAdapter } from './BinanceStatusAdapter'



describe('BinanceStatusAdapter', () => {

  const notSupported = 'not-supported'



  it('should translate Binance order status to Aluna order status', () => {

    expect(BinanceStatusAdapter.translateToAluna({
      from: BinanceOrderStatusEnum.NEW,
    })).to.be.eq(AlunaOrderStatusEnum.OPEN)

    expect(BinanceStatusAdapter.translateToAluna({
      from: BinanceOrderStatusEnum.PARTIALLY_FILLED,
    })).to.be.eq(AlunaOrderStatusEnum.PARTIALLY_FILLED)

    expect(BinanceStatusAdapter.translateToAluna({
      from: BinanceOrderStatusEnum.FILLED,
    })).to.be.eq(AlunaOrderStatusEnum.FILLED)

    expect(BinanceStatusAdapter.translateToAluna({
      from: BinanceOrderStatusEnum.REJECTED,
    })).to.be.eq(AlunaOrderStatusEnum.CANCELED)

    expect(BinanceStatusAdapter.translateToAluna({
      from: BinanceOrderStatusEnum.CANCELED,
    })).to.be.eq(AlunaOrderStatusEnum.CANCELED)

    expect(BinanceStatusAdapter.translateToAluna({
      from: BinanceOrderStatusEnum.EXPIRED,
    })).to.be.eq(AlunaOrderStatusEnum.CANCELED)


    try {

      BinanceStatusAdapter.translateToAluna({
        from: notSupported as BinanceOrderStatusEnum,
      })

    } catch (err) {

      expect(err instanceof AlunaError).to.be.ok
      expect(err.message)
        .to.be.eq(`Order status not supported: ${notSupported}`)

    }


  })



  it('should translate Aluna order status to Binance order status', () => {

    expect(BinanceStatusAdapter.translateToBinance({
      from: AlunaOrderStatusEnum.OPEN,
    })).to.be.eq(BinanceOrderStatusEnum.NEW)

    expect(BinanceStatusAdapter.translateToBinance({
      from: AlunaOrderStatusEnum.PARTIALLY_FILLED,
    })).to.be.eq(BinanceOrderStatusEnum.PARTIALLY_FILLED)

    expect(BinanceStatusAdapter.translateToBinance({
      from: AlunaOrderStatusEnum.FILLED,
    })).to.be.eq(BinanceOrderStatusEnum.FILLED)

    expect(BinanceStatusAdapter.translateToBinance({
      from: AlunaOrderStatusEnum.CANCELED,
    })).to.be.eq(BinanceOrderStatusEnum.CANCELED)


    try {

      BinanceStatusAdapter.translateToBinance({
        from: notSupported as AlunaOrderStatusEnum,
      })

    } catch (err) {

      expect(err instanceof AlunaError).to.be.ok
      expect(err.message)
        .to.be.eq(`Order status not supported: ${notSupported}`)

    }

  })

})
