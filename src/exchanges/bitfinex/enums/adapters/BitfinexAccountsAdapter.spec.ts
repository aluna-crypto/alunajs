import { expect } from 'chai'

import { AlunaAccountEnum } from '../../../..'
import { AlunaError } from '../../../../lib/core/AlunaError'
import { BitfinexAccountsEnum } from '../BitfinexAccountsEnum'
import { BitfinexAccountsAdapter } from './BitfinexAccountsAdapter'



describe('BitfinexAccountsAdapter', () => {

  const notSupported = 'not-supported'

  it('should properly translate Bitfinex account to Aluna account', () => {

    expect(BitfinexAccountsAdapter.translateToAluna({
      from: BitfinexAccountsEnum.EXCHANGE,
    })).to.be.eq(AlunaAccountEnum.EXCHANGE)

    expect(BitfinexAccountsAdapter.translateToAluna({
      from: BitfinexAccountsEnum.MARGIN,
    })).to.be.eq(AlunaAccountEnum.MARGIN)

    expect(BitfinexAccountsAdapter.translateToAluna({
      from: BitfinexAccountsEnum.FUNDING,
    })).to.be.eq(AlunaAccountEnum.LENDING)

    expect(BitfinexAccountsAdapter.translateToAluna({
      from: BitfinexAccountsEnum.DERIV,
    })).to.be.eq(AlunaAccountEnum.DERIVATIVES)

    try {

      BitfinexAccountsAdapter.translateToAluna({
        from: notSupported as BitfinexAccountsEnum,
      })

    } catch (err) {

      expect(err instanceof AlunaError).to.be.ok

      const { message } = err as AlunaError
      expect(message).to.be.eq(`Account not supported: ${notSupported}`)

    }

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
    })).to.be.eq(BitfinexAccountsEnum.DERIV)

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
