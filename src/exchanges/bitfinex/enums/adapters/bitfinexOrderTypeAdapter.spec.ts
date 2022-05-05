import { expect } from 'chai'

import { AlunaError } from '../../../../lib/core/AlunaError'
import { AlunaAccountEnum } from '../../../../lib/enums/AlunaAccountEnum'
import { AlunaOrderTypesEnum } from '../../../../lib/enums/AlunaOrderTypesEnum'
import { BitfinexOrderTypeEnum } from '../BitfinexOrderTypeEnum'
import {
  translateOrderTypeToAluna,
  translateOrderTypeToBitfinex,
} from './bitfinexOrderTypeAdapter'



describe('BitfinexOrderTypeAdapter', () => {

  const notSupported = 'not-supported'

  it('should properly translate Bitfinex order types to Aluna types', () => {

    let error

    expect(translateOrderTypeToAluna({
      from: BitfinexOrderTypeEnum.LIMIT,
    })).to.be.eq(AlunaOrderTypesEnum.LIMIT)

    expect(translateOrderTypeToAluna({
      from: BitfinexOrderTypeEnum.EXCHANGE_LIMIT,
    })).to.be.eq(AlunaOrderTypesEnum.LIMIT)

    expect(translateOrderTypeToAluna({
      from: BitfinexOrderTypeEnum.MARKET,
    })).to.be.eq(AlunaOrderTypesEnum.MARKET)

    expect(translateOrderTypeToAluna({
      from: BitfinexOrderTypeEnum.EXCHANGE_MARKET,
    })).to.be.eq(AlunaOrderTypesEnum.MARKET)

    expect(translateOrderTypeToAluna({
      from: BitfinexOrderTypeEnum.STOP,
    })).to.be.eq(AlunaOrderTypesEnum.STOP_MARKET)

    expect(translateOrderTypeToAluna({
      from: BitfinexOrderTypeEnum.EXCHANGE_STOP,
    })).to.be.eq(AlunaOrderTypesEnum.STOP_MARKET)

    expect(translateOrderTypeToAluna({
      from: BitfinexOrderTypeEnum.STOP_LIMIT,
    })).to.be.eq(AlunaOrderTypesEnum.STOP_LIMIT)

    expect(translateOrderTypeToAluna({
      from: BitfinexOrderTypeEnum.EXCHANGE_STOP_LIMIT,
    })).to.be.eq(AlunaOrderTypesEnum.STOP_LIMIT)

    expect(translateOrderTypeToAluna({
      from: BitfinexOrderTypeEnum.TRAILING_STOP,
    })).to.be.eq(AlunaOrderTypesEnum.TRAILING_STOP)

    expect(translateOrderTypeToAluna({
      from: BitfinexOrderTypeEnum.EXCHANGE_TRAILING_STOP,
    })).to.be.eq(AlunaOrderTypesEnum.TRAILING_STOP)

    expect(translateOrderTypeToAluna({
      from: BitfinexOrderTypeEnum.FOK,
    })).to.be.eq(AlunaOrderTypesEnum.FILL_OF_KILL)

    expect(translateOrderTypeToAluna({
      from: BitfinexOrderTypeEnum.EXCHANGE_FOK,
    })).to.be.eq(AlunaOrderTypesEnum.FILL_OF_KILL)

    expect(translateOrderTypeToAluna({
      from: BitfinexOrderTypeEnum.IOC,
    })).to.be.eq(AlunaOrderTypesEnum.IMMEDIATE_OR_CANCEL)

    expect(translateOrderTypeToAluna({
      from: BitfinexOrderTypeEnum.EXCHANGE_IOC,
    })).to.be.eq(AlunaOrderTypesEnum.IMMEDIATE_OR_CANCEL)

    try {

      translateOrderTypeToAluna({
        from: notSupported as BitfinexOrderTypeEnum,
      })

    } catch (err) {

      error = err

    }

    expect(error).to.be.ok

    const { message } = error as AlunaError
    expect(message).to.be.eq(`Order type not supported: ${notSupported}`)

  })

  it('should properly translate Aluna order types to Bitfinex types', () => {

    let error

    expect(translateOrderTypeToBitfinex({
      from: AlunaOrderTypesEnum.LIMIT,
      account: AlunaAccountEnum.EXCHANGE,
    })).to.be.eq(BitfinexOrderTypeEnum.EXCHANGE_LIMIT)

    expect(translateOrderTypeToBitfinex({
      from: AlunaOrderTypesEnum.LIMIT,
      account: AlunaAccountEnum.MARGIN,
    })).to.be.eq(BitfinexOrderTypeEnum.LIMIT)

    expect(translateOrderTypeToBitfinex({
      from: AlunaOrderTypesEnum.MARKET,
      account: AlunaAccountEnum.EXCHANGE,
    })).to.be.eq(BitfinexOrderTypeEnum.EXCHANGE_MARKET)

    expect(translateOrderTypeToBitfinex({
      from: AlunaOrderTypesEnum.MARKET,
      account: AlunaAccountEnum.MARGIN,
    })).to.be.eq(BitfinexOrderTypeEnum.MARKET)

    expect(translateOrderTypeToBitfinex({
      from: AlunaOrderTypesEnum.STOP_MARKET,
      account: AlunaAccountEnum.EXCHANGE,
    })).to.be.eq(BitfinexOrderTypeEnum.EXCHANGE_STOP)

    expect(translateOrderTypeToBitfinex({
      from: AlunaOrderTypesEnum.STOP_MARKET,
      account: AlunaAccountEnum.MARGIN,
    })).to.be.eq(BitfinexOrderTypeEnum.STOP)

    expect(translateOrderTypeToBitfinex({
      from: AlunaOrderTypesEnum.STOP_LIMIT,
      account: AlunaAccountEnum.EXCHANGE,
    })).to.be.eq(BitfinexOrderTypeEnum.EXCHANGE_STOP_LIMIT)

    expect(translateOrderTypeToBitfinex({
      from: AlunaOrderTypesEnum.STOP_LIMIT,
      account: AlunaAccountEnum.MARGIN,
    })).to.be.eq(BitfinexOrderTypeEnum.STOP_LIMIT)

    expect(translateOrderTypeToBitfinex({
      from: AlunaOrderTypesEnum.FILL_OF_KILL,
      account: AlunaAccountEnum.EXCHANGE,
    })).to.be.eq(BitfinexOrderTypeEnum.EXCHANGE_FOK)

    expect(translateOrderTypeToBitfinex({
      from: AlunaOrderTypesEnum.FILL_OF_KILL,
      account: AlunaAccountEnum.MARGIN,
    })).to.be.eq(BitfinexOrderTypeEnum.FOK)

    expect(translateOrderTypeToBitfinex({
      from: AlunaOrderTypesEnum.IMMEDIATE_OR_CANCEL,
      account: AlunaAccountEnum.EXCHANGE,
    })).to.be.eq(BitfinexOrderTypeEnum.EXCHANGE_IOC)

    expect(translateOrderTypeToBitfinex({
      from: AlunaOrderTypesEnum.IMMEDIATE_OR_CANCEL,
      account: AlunaAccountEnum.MARGIN,
    })).to.be.eq(BitfinexOrderTypeEnum.IOC)

    try {

      translateOrderTypeToBitfinex({
        from: notSupported as AlunaOrderTypesEnum,
        account: AlunaAccountEnum.EXCHANGE,
      })

    } catch (err) {

      error = err

    }

    expect(error).to.be.ok
    expect(error.message)
      .to.be.eq(`Order type not supported: ${notSupported}`)

  })

})
