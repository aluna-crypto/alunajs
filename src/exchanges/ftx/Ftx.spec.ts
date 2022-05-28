import { expect } from 'chai'

import { IAlunaSettingsSchema } from '../../lib/schemas/IAlunaSettingsSchema'
import { Ftx } from './Ftx'



describe(__filename, () => {

  it('should contain public modules', async () => {

    const settings: IAlunaSettingsSchema = {
      referralCode: '123',
    }

    const ftx = new Ftx({ settings })

    expect(ftx.id).to.eq('ftx')

    expect(ftx.symbol).to.be.ok
    expect(ftx.market).to.be.ok

    expect(ftx.specs).to.be.ok
    expect(ftx.settings).to.deep.eq(ftx.settings)

  })

})
