import { expect } from 'chai'
import { ImportMock } from 'ts-mock-imports'

import { IAlunaKeySecretSchema } from '../../..'
import { IAlunaExchange } from '../../../lib/core/IAlunaExchange'
import { BitfinexHttp } from '../BitfinexHttp'
import { BITFINEX_RAW_BALANCES } from '../test/fixtures/bitfinexBalances'
import { BitfinexBalanceModule } from './BitfinexBalanceModule'



describe.only('BitfinexBalanceModule', () => {

  const bitfinexBalanceModule = BitfinexBalanceModule.prototype

  const keySecret: IAlunaKeySecretSchema = {
    key: '',
    secret: '',
  }

  const mockKeySecret = () => {

    const exchangeMock = ImportMock.mockOther(
      bitfinexBalanceModule,
      'exchange',
      { keySecret } as IAlunaExchange,
    )

    return { exchangeMock }

  }

  it('should list all Bitfinex raw balances', async () => {

    const { exchangeMock } = mockKeySecret()

    const requestMock = ImportMock.mockFunction(
      BitfinexHttp,
      'privateRequest',
      BITFINEX_RAW_BALANCES,
    )

    const rawBalances = await bitfinexBalanceModule.listRaw()

    expect(requestMock.callCount).to.be.eq(1)
    expect(requestMock.calledWith({
      url: 'https://api.bitfinex.com/v2/auth/r/wallets',
      keySecret: exchangeMock.getValue().keySecret,
    })).to.be.ok

    expect(rawBalances.length).to.eq(7)
    expect(rawBalances).to.deep.eq(BITFINEX_RAW_BALANCES)

  })

})
