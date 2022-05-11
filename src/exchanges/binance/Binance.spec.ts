import { expect } from 'chai'

import { IAlunaSettingsSchema } from '../../lib/schemas/IAlunaSettingsSchema'
import { Binance } from './Binance'



describe(__filename, () => {

  it('should contain public modules', async () => {

    const settings: IAlunaSettingsSchema = {
      referralCode: '123',
    }

    const binance = new Binance({ settings })

    expect(binance.id).to.eq('binance')

    expect(binance.symbol).to.be.ok
    expect(binance.market).to.be.ok

    expect(binance.specs).to.be.ok
    expect(binance.settings).to.deep.eq(binance.settings)

  })

})
