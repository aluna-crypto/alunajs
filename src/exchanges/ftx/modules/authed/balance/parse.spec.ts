import { expect } from 'chai'

import { IAlunaCredentialsSchema } from '../../../../../lib/schemas/IAlunaCredentialsSchema'
import { mockTranslateSymbolId } from '../../../../../utils/mappings/translateSymbolId.mock'
import { FtxAuthed } from '../../../FtxAuthed'
import { FTX_RAW_BALANCES } from '../../../test/fixtures/ftxBalances'



describe.skip(__filename, () => {

  const credentials: IAlunaCredentialsSchema = {
    key: 'key',
    secret: 'secret',
  }

  it('should parse a Ftx raw balance just fine', async () => {

    // preparing data
    const rawBalance = FTX_RAW_BALANCES[0]


    // mocking
    const { translateSymbolId } = mockTranslateSymbolId()
    translateSymbolId.returns(rawBalance.currencySymbol)

    // executing
    const exchange = new FtxAuthed({ credentials })

    const { balance } = exchange.balance.parse({ rawBalance })


    // validating
    expect(balance).to.exist

    // TODO: add expectations for everything
    // expect(balance).to.deep.eq(...)

  })

})
