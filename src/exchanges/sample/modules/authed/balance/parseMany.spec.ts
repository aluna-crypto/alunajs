import { expect } from 'chai'
import { each } from 'lodash'

import { mockBalanceParse } from '../../../../../../test/mocks/exchange/modules/balance/mockBalanceParse'
import { IAlunaCredentialsSchema } from '../../../../../lib/schemas/IAlunaCredentialsSchema'
import { SampleAuthed } from '../../../SampleAuthed'
import {
  SAMPLE_PARSED_BALANCES,
  SAMPLE_RAW_BALANCES,
} from '../../../test/fixtures/sampleBalances'
import * as parseMod from './parse'



describe(__filename, () => {

  const credentials: IAlunaCredentialsSchema = {
    key: 'key',
    secret: 'secret',
  }

  it('should parse many Sample raw balances just fine', async () => {

    // preparing data
    const exchange = new SampleAuthed({ credentials })

    const parsedBalances = SAMPLE_PARSED_BALANCES
    const rawBalances = SAMPLE_RAW_BALANCES


    // mocking
    const { parse } = mockBalanceParse({ module: parseMod })

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
