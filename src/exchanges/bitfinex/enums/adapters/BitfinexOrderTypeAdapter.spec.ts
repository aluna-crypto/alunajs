import { expect } from 'chai'

import { AlunaAccountEnum } from '../../../..'
import { AlunaError } from '../../../../lib/core/AlunaError'
import { AlunaOrderTypesEnum } from '../../../../lib/enums/AlunaOrderTypesEnum'
import { BitfinexOrderTypesEnum } from '../BitfinexOrderTypesEnum'
import { BitfinexOrderTypeAdapter } from './BitfinexOrderTypeAdapter'



describe('BitfinexOrderTypeAdapter', () => {

  const notSupported = 'not-supported'

  it('should properly translate Bitfinex order types to Aluna types', () => {

    expect(BitfinexOrderTypeAdapter.translateToAluna({
      from: BitfinexOrderTypesEnum.LIMIT,
    })).to.be.eq(AlunaOrderTypesEnum.LIMIT)

    expect(BitfinexOrderTypeAdapter.translateToAluna({
      from: BitfinexOrderTypesEnum.EXCHANGE_LIMIT,
    })).to.be.eq(AlunaOrderTypesEnum.LIMIT)

    expect(BitfinexOrderTypeAdapter.translateToAluna({
      from: BitfinexOrderTypesEnum.MARKET,
    })).to.be.eq(AlunaOrderTypesEnum.MARKET)

    expect(BitfinexOrderTypeAdapter.translateToAluna({
      from: BitfinexOrderTypesEnum.EXCHANGE_MARKET,
    })).to.be.eq(AlunaOrderTypesEnum.MARKET)

    expect(BitfinexOrderTypeAdapter.translateToAluna({
      from: BitfinexOrderTypesEnum.STOP,
    })).to.be.eq(AlunaOrderTypesEnum.STOP_MARKET)

    expect(BitfinexOrderTypeAdapter.translateToAluna({
      from: BitfinexOrderTypesEnum.EXCHANGE_STOP,
    })).to.be.eq(AlunaOrderTypesEnum.STOP_MARKET)

    expect(BitfinexOrderTypeAdapter.translateToAluna({
      from: BitfinexOrderTypesEnum.STOP_LIMIT,
    })).to.be.eq(AlunaOrderTypesEnum.STOP_LIMIT)

    expect(BitfinexOrderTypeAdapter.translateToAluna({
      from: BitfinexOrderTypesEnum.EXCHANGE_STOP_LIMIT,
    })).to.be.eq(AlunaOrderTypesEnum.STOP_LIMIT)

    expect(BitfinexOrderTypeAdapter.translateToAluna({
      from: BitfinexOrderTypesEnum.TRAILING_STOP,
    })).to.be.eq(AlunaOrderTypesEnum.TRAILING_STOP)

    expect(BitfinexOrderTypeAdapter.translateToAluna({
      from: BitfinexOrderTypesEnum.EXCHANGE_TRAILING_STOP,
    })).to.be.eq(AlunaOrderTypesEnum.TRAILING_STOP)

    expect(BitfinexOrderTypeAdapter.translateToAluna({
      from: BitfinexOrderTypesEnum.FOK,
    })).to.be.eq(AlunaOrderTypesEnum.FILL_OF_KILL)

    expect(BitfinexOrderTypeAdapter.translateToAluna({
      from: BitfinexOrderTypesEnum.EXCHANGE_FOK,
    })).to.be.eq(AlunaOrderTypesEnum.FILL_OF_KILL)

    expect(BitfinexOrderTypeAdapter.translateToAluna({
      from: BitfinexOrderTypesEnum.IOC,
    })).to.be.eq(AlunaOrderTypesEnum.IMMEDIATE_OR_CANCEL)

    expect(BitfinexOrderTypeAdapter.translateToAluna({
      from: BitfinexOrderTypesEnum.EXCHANGE_IOC,
    })).to.be.eq(AlunaOrderTypesEnum.IMMEDIATE_OR_CANCEL)

    try {

      BitfinexOrderTypeAdapter.translateToAluna({
        from: notSupported as BitfinexOrderTypesEnum,
      })

    } catch (err) {

      expect(err instanceof AlunaError).to.be.ok

      const { message } = err as AlunaError
      expect(message).to.be.eq(`Order type not supported: ${notSupported}`)

    }

  })

  it('should properly translate Aluna order types to Bitfinex types', () => {

    expect(BitfinexOrderTypeAdapter.translateToBitfinex({
      from: AlunaOrderTypesEnum.LIMIT,
      account: AlunaAccountEnum.EXCHANGE,
    })).to.be.eq(BitfinexOrderTypesEnum.EXCHANGE_LIMIT)

    expect(BitfinexOrderTypeAdapter.translateToBitfinex({
      from: AlunaOrderTypesEnum.LIMIT,
      account: AlunaAccountEnum.MARGIN,
    })).to.be.eq(BitfinexOrderTypesEnum.LIMIT)

    expect(BitfinexOrderTypeAdapter.translateToBitfinex({
      from: AlunaOrderTypesEnum.MARKET,
      account: AlunaAccountEnum.EXCHANGE,
    })).to.be.eq(BitfinexOrderTypesEnum.EXCHANGE_MARKET)

    expect(BitfinexOrderTypeAdapter.translateToBitfinex({
      from: AlunaOrderTypesEnum.MARKET,
      account: AlunaAccountEnum.MARGIN,
    })).to.be.eq(BitfinexOrderTypesEnum.MARKET)

    expect(BitfinexOrderTypeAdapter.translateToBitfinex({
      from: AlunaOrderTypesEnum.STOP_MARKET,
      account: AlunaAccountEnum.EXCHANGE,
    })).to.be.eq(BitfinexOrderTypesEnum.EXCHANGE_STOP)

    expect(BitfinexOrderTypeAdapter.translateToBitfinex({
      from: AlunaOrderTypesEnum.STOP_MARKET,
      account: AlunaAccountEnum.MARGIN,
    })).to.be.eq(BitfinexOrderTypesEnum.STOP)

    expect(BitfinexOrderTypeAdapter.translateToBitfinex({
      from: AlunaOrderTypesEnum.STOP_LIMIT,
      account: AlunaAccountEnum.EXCHANGE,
    })).to.be.eq(BitfinexOrderTypesEnum.EXCHANGE_STOP_LIMIT)

    expect(BitfinexOrderTypeAdapter.translateToBitfinex({
      from: AlunaOrderTypesEnum.STOP_LIMIT,
      account: AlunaAccountEnum.MARGIN,
    })).to.be.eq(BitfinexOrderTypesEnum.STOP_LIMIT)

    expect(BitfinexOrderTypeAdapter.translateToBitfinex({
      from: AlunaOrderTypesEnum.FILL_OF_KILL,
      account: AlunaAccountEnum.EXCHANGE,
    })).to.be.eq(BitfinexOrderTypesEnum.EXCHANGE_FOK)

    expect(BitfinexOrderTypeAdapter.translateToBitfinex({
      from: AlunaOrderTypesEnum.FILL_OF_KILL,
      account: AlunaAccountEnum.MARGIN,
    })).to.be.eq(BitfinexOrderTypesEnum.FOK)

    expect(BitfinexOrderTypeAdapter.translateToBitfinex({
      from: AlunaOrderTypesEnum.IMMEDIATE_OR_CANCEL,
      account: AlunaAccountEnum.EXCHANGE,
    })).to.be.eq(BitfinexOrderTypesEnum.EXCHANGE_IOC)

    expect(BitfinexOrderTypeAdapter.translateToBitfinex({
      from: AlunaOrderTypesEnum.IMMEDIATE_OR_CANCEL,
      account: AlunaAccountEnum.MARGIN,
    })).to.be.eq(BitfinexOrderTypesEnum.IOC)

    try {

      BitfinexOrderTypeAdapter.translateToBitfinex({
        from: notSupported as AlunaOrderTypesEnum,
        account: AlunaAccountEnum.EXCHANGE,
      })

    } catch (err) {

      const error: AlunaError = err

      expect(error instanceof AlunaError).to.be.ok
      expect(error.message)
        .to.be.eq(`Order type not supported: ${notSupported}`)

    }

  })

})
