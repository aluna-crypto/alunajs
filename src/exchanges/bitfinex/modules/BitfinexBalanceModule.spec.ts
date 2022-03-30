import { expect } from 'chai'
import { ImportMock } from 'ts-mock-imports'

import { IAlunaExchange } from '../../../lib/core/IAlunaExchange'
import { AlunaAccountEnum } from '../../../lib/enums/AlunaAccountEnum'
import { AlunaOrderSideEnum } from '../../../lib/enums/AlunaOrderSideEnum'
import { IAlunaBalanceGetTradableBalanceParams } from '../../../lib/modules/IAlunaBalanceModule'
import { IAlunaKeySecretSchema } from '../../../lib/schemas/IAlunaKeySecretSchema'
import { mockValidateParams } from '../../../utils/validation/validateParams.mock'
import { BitfinexHttp } from '../BitfinexHttp'
import { BitfinexAccountsEnum } from '../enums/BitfinexAccountsEnum'
import { BitfinexBalanceParser } from '../schemas/parsers/BitfnexBalanceParser'
import {
  BITFINEX_PARSED_BALANCES,
  BITFINEX_RAW_BALANCES,
} from '../test/fixtures/bitfinexBalances'
import { bitfinexGetTradableBalanceParamsSchema } from '../validation/bitfinexTradableBalanceParamsSchema'
import { BitfinexBalanceModule } from './BitfinexBalanceModule'



describe('BitfinexBalanceModule', () => {

  const bitfinexBalanceModule = BitfinexBalanceModule.prototype

  const keySecret: IAlunaKeySecretSchema = {
    key: '',
    secret: '',
  }

  const mockExchange = () => {

    const exchangeMock = ImportMock.mockOther(
      bitfinexBalanceModule,
      'exchange',
      {
        keySecret,
      } as IAlunaExchange,
    )

    return { exchangeMock }

  }

  it('should list all Bitfinex raw balances', async () => {

    const { exchangeMock } = mockExchange()

    const requestMock = ImportMock.mockFunction(
      BitfinexHttp,
      'privateRequest',
      {
        data: BITFINEX_RAW_BALANCES,
        apiRequestCount: 1,
      },
    )

    const { rawBalances } = await bitfinexBalanceModule.listRaw()

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

      parseMock.onCall(i).returns({
        balance: parsed,
        apiRequestCount: 1,
      })

    })


    const { balances } = bitfinexBalanceModule.parseMany({
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

    mockExchange()

    const balanceParserMock = ImportMock.mockFunction(
      BitfinexBalanceParser,
      'parse',
      BITFINEX_PARSED_BALANCES[0],
    )

    const { balance: parsedBalance } = bitfinexBalanceModule.parse({
      rawBalance: BITFINEX_RAW_BALANCES[0],
    })

    expect(balanceParserMock.callCount).to.be.eq(1)
    expect(balanceParserMock.calledWithExactly({
      rawBalance: BITFINEX_RAW_BALANCES[0],
    })).to.be.ok

    expect(parsedBalance).to.deep.eq(balanceParserMock.returnValues[0])

    // new mocking
    balanceParserMock.returns(BITFINEX_PARSED_BALANCES[2])

    const { balance: parsedBalance2 } = bitfinexBalanceModule.parse({
      rawBalance: BITFINEX_RAW_BALANCES[2],
    })

    expect(balanceParserMock.callCount).to.be.eq(2)
    expect(balanceParserMock.calledWithExactly({
      rawBalance: BITFINEX_RAW_BALANCES[2],
    })).to.be.ok
    expect(parsedBalance2).to.deep.eq(balanceParserMock.returnValues[1])


    // new mocking
    balanceParserMock.returns(BITFINEX_PARSED_BALANCES[5])

    const { balance: parsedBalance3 } = bitfinexBalanceModule.parse({
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
      Promise.resolve({
        rawBalances: BITFINEX_RAW_BALANCES,
        apiRequestCount: 1,
      }),
    )

    const parseManyMock = ImportMock.mockFunction(
      bitfinexBalanceModule,
      'parseMany',
      {
        balances: BITFINEX_PARSED_BALANCES,
        apiRequestCount: 1,
      },
    )

    const { balances: parsedBalances } = await bitfinexBalanceModule.list()

    expect(listRawMock.callCount).to.be.eq(1)

    expect(parseManyMock.callCount).to.be.eq(1)
    expect(parseManyMock.calledWithExactly({
      rawBalances: BITFINEX_RAW_BALANCES,
    })).to.be.ok

    expect(parsedBalances).to.deep.eq(parseManyMock.returnValues[0].balances)

  })

  it('should get tradable balance just fine', async () => {

    const { exchangeMock } = mockExchange()

    const { validateParamsMock } = mockValidateParams()

    const tradableBalance = 25.34

    const requestMock = ImportMock.mockFunction(
      BitfinexHttp,
      'privateRequest',
      Promise.resolve({
        data: [tradableBalance],
        apiRequestCount: 1,
      }),
    )

    const params: IAlunaBalanceGetTradableBalanceParams = {
      side: AlunaOrderSideEnum.BUY,
      rate: 45,
      symbolPair: 'fBTCUSD',
      account: AlunaAccountEnum.MARGIN,
    }

    const {
      tradableBalance: parsedBalances1,
    } = await bitfinexBalanceModule.getTradableBalance(
      params,
    )

    expect(parsedBalances1).to.be.eq(tradableBalance)

    // LONG
    const expectedBody = {
      dir: 1,
      rate: '45',
      symbol: 'fBTCUSD',
      type: BitfinexAccountsEnum.MARGIN,
    }

    expect(requestMock.callCount).to.be.eq(1)
    expect(requestMock.args[0][0]).to.deep.eq({
      url: 'https://api.bitfinex.com/v2/auth/calc/order/avail',
      keySecret: exchangeMock.getValue().keySecret,
      body: expectedBody,
    }).to.be.ok

    expect(validateParamsMock.callCount).to.be.eq(1)
    expect(validateParamsMock.args[0][0]).to.deep.eq({
      params,
      schema: bitfinexGetTradableBalanceParamsSchema,
    })

    // SHORT
    requestMock.returns(Promise.resolve({
      data: [tradableBalance],
      apiRequestCount: 1,
    }))

    params.side = AlunaOrderSideEnum.SELL

    const {
      tradableBalance: parsedBalances2,
    } = await bitfinexBalanceModule.getTradableBalance(
      params,
    )

    expectedBody.dir = -1

    expect(parsedBalances2).to.be.eq(tradableBalance)

    expect(requestMock.callCount).to.be.eq(2)
    expect(requestMock.args[1][0]).to.deep.eq({
      url: 'https://api.bitfinex.com/v2/auth/calc/order/avail',
      keySecret: exchangeMock.getValue().keySecret,
      body: expectedBody,
    }).to.be.ok

    expect(validateParamsMock.callCount).to.be.eq(2)
    expect(validateParamsMock.args[1][0]).to.deep.eq({
      params: {
        ...params,
        side: AlunaOrderSideEnum.SELL,
      },
      schema: bitfinexGetTradableBalanceParamsSchema,
    })

  })

})
