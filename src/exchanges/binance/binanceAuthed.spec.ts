import { expect } from 'chai'

import { IAlunaCredentialsSchema } from '../../lib/schemas/IAlunaCredentialsSchema'
import { IAlunaSettingsSchema } from '../../lib/schemas/IAlunaSettingsSchema'
import { binanceAuthed } from './binanceAuthed'



describe(__filename, () => {

  it('should contain public & authed modules', async () => {

    const credentials: IAlunaCredentialsSchema = {
      key: 'some-key',
      secret: 'some-secret',
    }

    const settings: IAlunaSettingsSchema = {
      referralCode: '123',
    }

    const binance = new binanceAuthed({ settings, credentials })

    expect(binance.id).to.eq('binance')

    expect(binance.symbol).to.be.ok
    expect(binance.market).to.be.ok

    expect(binance.key).to.be.ok
    expect(binance.balance).to.be.ok
    expect(binance.order).to.be.ok
    expect(binance.position).to.be.ok

    expect(binance.specs).to.be.ok
    expect(binance.settings).to.deep.eq(binance.settings)

  })

})
