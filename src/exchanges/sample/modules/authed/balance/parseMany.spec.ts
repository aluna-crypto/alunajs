import { expect } from 'chai'
import { each } from 'lodash'

import { PARSED_BALANCES } from '../../../../../../test/fixtures/parsedBalances'
import { mockBalanceParse } from '../../../../../../test/mocks/exchange/modules/balance/mockBalanceParse'
import { IAlunaCredentialsSchema } from '../../../../../lib/schemas/IAlunaCredentialsSchema'
import { SampleAuthed } from '../../../SampleAuthed'
import { SAMPLE_RAW_BALANCES } from '../../../test/fixtures/sampleBalances'
import * as parseMod from './parse'



describe(__filename, () => {

  const credentials: IAlunaCredentialsSchema = {
    key: 'key',
    secret: 'secret',
  }

  it('should parse many Sample raw balances just fine', async () => {

    // preparing data
    const rawBalances = SAMPLE_RAW_BALANCES


    // mocking
    const { parse } = mockBalanceParse({ module: parseMod })

    each(PARSED_BALANCES, (balance, i) => {
      parse.onCall(i).returns({ balance })
    })


    // executing
    const exchange = new SampleAuthed({ credentials })

    const { balances } = exchange.balance.parseMany({ rawBalances })


    // validating
    expect(balances).to.deep.eq(PARSED_BALANCES)

  })

})
