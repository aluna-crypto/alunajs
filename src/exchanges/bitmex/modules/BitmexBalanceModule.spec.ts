import { expect } from 'chai'
import { each } from 'lodash'
import { ImportMock } from 'ts-mock-imports'

import { IAlunaExchange } from '../../../lib/core/IAlunaExchange'
import { AlunaHttpVerbEnum } from '../../../lib/enums/AlunaHtttpVerbEnum'
import { BitmexHttp } from '../BitmexHttp'
import { PROD_BITMEX_URL } from '../BitmexSpecs'
import { BitmexBalanceParser } from '../schemas/parsers/BitmexBalanceParser'
import {
  BITMEX_PARSED_BALANCES,
  BITMEX_RAW_BALANCES,
} from '../test/bitmexBalances'
import { BitmexBalanceModule } from './BitmexBalanceModule'



describe('BitmexBalanceModule', () => {

  const bitmexBalanceModule = BitmexBalanceModule.prototype

  it('should properly list Bitmex raw balances', async () => {

    const exchangeMock = ImportMock.mockOther(
      bitmexBalanceModule,
      'exchange',
      {
        keySecret: {
          key: '',
          secret: '',
        },
      } as IAlunaExchange,
    )

    const requestMock = ImportMock.mockFunction(
      BitmexHttp,
      'privateRequest',
      BITMEX_RAW_BALANCES,
    )

    const rawBalances = await bitmexBalanceModule.listRaw()

    expect(requestMock.callCount).to.be.eq(1)
    expect(requestMock.calledWith({
      verb: AlunaHttpVerbEnum.GET,
      url: `${PROD_BITMEX_URL}/user/margin`,
      body: { currency: 'all' },
      keySecret: exchangeMock.getValue().keySecret,
    })).to.be.ok

    expect(rawBalances.length).to.eq(BITMEX_RAW_BALANCES.length)
    expect(rawBalances).to.deep.eq(BITMEX_RAW_BALANCES)

  })

  it('should properly list Bitmex parsed balances', async () => {

    const listRawMock = ImportMock.mockFunction(
      bitmexBalanceModule,
      'listRaw',
      BITMEX_RAW_BALANCES,
    )

    const parseManyMock = ImportMock.mockFunction(
      bitmexBalanceModule,
      'parseMany',
      BITMEX_PARSED_BALANCES,
    )

    const balances = await bitmexBalanceModule.list()

    expect(listRawMock.callCount).to.be.eq(1)

    expect(parseManyMock.callCount).to.be.eq(1)
    expect(parseManyMock.calledWith({
      rawBalances: BITMEX_RAW_BALANCES,
    })).to.be.ok

    expect(balances).to.deep.eq(BITMEX_PARSED_BALANCES)

  })

  it('should properly parse a Bitmex raw balance', () => {

    const balanceParserMock = ImportMock.mockFunction(
      BitmexBalanceParser,
      'parse',
    )

    each(BITMEX_PARSED_BALANCES, (parsedBalance, i) => {

      balanceParserMock.onCall(i).returns(parsedBalance)

    })

    each(BITMEX_RAW_BALANCES, (rawBalance, i) => {

      const parsedBalance = bitmexBalanceModule.parse({
        rawBalance,
      })

      expect(parsedBalance).to.be.eq(BITMEX_PARSED_BALANCES[i])

      expect(balanceParserMock.callCount).to.be.eq(i + 1)
      expect(balanceParserMock.args[i][0]).to.deep.eq({ rawBalance })

    })

  })

  it('should properly parse many Bitmex raw balances', async () => {

    const parseMock = ImportMock.mockFunction(
      bitmexBalanceModule,
      'parse',
    )

    each(BITMEX_PARSED_BALANCES, (parsedBalance, i) => {

      parseMock.onCall(i).returns(parsedBalance)

    })

    const parsedBalances = bitmexBalanceModule.parseMany({
      rawBalances: BITMEX_RAW_BALANCES,
    })

    expect(parseMock.callCount).to.be.eq(BITMEX_RAW_BALANCES.length)

    expect(parsedBalances).to.deep.eq(BITMEX_PARSED_BALANCES)

  })

})
