import { expect } from 'chai'

import { AlunaWalletEnum } from '../../../../../lib/enums/AlunaWalletEnum'
import { IAlunaCredentialsSchema } from '../../../../../lib/schemas/IAlunaCredentialsSchema'
import { mockTranslateSymbolId } from '../../../../../lib/utils/mappings/translateSymbolId.mock'
import { SampleAuthed } from '../../../SampleAuthed'
import { SAMPLE_RAW_BALANCES } from '../../../test/fixtures/sampleBalances'



describe(__filename, () => {

  const credentials: IAlunaCredentialsSchema = {
    key: 'key',
    secret: 'secret',
  }

  it('should parse a Sample raw balance just fine', async () => {

    // preparing data
    const exchange = new SampleAuthed({ credentials })

    const rawBalance = SAMPLE_RAW_BALANCES[0]


    // mocking
    const { translateSymbolId } = mockTranslateSymbolId()
    translateSymbolId.returns(rawBalance.currencySymbol)

    // executing
    const { balance } = exchange.balance.parse({ rawBalance })


    // validating
    expect(balance.wallet).to.be.eq(AlunaWalletEnum.EXCHANGE)
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
