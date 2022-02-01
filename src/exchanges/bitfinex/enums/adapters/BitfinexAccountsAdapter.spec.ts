import { expect } from 'chai'

import { AlunaAccountEnum } from '../../../..'
import { AlunaError } from '../../../../lib/core/AlunaError'
import { BitfinexAccountsEnum } from '../BitfinexAccountsEnum'
import { BitfinexOrderTypesEnum } from '../BitfinexOrderTypesEnum'
import { BitfinexAccountsAdapter } from './BitfinexAccountsAdapter'



describe('BitfinexAccountsAdapter', () => {

  const notSupported = 'not-supported'

  it('should properly translate Bitfinex account to Aluna account', () => {

    expect(BitfinexAccountsAdapter.translateToAluna({
      value: BitfinexOrderTypesEnum.EXCHANGE_STOP,
    })).to.be.eq(AlunaAccountEnum.EXCHANGE)

    expect(BitfinexAccountsAdapter.translateToAluna({
      value: BitfinexOrderTypesEnum.MARKET,
    })).to.be.eq(AlunaAccountEnum.MARGIN)

    expect(BitfinexAccountsAdapter.translateToAluna({
      value: 'exchange',
    })).to.be.eq(AlunaAccountEnum.EXCHANGE)

    expect(BitfinexAccountsAdapter.translateToAluna({
      value: 'margin',
    })).to.be.eq(AlunaAccountEnum.MARGIN)

  })

  it('should properly translate Aluna account to Bitfinex account', () => {

    expect(BitfinexAccountsAdapter.translateToBitfinex({
      from: AlunaAccountEnum.EXCHANGE,
    })).to.be.eq(BitfinexAccountsEnum.EXCHANGE)

    expect(BitfinexAccountsAdapter.translateToBitfinex({
      from: AlunaAccountEnum.MARGIN,
    })).to.be.eq(BitfinexAccountsEnum.MARGIN)

    expect(BitfinexAccountsAdapter.translateToBitfinex({
      from: AlunaAccountEnum.LENDING,
    })).to.be.eq(BitfinexAccountsEnum.FUNDING)

    expect(BitfinexAccountsAdapter.translateToBitfinex({
      from: AlunaAccountEnum.DERIVATIVES,
    })).to.be.eq(BitfinexAccountsEnum.DERIVATIVES)

    try {

      BitfinexAccountsAdapter.translateToBitfinex({
        from: notSupported as AlunaAccountEnum,
      })

    } catch (err) {

      const error: AlunaError = err

      expect(error instanceof AlunaError).to.be.ok
      expect(error.message)
        .to.be.eq(`Account not supported: ${notSupported}`)

    }

  })

})
