import { expect } from 'chai'

import { AlunaError } from '../../../../lib/core/AlunaError'
import { AlunaOrderTypesEnum } from '../../../../lib/enums/AlunaOrderTypesEnum'
import { FtxOrderTypeEnum } from '../FtxOrderTypeEnum'
import {
  translateOrderTypeToAluna,
  translateOrderTypeToFtx,
} from './ftxOrderTypeAdapter'



describe(__filename, () => {

  const notSupported = 'not-supported'



  it('should properly translate Ftx order types to Aluna order types', () => {

    expect(translateOrderTypeToAluna({
      from: FtxOrderTypeEnum.LIMIT,
    })).to.be.eq(AlunaOrderTypesEnum.LIMIT)

    expect(translateOrderTypeToAluna({
      from: FtxOrderTypeEnum.MARKET,
    })).to.be.eq(AlunaOrderTypesEnum.MARKET)

    let result
    let error

    try {

      result = translateOrderTypeToAluna({
        from: notSupported as FtxOrderTypeEnum,
      })

    } catch (err) {

      error = err

    }

    expect(result).not.to.be.ok

    expect(error instanceof AlunaError).to.be.ok
    expect(error.message)
      .to.be.eq(`Order type not supported: ${notSupported}`)


  })



  it('should properly translate Aluna order types to Ftx order types', () => {

    expect(translateOrderTypeToFtx({
      from: AlunaOrderTypesEnum.LIMIT,
    })).to.be.eq(FtxOrderTypeEnum.LIMIT)

    expect(translateOrderTypeToFtx({
      from: AlunaOrderTypesEnum.MARKET,
    })).to.be.eq(FtxOrderTypeEnum.MARKET)

    let result
    let error

    try {

      translateOrderTypeToFtx({
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
