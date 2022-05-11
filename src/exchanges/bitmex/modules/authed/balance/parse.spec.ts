import { expect } from 'chai'

import { IAlunaCredentialsSchema } from '../../../../../lib/schemas/IAlunaCredentialsSchema'
import { mockTranslateSymbolId } from '../../../../../utils/mappings/translateSymbolId.mock'
import { BitmexAuthed } from '../../../BitmexAuthed'
import { BITMEX_RAW_BALANCES } from '../../../test/fixtures/bitmexBalances'



describe(__filename, () => {

  const credentials: IAlunaCredentialsSchema = {
    key: 'key',
    secret: 'secret',
  }

  it('should parse a Bitmex raw balance just fine', async () => {

    // preparing data
    const rawBalance = BITMEX_RAW_BALANCES[0]


    // mocking
    const { translateSymbolId } = mockTranslateSymbolId()
    translateSymbolId.returns(rawBalance.currencySymbol)


    // executing
    const exchange = new BitmexAuthed({ credentials })

    const { balance } = exchange.balance.parse({ rawBalance })


    // validating
    expect(balance).to.exist

    // TODO: add expectations for everything
    // expect(balance).to.deep.eq(...)

  })

})
