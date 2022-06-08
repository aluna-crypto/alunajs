import { expect } from 'chai'

import { AlunaError } from '../../../../lib/core/AlunaError'
import { AlunaOrderTypesEnum } from '../../../../lib/enums/AlunaOrderTypesEnum'
import { HuobiConditionalOrderTypeEnum } from '../HuobiConditionalOrderTypeEnum'
import {
  translateConditionalOrderTypeToAluna,
  translateConditionalOrderTypeToHuobi,
} from './huobiConditionalOrderTypeAdapter'



describe(__filename, () => {

  const notSupported = 'not-supported'



  it('should properly translate Huobi order types to Aluna order types', () => {

    expect(translateConditionalOrderTypeToAluna({
      from: HuobiConditionalOrderTypeEnum.LIMIT,
    })).to.be.eq(AlunaOrderTypesEnum.STOP_LIMIT)

    expect(translateConditionalOrderTypeToAluna({
      from: HuobiConditionalOrderTypeEnum.MARKET,
    })).to.be.eq(AlunaOrderTypesEnum.STOP_MARKET)

    let result
    let error

    try {

      result = translateConditionalOrderTypeToAluna({
        from: notSupported as HuobiConditionalOrderTypeEnum,
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

    expect(translateConditionalOrderTypeToHuobi({
      from: AlunaOrderTypesEnum.STOP_LIMIT,
    })).to.be.eq(HuobiConditionalOrderTypeEnum.LIMIT)

    expect(translateConditionalOrderTypeToHuobi({
      from: AlunaOrderTypesEnum.STOP_MARKET,
    })).to.be.eq(HuobiConditionalOrderTypeEnum.MARKET)

    let result
    let error

    try {

      translateConditionalOrderTypeToHuobi({
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
