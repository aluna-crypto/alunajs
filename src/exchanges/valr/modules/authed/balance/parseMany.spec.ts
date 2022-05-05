import { expect } from 'chai'
import { each } from 'lodash'

import { PARSED_BALANCES } from '../../../../../../test/fixtures/parsedBalances'
import { mockParse } from '../../../../../../test/mocks/exchange/modules/mockParse'
import { IAlunaCredentialsSchema } from '../../../../../lib/schemas/IAlunaCredentialsSchema'
import { ValrAuthed } from '../../../ValrAuthed'
import { VALR_RAW_BALANCES } from '../../../test/fixtures/valrBalances'
import * as parseMod from './parse'



describe(__filename, () => {

  const credentials: IAlunaCredentialsSchema = {
    key: 'key',
    secret: 'secret',
  }

  it('should parse many Valr raw balances just fine', async () => {

    // preparing data
    const rawBalances = VALR_RAW_BALANCES


    // mocking
    const { parse } = mockParse({ module: parseMod })

    each(PARSED_BALANCES, (balance, i) => {
      parse.onCall(i).returns({ balance })
    })


    // executing
    const exchange = new ValrAuthed({ credentials })

    const { balances } = exchange.balance.parseMany({ rawBalances })


    // validating
    expect(balances).to.deep.eq(PARSED_BALANCES)

  })

})
