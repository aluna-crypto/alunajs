import { expect } from 'chai'

import { IAlunaSettingsSchema } from '../../lib/schemas/IAlunaSettingsSchema'
import { Valr } from './Valr'



describe(__filename, () => {

  it('should contain public modules', async () => {

    const settings: IAlunaSettingsSchema = {
      referralCode: '123',
    }

    const valr = new Valr({ settings })

    expect(valr.id).to.eq('valr')

    expect(valr.symbol).to.be.ok
    expect(valr.market).to.be.ok

    expect(valr.specs).to.be.ok
    expect(valr.settings).to.deep.eq(valr.settings)

  })

})
