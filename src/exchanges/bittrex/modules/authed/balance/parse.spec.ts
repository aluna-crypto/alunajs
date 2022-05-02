import { expect } from 'chai'

import { AlunaAccountEnum } from '../../../../../lib/enums/AlunaAccountEnum'
import { IAlunaCredentialsSchema } from '../../../../../lib/schemas/IAlunaCredentialsSchema'
import { mockTranslateSymbolId } from '../../../../../lib/utils/mappings/translateSymbolId.mock'
import { BittrexAuthed } from '../../../BittrexAuthed'
import { BITTREX_RAW_BALANCES } from '../../../test/fixtures/bittrexBalances'



describe(__filename, () => {

  const credentials: IAlunaCredentialsSchema = {
    key: 'key',
    secret: 'secret',
  }

  it('should parse a Bittrex raw balance just fine', async () => {

    // preparing data
    const exchange = new BittrexAuthed({ credentials })

    const rawBalance = BITTREX_RAW_BALANCES[0]


    // mocking
    const { translateSymbolId } = mockTranslateSymbolId()
    translateSymbolId.returns(rawBalance.currencySymbol)

    // executing
    const { balance } = exchange.balance.parse({ rawBalance })


    // validating
    expect(balance.account).to.be.eq(AlunaAccountEnum.EXCHANGE)
    expect(balance.symbolId).to.be.eq(rawBalance.currencySymbol)
    expect(balance.available).to.be.eq(Number(rawBalance.available))
    expect(balance.total).to.be.eq(Number(rawBalance.total))
    expect(balance.meta).to.deep.eq(rawBalance)

    expect(translateSymbolId.callCount).to.be.eq(1)
    expect(translateSymbolId.firstCall.args[0]).to.deep.eq({
      exchangeSymbolId: rawBalance.currencySymbol,
      symbolMappings: exchange.settings.mappings,
    })

  })

})
