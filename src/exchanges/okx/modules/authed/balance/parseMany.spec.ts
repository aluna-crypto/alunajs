import { expect } from 'chai'
import { each } from 'lodash'

import { PARSED_BALANCES } from '../../../../../../test/fixtures/parsedBalances'
import { mockParse } from '../../../../../../test/mocks/exchange/modules/mockParse'
import { IAlunaCredentialsSchema } from '../../../../../lib/schemas/IAlunaCredentialsSchema'
import { OkxAuthed } from '../../../OkxAuthed'
import { OKX_RAW_BALANCES } from '../../../test/fixtures/okxBalances'
import * as parseMod from './parse'



describe(__filename, () => {

  const credentials: IAlunaCredentialsSchema = {
    key: 'key',
    secret: 'secret',
  }

  it('should parse many Okx raw balances just fine', async () => {

    // preparing data
    const rawBalances = OKX_RAW_BALANCES


    // mocking
    const { parse } = mockParse({ module: parseMod })

    each(PARSED_BALANCES, (balance, i) => {
      parse.onCall(i).returns({ balance })
    })


    // executing
    const exchange = new OkxAuthed({ credentials })

    const { balances } = exchange.balance.parseMany({ rawBalances })


    // validating
    expect(balances).to.deep.eq(PARSED_BALANCES)

  })

})
