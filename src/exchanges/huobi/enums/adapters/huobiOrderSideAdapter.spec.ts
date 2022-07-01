import { expect } from 'chai'
import {
  each,
  filter,
  values,
} from 'lodash'

import { AlunaError } from '../../../../lib/core/AlunaError'
import { AlunaOrderSideEnum } from '../../../../lib/enums/AlunaOrderSideEnum'
import { AlunaGenericErrorCodes } from '../../../../lib/errors/AlunaGenericErrorCodes'
import { executeAndCatch } from '../../../../utils/executeAndCatch'
import { HuobiOrderSideEnum } from '../HuobiOrderSideEnum'
import { HuobiOrderTypeEnum } from '../HuobiOrderTypeEnum'
import {
  translateOrderSideToAluna,
  translateOrderSideToHuobi,
} from './huobiOrderSideAdapter'



describe(__filename, () => {

  const notSupported = 'not-supported'

  it('should properly translate Huobi order sides to Aluna order sides', async () => {

    expect(translateOrderSideToAluna({
      orderSide: HuobiOrderSideEnum.BUY,
    })).to.be.eq(AlunaOrderSideEnum.BUY)

    expect(translateOrderSideToAluna({
      orderSide: HuobiOrderSideEnum.SELL,
    })).to.be.eq(AlunaOrderSideEnum.SELL)

    const nonConditionalOrdersTypes = filter(values(HuobiOrderTypeEnum), (value) => {
      return (value !== HuobiOrderTypeEnum.STOP_LIMIT)
        && (value !== HuobiOrderTypeEnum.STOP_MARKET)
    })

    each(nonConditionalOrdersTypes, (type) => {

      const [side] = type.split(/-/)

      const translated = translateOrderSideToAluna({
        type,
      })

      const alunaSide = side === 'buy'
        ? AlunaOrderSideEnum.BUY
        : AlunaOrderSideEnum.SELL

      expect(translated).to.be.eq(alunaSide)

    })

    const res = await executeAndCatch(() => translateOrderSideToAluna({}))

    expect(res.result).not.to.be.ok

    const msg = 'At least one of the params are required for translating Huobi order side'

    expect(res.error!.code).to.be.eq(AlunaGenericErrorCodes.PARAM_ERROR)
    expect(res.error!.message).to.be.eq(msg)

  })



  it('should properly translate Aluna order sides to Huobi order sides', () => {

    expect(translateOrderSideToHuobi({
      from: AlunaOrderSideEnum.BUY,
    })).to.be.eq(HuobiOrderSideEnum.BUY)

    expect(translateOrderSideToHuobi({
      from: AlunaOrderSideEnum.SELL,
    })).to.be.eq(HuobiOrderSideEnum.SELL)

    let result
    let error

    try {

      result = translateOrderSideToHuobi({
        from: notSupported as AlunaOrderSideEnum,
      })

    } catch (err) {

      error = err

    }

    expect(result).not.to.be.ok
    expect(error instanceof AlunaError).to.be.ok
    expect(error.message)
      .to.be.eq(`Order side not supported: ${notSupported}`)

  })

})
