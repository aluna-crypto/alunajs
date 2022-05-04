import { expect } from 'chai'

import { IAlunaCredentialsSchema } from '../../../../../lib/schemas/IAlunaCredentialsSchema'
import { mockTranslateSymbolId } from '../../../../../lib/utils/mappings/translateSymbolId.mock'
import { SampleAuthed } from '../../../SampleAuthed'
import { SAMPLE_RAW_BALANCES } from '../../../test/fixtures/sampleBalances'



describe(__filename, () => {

  const credentials: IAlunaCredentialsSchema = {
    key: 'key',
    secret: 'secret',
  }

  it('should parse a Sample raw balance just fine', async () => {

    // preparing data
    const exchange = new SampleAuthed({ credentials })

    const rawBalance = SAMPLE_RAW_BALANCES[0]


    // mocking
    const { translateSymbolId } = mockTranslateSymbolId()
    translateSymbolId.returns(rawBalance.currencySymbol)

    // executing
    const { balance } = exchange.balance.parse({ rawBalance })


    // validating
    expect(balance).to.deep.eq({})

  })

})
