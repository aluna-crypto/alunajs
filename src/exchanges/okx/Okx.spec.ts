import { expect } from 'chai'

import { IAlunaSettingsSchema } from '../../lib/schemas/IAlunaSettingsSchema'
import { Okx } from './Okx'



describe(__filename, () => {

  it('should contain public modules', async () => {

    const settings: IAlunaSettingsSchema = {
      referralCode: '123',
    }

    const okx = new Okx({ settings })

    expect(okx.id).to.eq('okx')

    expect(okx.symbol).to.be.ok
    expect(okx.market).to.be.ok

    expect(okx.specs).to.be.ok
    expect(okx.settings).to.deep.eq(okx.settings)

  })

})
