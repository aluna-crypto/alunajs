import { expect } from 'chai'

import { AlunaWalletEnum } from '../../../../../lib/enums/AlunaWalletEnum'
import { IAlunaBalanceSchema } from '../../../../../lib/schemas/IAlunaBalanceSchema'
import { IAlunaCredentialsSchema } from '../../../../../lib/schemas/IAlunaCredentialsSchema'
import { mockTranslateSymbolId } from '../../../../../utils/mappings/translateSymbolId.mock'
import { VALR_RAW_BALANCES } from '../../../test/fixtures/valrBalances'
import { ValrAuthed } from '../../../ValrAuthed'



describe(__filename, () => {

  const credentials: IAlunaCredentialsSchema = {
    key: 'key',
    secret: 'secret',
  }

  it('should parse a Valr raw balance just fine', async () => {

    // preparing data
    const exchange = new ValrAuthed({ credentials })

    const rawBalance = VALR_RAW_BALANCES[0]

    const {
      available,
      currency,
      total,
    } = rawBalance

    const parsedBalance: IAlunaBalanceSchema = {
      symbolId: currency,
      available: Number(available),
      total: Number(total),
      meta: rawBalance,
      wallet: AlunaWalletEnum.SPOT,
    }


    // mocking
    const { translateSymbolId } = mockTranslateSymbolId()
    translateSymbolId.returns(rawBalance.currency)

    // executing
    const { balance } = exchange.balance.parse({ rawBalance })


    // validating
    expect(balance).to.deep.eq(parsedBalance)

  })

})
