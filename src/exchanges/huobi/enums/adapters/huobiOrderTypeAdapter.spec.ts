import { expect } from 'chai'

import { AlunaError } from '../../../../lib/core/AlunaError'
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
      from: HuobiOrderTypeEnum.LIMIT,
    })).to.be.eq(AlunaOrderTypesEnum.LIMIT)

    expect(translateOrderTypeToAluna({
      from: HuobiOrderTypeEnum.MARKET,
    })).to.be.eq(AlunaOrderTypesEnum.MARKET)

    expect(translateOrderTypeToAluna({
      from: HuobiOrderTypeEnum.CEILING_LIMIT,
    })).to.be.eq(AlunaOrderTypesEnum.LIMIT_ORDER_BOOK)

    expect(translateOrderTypeToAluna({
      from: HuobiOrderTypeEnum.CEILING_MARKET,
    })).to.be.eq(AlunaOrderTypesEnum.TAKE_PROFIT_MARKET)

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

    expect(translateOrderTypeToHuobi({
      from: AlunaOrderTypesEnum.LIMIT,
    })).to.be.eq(HuobiOrderTypeEnum.LIMIT)

    expect(translateOrderTypeToHuobi({
      from: AlunaOrderTypesEnum.MARKET,
    })).to.be.eq(HuobiOrderTypeEnum.MARKET)

    expect(translateOrderTypeToHuobi({
      from: AlunaOrderTypesEnum.LIMIT_ORDER_BOOK,
    })).to.be.eq(HuobiOrderTypeEnum.CEILING_LIMIT)

    expect(translateOrderTypeToHuobi({
      from: AlunaOrderTypesEnum.TAKE_PROFIT_MARKET,
    })).to.be.eq(HuobiOrderTypeEnum.CEILING_MARKET)

    let result
    let error

    try {

      translateOrderTypeToHuobi({
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
