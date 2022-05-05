import { expect } from 'chai'

import { IAlunaCredentialsSchema } from '../../../../../lib/schemas/IAlunaCredentialsSchema'
import { mockTranslateSymbolId } from '../../../../../utils/mappings/translateSymbolId.mock'
import { ValrAuthed } from '../../../ValrAuthed'
import { VALR_RAW_BALANCES } from '../../../test/fixtures/valrBalances'



describe.skip(__filename, () => {

  const credentials: IAlunaCredentialsSchema = {
    key: 'key',
    secret: 'secret',
  }

  it('should parse a Valr raw balance just fine', async () => {

    // preparing data
    const exchange = new ValrAuthed({ credentials })

    const rawBalance = VALR_RAW_BALANCES[0]


    // mocking
    const { translateSymbolId } = mockTranslateSymbolId()
    translateSymbolId.returns(rawBalance.currencySymbol)

    // executing
    const { balance } = exchange.balance.parse({ rawBalance })


    // validating
    expect(balance).to.deep.eq({})

  })

})
