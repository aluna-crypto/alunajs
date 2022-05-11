import { expect } from 'chai'

import { IAlunaCredentialsSchema } from '../../lib/schemas/IAlunaCredentialsSchema'
import { IAlunaSettingsSchema } from '../../lib/schemas/IAlunaSettingsSchema'
import { GateAuthed } from './GateAuthed'



describe(__filename, () => {

  it('should contain public & authed modules', async () => {

    const credentials: IAlunaCredentialsSchema = {
      key: 'some-key',
      secret: 'some-secret',
    }

    const settings: IAlunaSettingsSchema = {
      referralCode: '123',
    }

    const gate = new GateAuthed({ settings, credentials })

    expect(gate.id).to.eq('gate')

    expect(gate.symbol).to.be.ok
    expect(gate.market).to.be.ok

    expect(gate.key).to.be.ok
    expect(gate.balance).to.be.ok
    expect(gate.order).to.be.ok

    expect(gate.specs).to.be.ok
    expect(gate.settings).to.deep.eq(settings)

  })

})
