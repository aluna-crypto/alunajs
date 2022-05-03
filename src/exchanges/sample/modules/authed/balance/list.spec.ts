import { expect } from 'chai'

import { mockBalanceListRaw } from '../../../../../../test/mocks/exchange/modules/balance/mockBalanceListRaw'
import { mockBalanceParseMany } from '../../../../../../test/mocks/exchange/modules/balance/mockBalanceParseMany'
import { IAlunaCredentialsSchema } from '../../../../../lib/schemas/IAlunaCredentialsSchema'
import { SampleAuthed } from '../../../SampleAuthed'
import { SampleHttp } from '../../../SampleHttp'
import {
  SAMPLE_PARSED_BALANCES,
  SAMPLE_RAW_BALANCES,
} from '../../../test/fixtures/sampleBalances'
import * as listRawMod from './listRaw'
import * as parseManyMod from './parseMany'



describe(__filename, () => {

  const credentials: IAlunaCredentialsSchema = {
    key: 'key',
    secret: 'secret',
  }

  it('should list Sample parsed balances just fine', async () => {

    // preparing data
    const http = new SampleHttp()

    const rawBalances = SAMPLE_RAW_BALANCES
    const parsedBalances = SAMPLE_PARSED_BALANCES

    // mocking
    const { listRaw } = mockBalanceListRaw({ module: listRawMod })
    listRaw.returns(Promise.resolve({ rawBalances }))

    const { parseMany } = mockBalanceParseMany({ module: parseManyMod })
    parseMany.returns({ balances: parsedBalances })


    // executing
    const exchange = new SampleAuthed({ credentials })

    const {
      balances,
      requestCount,
    } = await exchange.balance.list()


    // validating
    expect(balances).to.deep.eq(parsedBalances)
    expect(requestCount).to.deep.eq(http.requestCount)

    expect(listRaw.callCount).to.be.eq(1)
    expect(listRaw.firstCall.args[0]).to.deep.eq({
      http,
    })

    expect(parseMany.callCount).to.be.eq(1)
    expect(parseMany.firstCall.args[0]).to.deep.eq({
      rawBalances,
    })

  })

})
