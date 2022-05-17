import { expect } from 'chai'
import {
  cloneDeep,
  each,
} from 'lodash'

import { PARSED_BALANCES } from '../../../../../../test/fixtures/parsedBalances'
import { mockParse } from '../../../../../../test/mocks/exchange/modules/mockParse'
import { IAlunaCredentialsSchema } from '../../../../../lib/schemas/IAlunaCredentialsSchema'
import { BinanceAuthed } from '../../../BinanceAuthed'
import { IBinanceBalancesSchema } from '../../../schemas/IBinanceBalanceSchema'
import {
  BINANCE_RAW_MARGIN_BALANCES,
  BINANCE_RAW_SPOT_BALANCES,
} from '../../../test/fixtures/binanceBalances'
import * as parseMod from './parse'



describe(__filename, () => {

  const credentials: IAlunaCredentialsSchema = {
    key: 'key',
    secret: 'secret',
  }

  it('should parse many Binance raw balances just fine', async () => {

    // preparing data
    const spotBalances = cloneDeep(BINANCE_RAW_SPOT_BALANCES).splice(0, 2)
    spotBalances[1].free = '0'
    spotBalances[1].locked = '0'

    const marginBalances = [BINANCE_RAW_MARGIN_BALANCES[0]]

    const rawBalances: IBinanceBalancesSchema = {
      spotBalances,
      marginBalances,
    }

    const parsedBalances = cloneDeep(PARSED_BALANCES).slice(0, 2)


    // mocking
    const { parse } = mockParse({ module: parseMod })
    each(parsedBalances, (parsed, index) => {
      parse.onCall(index).returns({ balance: parsed })
    })

    // executing
    const exchange = new BinanceAuthed({ credentials })

    const { balances } = exchange.balance.parseMany({ rawBalances })


    // validating
    expect(balances).to.deep.eq(parsedBalances)
    expect(parse.callCount).to.be.eq(parsedBalances.length)

  })

})
