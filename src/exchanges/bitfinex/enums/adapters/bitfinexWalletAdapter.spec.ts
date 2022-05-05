import { expect } from 'chai'

import { AlunaError } from '../../../../lib/core/AlunaError'
import { AlunaWalletEnum } from '../../../../lib/enums/AlunaWalletEnum'
import { BitfinexAccountsEnum } from '../BitfinexAccountsEnum'
import {
  translateWalletToAluna,
  translateWalletToBitfinex,
} from './bitfinexWalletAdapter'



describe(__filename, () => {

  const notSupported = 'not-supported'

  it('should properly translate Bitfinex wallet to Aluna wallets', () => {

    let error

    expect(translateWalletToAluna({
      from: BitfinexAccountsEnum.EXCHANGE,
    })).to.be.eq(AlunaWalletEnum.EXCHANGE)

    expect(translateWalletToAluna({
      from: BitfinexAccountsEnum.FUNDING,
    })).to.be.eq(AlunaWalletEnum.FUNDING)

    expect(translateWalletToAluna({
      from: BitfinexAccountsEnum.DERIVATIVES,
    })).to.be.eq(AlunaWalletEnum.DERIVATIVES)

    expect(translateWalletToAluna({
      from: BitfinexAccountsEnum.MARGIN,
    })).to.be.eq(AlunaWalletEnum.MARGIN)


    try {

      translateWalletToAluna({
        from: notSupported as BitfinexAccountsEnum,
      })

    } catch (err) {

      error = err

    }

    expect(error).to.be.ok

    const { message } = error as AlunaError
    expect(message).to.be.eq(`Wallet type not supported: ${notSupported}`)

  })

  it('should properly translate Aluna wallet to Bitfinex wallet', () => {

    let error

    expect(translateWalletToBitfinex({
      from: AlunaWalletEnum.EXCHANGE,
    })).to.be.eq(BitfinexAccountsEnum.EXCHANGE)

    expect(translateWalletToBitfinex({
      from: AlunaWalletEnum.FUNDING,
    })).to.be.eq(BitfinexAccountsEnum.FUNDING)

    expect(translateWalletToBitfinex({
      from: AlunaWalletEnum.MARGIN,
    })).to.be.eq(BitfinexAccountsEnum.MARGIN)

    expect(translateWalletToBitfinex({
      from: AlunaWalletEnum.DERIVATIVES,
    })).to.be.eq(BitfinexAccountsEnum.DERIVATIVES)

    try {

      translateWalletToBitfinex({
        from: notSupported as AlunaWalletEnum,
      })

    } catch (err) {

      error = err

    }

    expect(error).to.be.ok
    expect(error.message)
      .to.be.eq(`Wallet type not supported: ${notSupported}`)

  })

})
