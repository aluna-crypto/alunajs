import { expect } from 'chai'

import { AlunaWalletEnum } from '../../../../../lib/enums/AlunaWalletEnum'
import { IAlunaCredentialsSchema } from '../../../../../lib/schemas/IAlunaCredentialsSchema'
import { mockTranslateSymbolId } from '../../../../../utils/mappings/translateSymbolId.mock'
import { GateAuthed } from '../../../GateAuthed'
import { gateBaseSpecs } from '../../../gateSpecs'
import { GATE_RAW_BALANCES } from '../../../test/fixtures/gateBalances'



describe(__filename, () => {

  const credentials: IAlunaCredentialsSchema = {
    key: 'key',
    secret: 'secret',
  }

  it('should parse a Gate raw balance just fine', async () => {

    // preparing data
    const exchange = new GateAuthed({ credentials })

    const rawBalance = GATE_RAW_BALANCES[0]

    const {
      available,
      locked,
      currency,
    } = rawBalance

    const total = Number(available) + Number(locked)

    // mocking
    const { translateSymbolId } = mockTranslateSymbolId()
    translateSymbolId.returns(currency)

    // executing
    const { balance } = exchange.balance.parse({ rawBalance })


    // validating
    expect(balance).to.be.ok

    expect(balance.available).to.be.eq(Number(available))
    expect(balance.total).to.be.eq(total)
    expect(balance.wallet).to.be.eq(AlunaWalletEnum.SPOT)
    expect(balance.exchangeId).to.be.eq(gateBaseSpecs.id)
    expect(balance.symbolId).to.be.eq(currency)
    expect(balance.meta).to.deep.eq(rawBalance)

  })

})
