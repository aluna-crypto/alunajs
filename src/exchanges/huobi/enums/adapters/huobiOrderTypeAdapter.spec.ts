import { expect } from 'chai'

import { AlunaError } from '../../../../lib/core/AlunaError'
import { AlunaOrderSideEnum } from '../../../../lib/enums/AlunaOrderSideEnum'
import { AlunaOrderTypesEnum } from '../../../../lib/enums/AlunaOrderTypesEnum'
import { HuobiOrderTypeEnum } from '../HuobiOrderTypeEnum'
import {
  translateOrderTypeToAluna,
  translateOrderTypeToHuobi,
} from './huobiOrderTypeAdapter'



describe(__filename, () => {

  const notSupported = 'not-supported'

  it('should properly translate Huobi order types to Aluna order types', () => {

    expect(translateOrderTypeToAluna({
      from: HuobiOrderTypeEnum.BUY_MARKET,
    })).to.be.eq(AlunaOrderTypesEnum.MARKET)

    expect(translateOrderTypeToAluna({
      from: HuobiOrderTypeEnum.SELL_MARKET,
    })).to.be.eq(AlunaOrderTypesEnum.MARKET)

    expect(translateOrderTypeToAluna({
      from: HuobiOrderTypeEnum.BUY_LIMIT,
    })).to.be.eq(AlunaOrderTypesEnum.LIMIT)

    expect(translateOrderTypeToAluna({
      from: HuobiOrderTypeEnum.SELL_LIMIT,
    })).to.be.eq(AlunaOrderTypesEnum.LIMIT)

    expect(translateOrderTypeToAluna({
      from: HuobiOrderTypeEnum.BUY_IOC,
    })).to.be.eq(AlunaOrderTypesEnum.IMMEDIATE_OR_CANCEL)

    expect(translateOrderTypeToAluna({
      from: HuobiOrderTypeEnum.SELL_IOC,
    })).to.be.eq(AlunaOrderTypesEnum.IMMEDIATE_OR_CANCEL)

    expect(translateOrderTypeToAluna({
      from: HuobiOrderTypeEnum.BUY_LIMIT_MAKER,
    })).to.be.eq(AlunaOrderTypesEnum.LIMIT)

    expect(translateOrderTypeToAluna({
      from: HuobiOrderTypeEnum.SELL_LIMIT_MAKER,
    })).to.be.eq(AlunaOrderTypesEnum.LIMIT)

    expect(translateOrderTypeToAluna({
      from: HuobiOrderTypeEnum.BUY_STOP_LIMIT,
    })).to.be.eq(AlunaOrderTypesEnum.STOP_LIMIT)

    expect(translateOrderTypeToAluna({
      from: HuobiOrderTypeEnum.SELL_STOP_LIMIT,
    })).to.be.eq(AlunaOrderTypesEnum.STOP_LIMIT)

    expect(translateOrderTypeToAluna({
      from: HuobiOrderTypeEnum.BUY_LIMIT_FOK,
    })).to.be.eq(AlunaOrderTypesEnum.FILL_OF_KILL)

    expect(translateOrderTypeToAluna({
      from: HuobiOrderTypeEnum.SELL_LIMIT_FOK,
    })).to.be.eq(AlunaOrderTypesEnum.FILL_OF_KILL)

    expect(translateOrderTypeToAluna({
      from: HuobiOrderTypeEnum.BUY_STOP_LIMIT_FOK,
    })).to.be.eq(AlunaOrderTypesEnum.STOP_LIMIT)

    expect(translateOrderTypeToAluna({
      from: HuobiOrderTypeEnum.SELL_STOP_LIMIT_FOK,
    })).to.be.eq(AlunaOrderTypesEnum.STOP_LIMIT)

    expect(translateOrderTypeToAluna({
      from: HuobiOrderTypeEnum.STOP_LIMIT,
    })).to.be.eq(AlunaOrderTypesEnum.STOP_LIMIT)

    expect(translateOrderTypeToAluna({
      from: HuobiOrderTypeEnum.STOP_MARKET,
    })).to.be.eq(AlunaOrderTypesEnum.STOP_MARKET)

    let result
    let error

    try {

      result = translateOrderTypeToAluna({
        from: notSupported as HuobiOrderTypeEnum,
      })

    } catch (err) {

      error = err

    }

    expect(result).not.to.be.ok

    expect(error instanceof AlunaError).to.be.ok
    expect(error.message)
      .to.be.eq(`Order type not supported: ${notSupported}`)


  })



  it('should properly translate Aluna order types to Huobi order types', () => {

    let side = AlunaOrderSideEnum.BUY

    expect(translateOrderTypeToHuobi({
      type: AlunaOrderTypesEnum.LIMIT,
      side,
    })).to.be.eq(`${side}-limit`)

    expect(translateOrderTypeToHuobi({
      type: AlunaOrderTypesEnum.MARKET,
      side,
    })).to.be.eq(`${side}-market`)

    expect(translateOrderTypeToHuobi({
      type: AlunaOrderTypesEnum.STOP_LIMIT,
      side,
    })).to.be.eq(HuobiOrderTypeEnum.STOP_LIMIT)

    expect(translateOrderTypeToHuobi({
      type: AlunaOrderTypesEnum.STOP_MARKET,
      side,
    })).to.be.eq(HuobiOrderTypeEnum.STOP_MARKET)



    side = AlunaOrderSideEnum.SELL

    expect(translateOrderTypeToHuobi({
      type: AlunaOrderTypesEnum.LIMIT,
      side,
    })).to.be.eq(`${side}-limit`)

    expect(translateOrderTypeToHuobi({
      type: AlunaOrderTypesEnum.MARKET,
      side,
    })).to.be.eq(`${side}-market`)

    expect(translateOrderTypeToHuobi({
      type: AlunaOrderTypesEnum.STOP_LIMIT,
      side,
    })).to.be.eq(HuobiOrderTypeEnum.STOP_LIMIT)

    expect(translateOrderTypeToHuobi({
      type: AlunaOrderTypesEnum.STOP_MARKET,
      side,
    })).to.be.eq(HuobiOrderTypeEnum.STOP_MARKET)

    let result
    let error

    try {

      translateOrderTypeToHuobi({
        type: notSupported as AlunaOrderTypesEnum,
        side: AlunaOrderSideEnum.BUY,
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
