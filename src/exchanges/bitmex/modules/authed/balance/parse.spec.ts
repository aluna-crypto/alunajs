import BigNumber from 'bignumber.js'
import { expect } from 'chai'
import { each } from 'lodash'

import { AlunaWalletEnum } from '../../../../../lib/enums/AlunaWalletEnum'
import { IAlunaCredentialsSchema } from '../../../../../lib/schemas/IAlunaCredentialsSchema'
import { IAlunaSettingsSchema } from '../../../../../lib/schemas/IAlunaSettingsSchema'
import { mockTranslateSymbolId } from '../../../../../utils/mappings/translateSymbolId.mock'
import { BitmexAuthed } from '../../../BitmexAuthed'
import { BITMEX_RAW_BALANCES } from '../../../test/fixtures/bitmexBalances'



describe(__filename, () => {

  it('should parse a Bitmex raw balance just fine', async () => {

    // preparing data
    const credentials: IAlunaCredentialsSchema = {
      key: 'key',
      secret: 'secret',
    }

    const mockedTranslatedSymbolId = 'ETH'


    // mocking
    const { translateSymbolId } = mockTranslateSymbolId()
    translateSymbolId.returns(mockedTranslatedSymbolId)

    const {
      assets,
      assetsDetails,
    } = BITMEX_RAW_BALANCES

    each(assets, (asset, index) => {

      const rawBalance = {
        asset,
        assetDetails: assetsDetails[index],
      }


      // executing
      const settings: IAlunaSettingsSchema = { symbolMappings: {} }
      const exchange = new BitmexAuthed({ credentials, settings })

      const { balance } = exchange.balance.parse({ rawBalance })


      // validating
      const {
        walletBalance,
        availableMargin,
      } = asset

      const {
        asset: symbol,
        scale,
      } = assetsDetails[index]


      let expectedAvailable: number
      let expectedTotal: number

      if (walletBalance <= 0) {

        expectedAvailable = 0
        expectedTotal = 0

      } else {

        const multiplier = 10 ** (-scale)

        expectedAvailable = new BigNumber(availableMargin)
          .times(multiplier)
          .toNumber()

        expectedTotal = new BigNumber(walletBalance)
          .times(multiplier)
          .toNumber()

      }


      expect(balance.symbolId).to.be.eq(mockedTranslatedSymbolId)
      expect(balance.wallet).to.be.eq(AlunaWalletEnum.TRADING)
      expect(balance.available).to.be.eq(expectedAvailable)
      expect(balance.total).to.be.eq(expectedTotal)
      expect(balance.meta).to.deep.eq(rawBalance)

      expect(translateSymbolId.callCount).to.be.eq(index + 1)
      expect(translateSymbolId.args[index][0]).to.deep.eq({
        exchangeSymbolId: symbol,
        symbolMappings: exchange.settings.symbolMappings,
      })

    })

  })

})
