import { expect } from 'chai'

import { AlunaWalletEnum } from '../../../../../lib/enums/AlunaWalletEnum'
import { IAlunaCredentialsSchema } from '../../../../../lib/schemas/IAlunaCredentialsSchema'
import { mockTranslateSymbolId } from '../../../../../utils/mappings/translateSymbolId.mock'
import { OkxAuthed } from '../../../OkxAuthed'
import { OKX_RAW_BALANCES } from '../../../test/fixtures/okxBalances'



describe(__filename, () => {

  const credentials: IAlunaCredentialsSchema = {
    key: 'key',
    secret: 'secret',
  }

  it('should parse a Okx raw balance just fine', async () => {

    // preparing data
    const rawBalance = OKX_RAW_BALANCES[0]

    const {
      availBal,
      frozenBal,
      ccy,
    } = rawBalance

    const available = Number(availBal)

    const total = available + Number(frozenBal)


    // mocking
    const { translateSymbolId } = mockTranslateSymbolId()

    translateSymbolId.returns(ccy)

    // executing
    const exchange = new OkxAuthed({ credentials })

    const { balance } = exchange.balance.parse({ rawBalance })


    // validating
    expect(balance).to.exist

    expect(balance.available).to.be.eq(available)
    expect(balance.total).to.be.eq(total)
    expect(balance.symbolId).to.be.eq(ccy)
    expect(balance.wallet).to.be.eq(AlunaWalletEnum.SPOT)
    expect(balance.exchangeId).to.be.eq(exchange.specs.id)
    expect(balance.meta).to.be.eq(rawBalance)

  })

})
