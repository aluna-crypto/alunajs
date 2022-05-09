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
