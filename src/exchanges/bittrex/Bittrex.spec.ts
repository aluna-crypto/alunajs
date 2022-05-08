import { expect } from 'chai'

import { IAlunaSettingsSchema } from '../../lib/schemas/IAlunaSettingsSchema'
import { Bittrex } from './Bittrex'



describe(__filename, () => {

  it('should contain public modules', async () => {

    const settings: IAlunaSettingsSchema = {
      referralCode: '123',
    }

    const bittrex = new Bittrex({ settings })

    expect(bittrex.id).to.eq('bittrex')

    expect(bittrex.symbol).to.be.ok
    expect(bittrex.market).to.be.ok

    expect(bittrex.specs).to.be.ok
    expect(bittrex.settings).to.deep.eq(settings)

  })

})
