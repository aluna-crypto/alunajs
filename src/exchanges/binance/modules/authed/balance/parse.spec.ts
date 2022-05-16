import { expect } from 'chai'

import { AlunaWalletEnum } from '../../../../../lib/enums/AlunaWalletEnum'
import { IAlunaCredentialsSchema } from '../../../../../lib/schemas/IAlunaCredentialsSchema'
import { mockTranslateSymbolId } from '../../../../../utils/mappings/translateSymbolId.mock'
import { BinanceAuthed } from '../../../BinanceAuthed'
import { BINANCE_RAW_SPOT_BALANCES } from '../../../test/fixtures/binanceBalances'



describe(__filename, () => {

  const credentials: IAlunaCredentialsSchema = {
    key: 'key',
    secret: 'secret',
  }

  it('should parse a Binance raw balance just fine', async () => {

    // preparing data
    const exchange = new BinanceAuthed({ credentials })

    const rawBalance = BINANCE_RAW_SPOT_BALANCES[0]

    const {
      asset,
      free,
      locked,
    } = rawBalance

    const available = Number(free)
    const total = available + Number(locked)

    // mocking
    const { translateSymbolId } = mockTranslateSymbolId()
    translateSymbolId.returns(asset)

    // executing
    const { balance } = exchange.balance.parse({ rawBalance })


    // validating
    expect(balance).to.exist

    expect(balance.available).to.be.eq(available)
    expect(balance.total).to.be.eq(total)
    expect(balance.symbolId).to.be.eq(asset)
    expect(balance.wallet).to.be.eq(AlunaWalletEnum.SPOT)

    expect(balance.meta).to.be.eq(rawBalance)

  })

})
