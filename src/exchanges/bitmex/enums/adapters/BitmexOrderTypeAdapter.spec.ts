import { expect } from 'chai'

import { AlunaError } from '../../../../lib/core/AlunaError'
import { AlunaOrderTypesEnum } from '../../../../lib/enums/AlunaOrderTypesEnum'
import { BitmexOrderTypeEnum } from '../BitmexOrderTypeEnum'
import { BitmexOrderTypeAdapter } from './BitmexOrderTypeAdapter'



describe('BitmexOrderTypeAdapter', () => {

  const notSupported = 'not-supported'

  it('should properly translate Bitmex order type to Aluna order type', () => {

    let error

    expect(BitmexOrderTypeAdapter.translateToAluna({
      from: BitmexOrderTypeEnum.LIMIT,
    })).to.be.eq(AlunaOrderTypesEnum.LIMIT)

    expect(BitmexOrderTypeAdapter.translateToAluna({
      from: BitmexOrderTypeEnum.MARKET,
    })).to.be.eq(AlunaOrderTypesEnum.MARKET)

    expect(BitmexOrderTypeAdapter.translateToAluna({
      from: BitmexOrderTypeEnum.STOP_LIMIT,
    })).to.be.eq(AlunaOrderTypesEnum.STOP_LIMIT)

    expect(BitmexOrderTypeAdapter.translateToAluna({
      from: BitmexOrderTypeEnum.STOP_MARKET,
    })).to.be.eq(AlunaOrderTypesEnum.STOP_MARKET)

    try {

      BitmexOrderTypeAdapter.translateToAluna({
        from: notSupported as BitmexOrderTypeEnum,
      })

    } catch (err) {

      error = err

    }

    expect(error).to.be.ok

    const { message } = error
    expect(message).to.be.eq(`Order type not supported: ${notSupported}`)

  })

  it('should properly translate Aluna order type to Bitmex order type', () => {

    let error

    expect(BitmexOrderTypeAdapter.translateToBitmex({
      from: AlunaOrderTypesEnum.LIMIT,
    })).to.be.eq(BitmexOrderTypeEnum.LIMIT)

    expect(BitmexOrderTypeAdapter.translateToBitmex({
      from: AlunaOrderTypesEnum.MARKET,
    })).to.be.eq(BitmexOrderTypeEnum.MARKET)

    expect(BitmexOrderTypeAdapter.translateToBitmex({
      from: AlunaOrderTypesEnum.STOP_LIMIT,
    })).to.be.eq(BitmexOrderTypeEnum.STOP_LIMIT)

    expect(BitmexOrderTypeAdapter.translateToBitmex({
      from: AlunaOrderTypesEnum.STOP_MARKET,
    })).to.be.eq(BitmexOrderTypeEnum.STOP_MARKET)

    try {

      BitmexOrderTypeAdapter.translateToBitmex({
        from: notSupported as AlunaOrderTypesEnum,
      })

    } catch (err) {

      error = err

    }

    expect(error instanceof AlunaError).to.be.ok
    expect(error.message)
      .to.be.eq(`Order type not supported: ${notSupported}`)

  })

})
