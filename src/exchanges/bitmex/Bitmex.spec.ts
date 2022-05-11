import { expect } from 'chai'

import { IAlunaSettingsSchema } from '../../lib/schemas/IAlunaSettingsSchema'
import { Bitmex } from './Bitmex'



describe(__filename, () => {

  it('should contain public modules', async () => {

    const settings: IAlunaSettingsSchema = {
      referralCode: '123',
    }

    const bitmex = new Bitmex({ settings })

    expect(bitmex.id).to.eq('bitmex')

    expect(bitmex.symbol).to.be.ok
    expect(bitmex.market).to.be.ok

    expect(bitmex.specs).to.be.ok
    expect(bitmex.settings).to.deep.eq(bitmex.settings)

  })

})
