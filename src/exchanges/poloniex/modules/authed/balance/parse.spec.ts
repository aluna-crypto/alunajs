import { expect } from 'chai'

import { AlunaWalletEnum } from '../../../../../lib/enums/AlunaWalletEnum'
import { IAlunaCredentialsSchema } from '../../../../../lib/schemas/IAlunaCredentialsSchema'
import { mockTranslateSymbolId } from '../../../../../utils/mappings/translateSymbolId.mock'
import { PoloniexAuthed } from '../../../PoloniexAuthed'
import { poloniexBaseSpecs } from '../../../poloniexSpecs'
import { POLONIEX_RAW_BALANCES } from '../../../test/fixtures/poloniexBalances'



describe(__filename, () => {

  const credentials: IAlunaCredentialsSchema = {
    key: 'key',
    secret: 'secret',
  }

  it('should parse a Poloniex raw balance just fine', async () => {

    // preparing data
    const rawBalance = POLONIEX_RAW_BALANCES[0]

    const {
      available,
      onOrders,
      currency,
    } = rawBalance

    const total = Number(available) + Number(onOrders)

    // mocking
    const { translateSymbolId } = mockTranslateSymbolId()
    translateSymbolId.returns(currency)

    // executing
    const exchange = new PoloniexAuthed({ credentials })

    const { balance } = exchange.balance.parse({ rawBalance })


    // validating
    expect(balance).to.exist

    expect(balance.available).to.be.eq(Number(available))
    expect(balance.total).to.be.eq(total)
    expect(balance.symbolId).to.be.eq(currency)
    expect(balance.wallet).to.be.eq(AlunaWalletEnum.EXCHANGE)
    expect(balance.exchangeId).to.be.eq(poloniexBaseSpecs.id)

    expect(balance.meta).to.be.eq(rawBalance)

  })

})
