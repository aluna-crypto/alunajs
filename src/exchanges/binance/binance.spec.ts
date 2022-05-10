import { expect } from 'chai'

import { IAlunaSettingsSchema } from '../../lib/schemas/IAlunaSettingsSchema'
import { binance } from './binance'



describe(__filename, () => {

  it('should contain public modules', async () => {

    const settings: IAlunaSettingsSchema = {
      referralCode: '123',
    }

    const binance = new binance({ settings })

    expect(binance.id).to.eq('binance')

    expect(binance.symbol).to.be.ok
    expect(binance.market).to.be.ok

    expect(binance.specs).to.be.ok
    expect(binance.settings).to.deep.eq(binance.settings)

  })

})
