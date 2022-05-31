import { expect } from 'chai'

import { AlunaWalletEnum } from '../../../../../lib/enums/AlunaWalletEnum'
import { IAlunaCredentialsSchema } from '../../../../../lib/schemas/IAlunaCredentialsSchema'
import { mockTranslateSymbolId } from '../../../../../utils/mappings/translateSymbolId.mock'
import { FtxAuthed } from '../../../FtxAuthed'
import { FTX_RAW_BALANCES } from '../../../test/fixtures/ftxBalances'



describe(__filename, () => {

  const credentials: IAlunaCredentialsSchema = {
    key: 'key',
    secret: 'secret',
  }

  it('should parse a Ftx raw balance just fine', async () => {

    // preparing data
    const rawBalance = FTX_RAW_BALANCES[0]

    const {
      free,
      total,
      coin,
    } = rawBalance

    // mocking
    const { translateSymbolId } = mockTranslateSymbolId()
    translateSymbolId.returns(rawBalance.coin)

    // executing
    const exchange = new FtxAuthed({ credentials })

    const { balance } = exchange.balance.parse({ rawBalance })


    // validating
    expect(balance).to.exist

    expect(balance.available).to.be.eq(free)
    expect(balance.total).to.be.eq(total)
    expect(balance.symbolId).to.be.eq(coin)
    expect(balance.exchangeId).to.be.eq(exchange.specs.id)
    expect(balance.wallet).to.be.eq(AlunaWalletEnum.TRADING)
    expect(balance.meta).to.deep.eq(rawBalance)

    expect(translateSymbolId.callCount).to.be.eq(1)
    expect(translateSymbolId.args[0][0]).to.deep.eq({
      exchangeSymbolId: rawBalance.coin,
      symbolMappings: exchange.settings.symbolMappings,
    })

  })

})
