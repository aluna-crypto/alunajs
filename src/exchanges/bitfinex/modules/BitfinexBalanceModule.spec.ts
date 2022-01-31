import { expect } from 'chai'
import { ImportMock } from 'ts-mock-imports'

import { IAlunaKeySecretSchema } from '../../..'
import { IAlunaExchange } from '../../../lib/core/IAlunaExchange'
import { BitfinexHttp } from '../BitfinexHttp'
import { BitfinexAccountsEnum } from '../enums/BitfinexAccountsEnum'
import { BitfinexBalanceParser } from '../schemas/parsers/BitifnexBalanceParser'
import {
  BITFINEX_PARSED_BALANCES,
  BITFINEX_RAW_BALANCES,
} from '../test/fixtures/bitfinexBalances'
import { BitfinexBalanceModule } from './BitfinexBalanceModule'



describe('BitfinexBalanceModule', () => {

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

  it('should parse a single Bitfinex raw balance just fine', async () => {

    const balanceParserMock = ImportMock.mockFunction(
      BitfinexBalanceParser,
      'parser',
      BITFINEX_PARSED_BALANCES[0],
    )

    const parsedBalance = bitfinexBalanceModule.parse({
      rawBalance: BITFINEX_RAW_BALANCES[0],
    })

    expect(balanceParserMock.callCount).to.be.eq(1)
    expect(balanceParserMock.calledWithExactly({
      rawBalance: BITFINEX_RAW_BALANCES[0],
    })).to.be.ok
    expect(parsedBalance).to.deep.eq(balanceParserMock.returnValues[0])

    // new mocking
    balanceParserMock.returns(BITFINEX_PARSED_BALANCES[2])

    const parsedBalance2 = bitfinexBalanceModule.parse({
      rawBalance: BITFINEX_RAW_BALANCES[2],
    })

    expect(balanceParserMock.callCount).to.be.eq(2)
    expect(balanceParserMock.calledWithExactly({
      rawBalance: BITFINEX_RAW_BALANCES[2],
    })).to.be.ok
    expect(parsedBalance2).to.deep.eq(balanceParserMock.returnValues[1])


    // new mocking
    balanceParserMock.returns(BITFINEX_PARSED_BALANCES[5])

    const parsedBalance3 = bitfinexBalanceModule.parse({
      rawBalance: BITFINEX_RAW_BALANCES[5],
    })

    expect(balanceParserMock.callCount).to.be.eq(3)
    expect(balanceParserMock.calledWithExactly({
      rawBalance: BITFINEX_RAW_BALANCES[5],
    })).to.be.ok
    expect(parsedBalance3).to.deep.eq(balanceParserMock.returnValues[2])

  })

  it('should list Bitfinex parsed balances just fine', async () => {

    const listRawMock = ImportMock.mockFunction(
      bitfinexBalanceModule,
      'listRaw',
      Promise.resolve(BITFINEX_RAW_BALANCES),
    )

    const parseManyMock = ImportMock.mockFunction(
      bitfinexBalanceModule,
      'parseMany',
      BITFINEX_PARSED_BALANCES,
    )

    const parsedBalances = await bitfinexBalanceModule.list()

    expect(listRawMock.callCount).to.be.eq(1)

    expect(parseManyMock.callCount).to.be.eq(1)
    expect(parseManyMock.calledWithExactly({
      rawBalances: BITFINEX_RAW_BALANCES,
    })).to.be.ok

    expect(parsedBalances).to.deep.eq(parseManyMock.returnValues[0])

  })

})
