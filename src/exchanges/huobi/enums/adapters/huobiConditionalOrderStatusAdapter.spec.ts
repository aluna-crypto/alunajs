import { expect } from 'chai'

import { AlunaError } from '../../../../lib/core/AlunaError'
import { AlunaOrderStatusEnum } from '../../../../lib/enums/AlunaOrderStatusEnum'
import { HuobiConditionalOrderStatusEnum } from '../HuobiConditionalOrderStatusEnum'
import {
  translateConditionalOrderStatusToAluna,
  translateConditionalOrderStatusToHuobi,
} from './huobiConditionalOrderStatusAdapter'



describe(__filename, () => {

  const notSupported = 'not-supported'



  it('should properly translate Huobi order types to Aluna order types', () => {

    expect(translateConditionalOrderStatusToAluna({
      from: HuobiConditionalOrderStatusEnum.CREATED,
    })).to.be.eq(AlunaOrderStatusEnum.OPEN)

    expect(translateConditionalOrderStatusToAluna({
      from: HuobiConditionalOrderStatusEnum.TRIGGERED,
    })).to.be.eq(AlunaOrderStatusEnum.FILLED)

    expect(translateConditionalOrderStatusToAluna({
      from: HuobiConditionalOrderStatusEnum.CANCELED,
    })).to.be.eq(AlunaOrderStatusEnum.CANCELED)

    expect(translateConditionalOrderStatusToAluna({
      from: HuobiConditionalOrderStatusEnum.REJECTED,
    })).to.be.eq(AlunaOrderStatusEnum.CANCELED)

    let result
    let error

    try {

      result = translateConditionalOrderStatusToAluna({
        from: notSupported as HuobiConditionalOrderStatusEnum,
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

    expect(translateConditionalOrderStatusToHuobi({
      from: AlunaOrderStatusEnum.OPEN,
    })).to.be.eq(HuobiConditionalOrderStatusEnum.CREATED)

    expect(translateConditionalOrderStatusToHuobi({
      from: AlunaOrderStatusEnum.CANCELED,
    })).to.be.eq(HuobiConditionalOrderStatusEnum.CANCELED)

    expect(translateConditionalOrderStatusToHuobi({
      from: AlunaOrderStatusEnum.FILLED,
    })).to.be.eq(HuobiConditionalOrderStatusEnum.TRIGGERED)

    let result
    let error

    try {

      translateConditionalOrderStatusToHuobi({
        from: notSupported as AlunaOrderStatusEnum,
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
