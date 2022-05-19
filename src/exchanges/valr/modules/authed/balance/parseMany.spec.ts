import { expect } from 'chai'
import {
  cloneDeep,
  each,
} from 'lodash'

import { PARSED_BALANCES } from '../../../../../../test/fixtures/parsedBalances'
import { mockParse } from '../../../../../../test/mocks/exchange/modules/mockParse'
import { IAlunaCredentialsSchema } from '../../../../../lib/schemas/IAlunaCredentialsSchema'
import { VALR_RAW_BALANCES } from '../../../test/fixtures/valrBalances'
import { ValrAuthed } from '../../../ValrAuthed'
import * as parseMod from './parse'



describe(__filename, () => {

  const credentials: IAlunaCredentialsSchema = {
    key: 'key',
    secret: 'secret',
  }

  it('should parse many Valr raw balances just fine', async () => {

    // preparing data
    const parsedBalances = [PARSED_BALANCES[0]]
    const rawBalances = cloneDeep(VALR_RAW_BALANCES).slice(0, 2)
    rawBalances[1].total = '0'


    // mocking
    const { parse } = mockParse({ module: parseMod })

    each(parsedBalances, (balance, i) => {
      parse.onCall(i).returns({ balance })
    })


    // executing
    const exchange = new ValrAuthed({ credentials })

    const { balances } = exchange.balance.parseMany({ rawBalances })


    // validating
    expect(balances).to.deep.eq(parsedBalances)

    expect(parse.callCount).to.be.eq(parsedBalances.length)

  })

})
