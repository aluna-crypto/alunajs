import { expect } from 'chai'

import { IAlunaSettingsSchema } from '../../lib/schemas/IAlunaSettingsSchema'
import { Bitfinex } from './Bitfinex'



describe(__filename, () => {

  it('should ensure exchangehave all properties and methods', async () => {

    const settings: IAlunaSettingsSchema = {
      referralCode: '666',
    }

    const bitfinex = new Bitfinex({ settings })

    expect(bitfinex.id).to.eq('bitfinex')
    expect(bitfinex.symbol).to.be.ok
    expect(bitfinex.market).to.be.ok
    expect(bitfinex.specs).to.be.ok
    expect(bitfinex.settings).to.deep.eq(settings)

  })

})
