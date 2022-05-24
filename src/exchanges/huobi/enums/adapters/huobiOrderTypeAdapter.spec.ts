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
      from: HuobiOrderTypeEnum.STOP_LIMIT,
    })).to.be.eq(AlunaOrderTypesEnum.STOP_LIMIT)

    expect(translateOrderTypeToAluna({
      from: HuobiOrderTypeEnum.IOC,
    })).to.be.eq(AlunaOrderTypesEnum.IMMEDIATE_OR_CANCEL)

    expect(translateOrderTypeToAluna({
      from: HuobiOrderTypeEnum.LIMIT_FOK,
    })).to.be.eq(AlunaOrderTypesEnum.FILL_OF_KILL)

    expect(translateOrderTypeToAluna({
      from: HuobiOrderTypeEnum.LIMIT_MAKER,
    })).to.be.eq(AlunaOrderTypesEnum.LIMIT)

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
      from: AlunaOrderTypesEnum.STOP_LIMIT,
    })).to.be.eq(HuobiOrderTypeEnum.STOP_LIMIT)

    expect(translateOrderTypeToHuobi({
      from: AlunaOrderTypesEnum.IMMEDIATE_OR_CANCEL,
    })).to.be.eq(HuobiOrderTypeEnum.IOC)

    expect(translateOrderTypeToHuobi({
      from: AlunaOrderTypesEnum.FILL_OF_KILL,
    })).to.be.eq(HuobiOrderTypeEnum.LIMIT_FOK)

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
