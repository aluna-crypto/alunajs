import { expect } from 'chai'
import { ImportMock } from 'ts-mock-imports'

import { IAlunaKeySecretSchema } from '../../..'
import { IAlunaExchange } from '../../../lib/core/IAlunaExchange'
import { BitfinexHttp } from '../BitfinexHttp'
import { BitfinexAccountsEnum } from '../enums/BitfinexAccountsEnum'
import {
  BITFINEX_PARSED_BALANCES,
  BITFINEX_RAW_BALANCES,
} from '../test/fixtures/bitfinexBalances'
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

  it('should parse many Bitfinex raw balances', async () => {

    const parseMock = ImportMock.mockFunction(
      bitfinexBalanceModule,
      'parse',
    )

    BITFINEX_PARSED_BALANCES.forEach((parsed, i) => {

      parseMock.onCall(i).returns(parsed)

    })


    const balances = bitfinexBalanceModule.parseMany({
      rawBalances: BITFINEX_RAW_BALANCES,
    })

    expect(balances).to.deep.eq(BITFINEX_PARSED_BALANCES)

    // should ignore 'lending' balance
    expect(parseMock.callCount).to.be.eq(BITFINEX_RAW_BALANCES.length - 1)

    BITFINEX_RAW_BALANCES.forEach((raw) => {

      if (raw[0] === BitfinexAccountsEnum.FUNDING) {

        return

      }

      expect(parseMock.calledWithExactly({
        rawBalance: raw,
      })).to.be.ok

    })

  })

})
