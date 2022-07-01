import { expect } from 'chai'

import { IAlunaSettingsSchema } from '../../lib/schemas/IAlunaSettingsSchema'
import { Huobi } from './Huobi'



describe(__filename, () => {

  it('should contain public modules', async () => {

    const settings: IAlunaSettingsSchema = {
      referralCode: '123',
    }

    const huobi = new Huobi({ settings })

    expect(huobi.id).to.eq('huobi')

    expect(huobi.symbol).to.be.ok
    expect(huobi.market).to.be.ok

    expect(huobi.specs).to.be.ok
    expect(huobi.settings).to.deep.eq(huobi.settings)

  })

})
