import { expect } from 'chai'

import { AlunaError } from '../../../../lib/core/AlunaError'
import { AlunaOrderTypesEnum } from '../../../../lib/enums/AlunaOrderTypesEnum'
import { SampleOrderTypeEnum } from '../SampleOrderTypeEnum'
import {
  translateOrderTypeToAluna,
  translateOrderTypeToSample,
} from './sampleOrderTypeAdapter'



describe(__filename, () => {

  const notSupported = 'not-supported'



  it('should properly translate Sample order types to Aluna order types', () => {

    expect(translateOrderTypeToAluna({
      from: SampleOrderTypeEnum.LIMIT,
    })).to.be.eq(AlunaOrderTypesEnum.LIMIT)

    expect(translateOrderTypeToAluna({
      from: SampleOrderTypeEnum.MARKET,
    })).to.be.eq(AlunaOrderTypesEnum.MARKET)

    expect(translateOrderTypeToAluna({
      from: SampleOrderTypeEnum.CEILING_LIMIT,
    })).to.be.eq(AlunaOrderTypesEnum.LIMIT_ORDER_BOOK)

    expect(translateOrderTypeToAluna({
      from: SampleOrderTypeEnum.CEILING_MARKET,
    })).to.be.eq(AlunaOrderTypesEnum.TAKE_PROFIT_MARKET)

    let result
    let error

    try {

      result = translateOrderTypeToAluna({
        from: notSupported as SampleOrderTypeEnum,
      })

    } catch (err) {

      error = err

    }

    expect(result).not.to.be.ok

    expect(error instanceof AlunaError).to.be.ok
    expect(error.message)
      .to.be.eq(`Order type not supported: ${notSupported}`)


  })



  it('should properly translate Aluna order types to Sample order types', () => {

    expect(translateOrderTypeToSample({
      from: AlunaOrderTypesEnum.LIMIT,
    })).to.be.eq(SampleOrderTypeEnum.LIMIT)

    expect(translateOrderTypeToSample({
      from: AlunaOrderTypesEnum.MARKET,
    })).to.be.eq(SampleOrderTypeEnum.MARKET)

    expect(translateOrderTypeToSample({
      from: AlunaOrderTypesEnum.LIMIT_ORDER_BOOK,
    })).to.be.eq(SampleOrderTypeEnum.CEILING_LIMIT)

    expect(translateOrderTypeToSample({
      from: AlunaOrderTypesEnum.TAKE_PROFIT_MARKET,
    })).to.be.eq(SampleOrderTypeEnum.CEILING_MARKET)

    let result
    let error

    try {

      translateOrderTypeToSample({
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
