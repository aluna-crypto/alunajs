import { expect } from 'chai'

import { IAlunaCredentialsSchema } from '../../../../../lib/schemas/IAlunaCredentialsSchema'
import { mockTranslateSymbolId } from '../../../../../utils/mappings/translateSymbolId.mock'
import { binanceAuthed } from '../../../binanceAuthed'
import { BINANCE_RAW_BALANCES } from '../../../test/fixtures/binanceBalances'



describe.skip(__filename, () => {

  const credentials: IAlunaCredentialsSchema = {
    key: 'key',
    secret: 'secret',
  }

  it('should parse a binance raw balance just fine', async () => {

    // preparing data
    const exchange = new binanceAuthed({ credentials })

    const rawBalance = BINANCE_RAW_BALANCES[0]


    // mocking
    const { translateSymbolId } = mockTranslateSymbolId()
    translateSymbolId.returns(rawBalance.currencySymbol)

    // executing
    const { balance } = exchange.balance.parse({ rawBalance })


    // validating
    expect(balance).to.exist

    // TODO: add expectations for everything
    // expect(balance).to.deep.eq(...)

  })

})
