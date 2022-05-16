import { expect } from 'chai'

import { IAlunaSettingsSchema } from '../../lib/schemas/IAlunaSettingsSchema'
import { Poloniex } from './Poloniex'



describe(__filename, () => {

  it('should contain public modules', async () => {

    const settings: IAlunaSettingsSchema = {
      referralCode: '123',
    }

    const poloniex = new Poloniex({ settings })

    expect(poloniex.id).to.eq('poloniex')

    expect(poloniex.symbol).to.be.ok
    expect(poloniex.market).to.be.ok

    expect(poloniex.specs).to.be.ok
    expect(poloniex.settings).to.deep.eq(poloniex.settings)

  })

})
