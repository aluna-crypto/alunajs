import { expect } from 'chai'

import { IAlunaSettingsSchema } from '../../lib/schemas/IAlunaSettingsSchema'
import { Bittrex } from './Bittrex'



describe(__filename, () => {

  it('should ensure exchangehave all properties and methods', async () => {

    const settings: IAlunaSettingsSchema = {
      referralCode: '666',
    }

    const bittrex = new Bittrex({ settings })

    expect(bittrex.id).to.eq('bittrex')
    expect(bittrex.symbol).to.be.ok
    expect(bittrex.market).to.be.ok
    expect(bittrex.specs).to.be.ok
    expect(bittrex.settings).to.deep.eq(settings)

  })

})
