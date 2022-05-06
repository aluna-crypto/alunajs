import { expect } from 'chai'

import { IAlunaCredentialsSchema } from '../../../../../lib/schemas/IAlunaCredentialsSchema'
import { mockTranslateSymbolId } from '../../../../../utils/mappings/translateSymbolId.mock'
import { BitfinexAuthed } from '../../../BitfinexAuthed'
import { translateWalletToAluna } from '../../../enums/adapters/bitfinexWalletAdapter'
import { BITFINEX_RAW_BALANCES } from '../../../test/fixtures/bitfinexBalances'



describe(__filename, () => {

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
    translateSymbolId.returns(rawBalance[1])


    // executing
    const { balance } = exchange.balance.parse({ rawBalance })

    const wallet = translateWalletToAluna({
      from: rawBalance[0],
    })


    // validating
    expect(balance.symbolId).to.be.eq(rawBalance[1])
    expect(balance.total).to.be.eq(rawBalance[2])
    expect(balance.wallet).to.be.eq(wallet)
    expect(balance.available).to.be.eq(rawBalance[4])
    expect(balance.meta).to.be.eq(rawBalance)

    expect(translateSymbolId.callCount).to.be.eq(1)
    expect(translateSymbolId.firstCall.args[0]).to.deep.eq({
      exchangeSymbolId: rawBalance[1],
      symbolMappings: undefined,
    })

  })

})
