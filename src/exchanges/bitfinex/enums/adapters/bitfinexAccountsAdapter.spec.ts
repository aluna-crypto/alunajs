import { expect } from 'chai'

import { AlunaError } from '../../../../lib/core/AlunaError'
import { AlunaAccountEnum } from '../../../../lib/enums/AlunaAccountEnum'
import { BitfinexAccountsEnum } from '../BitfinexAccountsEnum'
import { BitfinexOrderTypeEnum } from '../BitfinexOrderTypeEnum'
import {
  translateAccountToAluna,
  translateToBitfinex,
} from './bitfinexAccountsAdapter'



describe('BitfinexAccountsAdapter', () => {

  const notSupported = 'not-supported'

  it('should properly translate Bitfinex account to Aluna account', () => {

    expect(translateAccountToAluna({
      value: BitfinexOrderTypeEnum.EXCHANGE_STOP,
    })).to.be.eq(AlunaAccountEnum.EXCHANGE)

    expect(translateAccountToAluna({
      value: BitfinexOrderTypeEnum.MARKET,
    })).to.be.eq(AlunaAccountEnum.MARGIN)

    expect(translateAccountToAluna({
      value: BitfinexAccountsEnum.EXCHANGE,
    })).to.be.eq(AlunaAccountEnum.EXCHANGE)

    expect(translateAccountToAluna({
      value: BitfinexAccountsEnum.MARGIN,
    })).to.be.eq(AlunaAccountEnum.MARGIN)

  })

  it('should properly translate Aluna account to Bitfinex account', () => {

    let error

    expect(translateToBitfinex({
      from: AlunaAccountEnum.EXCHANGE,
    })).to.be.eq(BitfinexAccountsEnum.EXCHANGE)

    expect(translateToBitfinex({
      from: AlunaAccountEnum.MARGIN,
    })).to.be.eq(BitfinexAccountsEnum.MARGIN)

    expect(translateToBitfinex({
      from: AlunaAccountEnum.LENDING,
    })).to.be.eq(BitfinexAccountsEnum.FUNDING)

    expect(translateToBitfinex({
      from: AlunaAccountEnum.DERIVATIVES,
    })).to.be.eq(BitfinexAccountsEnum.DERIVATIVES)

    try {

      translateToBitfinex({
        from: notSupported as AlunaAccountEnum,
      })

    } catch (err) {

      error = err

    }

    expect(error instanceof AlunaError).to.be.ok
    expect(error.message)
      .to.be.eq(`Account not supported: ${notSupported}`)

  })

})
