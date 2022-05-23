import { expect } from 'chai'

import { IAlunaCredentialsSchema } from '../../../../../lib/schemas/IAlunaCredentialsSchema'
import { mockTranslateSymbolId } from '../../../../../utils/mappings/translateSymbolId.mock'
import { HuobiAuthed } from '../../../HuobiAuthed'
import { HUOBI_RAW_BALANCES } from '../../../test/fixtures/huobiBalances'



describe.skip(__filename, () => {

  const credentials: IAlunaCredentialsSchema = {
    key: 'key',
    secret: 'secret',
  }

  it('should parse a Huobi raw balance just fine', async () => {

    // preparing data
    const rawBalance = HUOBI_RAW_BALANCES[0]


    // mocking
    const { translateSymbolId } = mockTranslateSymbolId()
    translateSymbolId.returns(rawBalance.currencySymbol)

    // executing
    const exchange = new HuobiAuthed({ credentials })

    const { balance } = exchange.balance.parse({ rawBalance })


    // validating
    expect(balance).to.exist

    // TODO: add expectations for everything
    // expect(balance).to.deep.eq(...)

  })

})
