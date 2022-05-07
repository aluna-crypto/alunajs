import { expect } from 'chai'

import { AlunaError } from '../../../../lib/core/AlunaError'
import { AlunaOrderTypesEnum } from '../../../../lib/enums/AlunaOrderTypesEnum'
import { GateOrderTypeEnum } from '../GateOrderTypeEnum'
import {
  translateOrderTypeToAluna,
  translateOrderTypeToGate,
} from './gateOrderTypeAdapter'



describe(__filename, () => {

  const notSupported = 'not-supported'



  it('should properly translate Gate order types to Aluna order types', () => {

    expect(translateOrderTypeToAluna({
      from: GateOrderTypeEnum.LIMIT,
    })).to.be.eq(AlunaOrderTypesEnum.LIMIT)

    expect(translateOrderTypeToAluna({
      from: GateOrderTypeEnum.MARKET,
    })).to.be.eq(AlunaOrderTypesEnum.MARKET)

    expect(translateOrderTypeToAluna({
      from: GateOrderTypeEnum.CEILING_LIMIT,
    })).to.be.eq(AlunaOrderTypesEnum.LIMIT_ORDER_BOOK)

    expect(translateOrderTypeToAluna({
      from: GateOrderTypeEnum.CEILING_MARKET,
    })).to.be.eq(AlunaOrderTypesEnum.TAKE_PROFIT_MARKET)

    let result
    let error

    try {

      result = translateOrderTypeToAluna({
        from: notSupported as GateOrderTypeEnum,
      })

    } catch (err) {

      error = err

    }

    expect(result).not.to.be.ok

    expect(error instanceof AlunaError).to.be.ok
    expect(error.message).to.be.eq(`Order type not supported: ${notSupported}`)


  })



  it('should properly translate Aluna order types to Gate order types', () => {

    expect(translateOrderTypeToGate({
      from: AlunaOrderTypesEnum.LIMIT,
    })).to.be.eq(GateOrderTypeEnum.LIMIT)

    expect(translateOrderTypeToGate({
      from: AlunaOrderTypesEnum.MARKET,
    })).to.be.eq(GateOrderTypeEnum.MARKET)

    expect(translateOrderTypeToGate({
      from: AlunaOrderTypesEnum.LIMIT_ORDER_BOOK,
    })).to.be.eq(GateOrderTypeEnum.CEILING_LIMIT)

    expect(translateOrderTypeToGate({
      from: AlunaOrderTypesEnum.TAKE_PROFIT_MARKET,
    })).to.be.eq(GateOrderTypeEnum.CEILING_MARKET)

    let result
    let error

    try {

      translateOrderTypeToGate({
        from: notSupported as AlunaOrderTypesEnum,
      })

    } catch (err) {

      error = err

    }


    expect(result).not.to.be.ok
    expect(error instanceof AlunaError).to.be.ok
    expect(error.message).to.be.eq(`Order type not supported: ${notSupported}`)

  })

})
