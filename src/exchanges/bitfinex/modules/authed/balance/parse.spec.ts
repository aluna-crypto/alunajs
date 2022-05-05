import { expect } from 'chai'

import { IAlunaCredentialsSchema } from '../../../../../lib/schemas/IAlunaCredentialsSchema'
import { mockTranslateSymbolId } from '../../../../../utils/mappings/translateSymbolId.mock'
import { BitfinexAuthed } from '../../../BitfinexAuthed'
import { BITFINEX_RAW_BALANCES } from '../../../test/fixtures/bitfinexBalances'



describe.skip(__filename, () => {

  const credentials: IAlunaCredentialsSchema = {
    key: 'key',
    secret: 'secret',
  }

  it('should parse a Bitfinex raw balance just fine', async () => {

    // preparing data
    const exchange = new BitfinexAuthed({ credentials })

    const rawBalance = BITFINEX_RAW_BALANCES[0]


    // mocking
    const { translateSymbolId } = mockTranslateSymbolId()
    translateSymbolId.returns(rawBalance.currencySymbol)

    // executing
    const { balance } = exchange.balance.parse({ rawBalance })


    // validating
    expect(balance).to.deep.eq({})

  })

})
