import { expect } from 'chai'
import { each } from 'lodash'

import { mockParse } from '../../../../../../test/mocks/exchange/modules/mockParse'
import { IAlunaCredentialsSchema } from '../../../../../lib/schemas/IAlunaCredentialsSchema'
import { BittrexAuthed } from '../../../BittrexAuthed'
import {
  BITTREX_PARSED_BALANCES,
  BITTREX_RAW_BALANCES,
} from '../../../test/fixtures/bittrexBalances'
import * as parseMod from './parse'



describe(__filename, () => {

  const credentials: IAlunaCredentialsSchema = {
    key: 'key',
    secret: 'secret',
  }

  it('should parse many Bittrex raw balances just fine', async () => {

    // preparing data
    const exchange = new BittrexAuthed({ credentials })

    const parsedBalances = BITTREX_PARSED_BALANCES
    const rawBalances = BITTREX_RAW_BALANCES


    // mocking
    const { parse } = mockParse({ module: parseMod })

    each(parsedBalances, (balance, index) => {
      parse.onCall(index).returns({ balance })
    })


    // executing
    const { balances } = exchange.balance.parseMany({ rawBalances })


    // validating
    expect(balances).to.deep.eq(parsedBalances)

    expect(parse.callCount).to.be.eq(parsedBalances.length)

  })

})
