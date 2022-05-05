import { expect } from 'chai'
import { each } from 'lodash'

import { PARSED_BALANCES } from '../../../../../../test/fixtures/parsedBalances'
import { mockParse } from '../../../../../../test/mocks/exchange/modules/mockParse'
import { IAlunaCredentialsSchema } from '../../../../../lib/schemas/IAlunaCredentialsSchema'
import { BittrexAuthed } from '../../../BittrexAuthed'
import { BITTREX_RAW_BALANCES } from '../../../test/fixtures/bittrexBalances'
import * as parseMod from './parse'



describe(__filename, () => {

  const credentials: IAlunaCredentialsSchema = {
    key: 'key',
    secret: 'secret',
  }

  it('should parse many Bittrex raw balances just fine', async () => {

    // preparing data
    const parsedBalances = PARSED_BALANCES
    const rawBalances = BITTREX_RAW_BALANCES


    // mocking
    const { parse } = mockParse({ module: parseMod })

    each(parsedBalances, (balance, index) => {
      parse.onCall(index).returns({ balance })
    })


    // executing
    const exchange = new BittrexAuthed({ credentials })

    const { balances } = exchange.balance.parseMany({ rawBalances })


    // validating
    expect(balances).to.deep.eq(parsedBalances)

    expect(parse.callCount).to.be.eq(parsedBalances.length)

  })

})
