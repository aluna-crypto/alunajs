import { expect } from 'chai'

import { AlunaError } from '../../../../lib/core/AlunaError'
import { AlunaOrderTypesEnum } from '../../../../lib/enums/AlunaOrderTypesEnum'
import { FtxOrderTypeEnum } from '../FtxOrderTypeEnum'
import { FtxTriggerOrderTypeEnum } from '../FtxTriggerOrderTypeEnum'
import {
  translateOrderTypeToAluna,
  translateOrderTypeToFtx,
} from './ftxOrderTypeAdapter'



describe(__filename, () => {

  const notSupported = 'not-supported'

  it('should properly translate Ftx order types to Aluna order types', () => {

    // common order types
    expect(translateOrderTypeToAluna({
      type: FtxOrderTypeEnum.LIMIT,
    })).to.be.eq(AlunaOrderTypesEnum.LIMIT)

    expect(translateOrderTypeToAluna({
      type: FtxOrderTypeEnum.MARKET,
    })).to.be.eq(AlunaOrderTypesEnum.MARKET)


    // trigger order types
    expect(translateOrderTypeToAluna({
      type: FtxTriggerOrderTypeEnum.STOP,
      orderType: FtxOrderTypeEnum.LIMIT,
    })).to.be.eq(AlunaOrderTypesEnum.STOP_LIMIT)

    expect(translateOrderTypeToAluna({
      type: FtxTriggerOrderTypeEnum.STOP,
      orderType: FtxOrderTypeEnum.MARKET,
    })).to.be.eq(AlunaOrderTypesEnum.STOP_MARKET)

    expect(translateOrderTypeToAluna({
      type: FtxTriggerOrderTypeEnum.TAKE_PROFIT,
      orderType: FtxOrderTypeEnum.LIMIT,
    })).to.be.eq(AlunaOrderTypesEnum.TAKE_PROFIT_LIMIT)

    expect(translateOrderTypeToAluna({
      type: FtxTriggerOrderTypeEnum.TAKE_PROFIT,
      orderType: FtxOrderTypeEnum.MARKET,
    })).to.be.eq(AlunaOrderTypesEnum.TAKE_PROFIT_MARKET)

    expect(translateOrderTypeToAluna({
      type: FtxTriggerOrderTypeEnum.TRAILING_STOP,
      orderType: FtxOrderTypeEnum.LIMIT,
    })).to.be.eq(AlunaOrderTypesEnum.TRAILING_STOP)

    expect(translateOrderTypeToAluna({
      type: FtxTriggerOrderTypeEnum.TRAILING_STOP,
      orderType: FtxOrderTypeEnum.MARKET,
    })).to.be.eq(AlunaOrderTypesEnum.TRAILING_STOP)

  })



  it('should properly translate Aluna order types to Ftx order types', () => {

    expect(translateOrderTypeToFtx({
      from: AlunaOrderTypesEnum.LIMIT,
    })).to.be.eq(FtxOrderTypeEnum.LIMIT)

    expect(translateOrderTypeToFtx({
      from: AlunaOrderTypesEnum.MARKET,
    })).to.be.eq(FtxOrderTypeEnum.MARKET)

    expect(translateOrderTypeToFtx({
      from: AlunaOrderTypesEnum.STOP_LIMIT,
    })).to.be.eq(FtxTriggerOrderTypeEnum.STOP)

    expect(translateOrderTypeToFtx({
      from: AlunaOrderTypesEnum.STOP_MARKET,
    })).to.be.eq(FtxTriggerOrderTypeEnum.STOP)

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
