import { expect } from 'chai'

import { IAlunaCredentialsSchema } from '../../lib/schemas/IAlunaCredentialsSchema'
import { IAlunaSettingsSchema } from '../../lib/schemas/IAlunaSettingsSchema'
import { GateAuthed } from './GateAuthed'



describe(__filename, () => {

  it('should ensure exchange have all properties and methods', async () => {

    const settings: IAlunaSettingsSchema = {
      referralCode: '666',
    }

    const credentials: IAlunaCredentialsSchema = {
      key: 'key',
      secret: 'secret',
    }

    const gate = new GateAuthed({
      credentials,
      settings,
    })

    expect(gate.id).to.eq('gate')
    expect(gate.symbol).to.be.ok
    expect(gate.market).to.be.ok
    expect(gate.key).to.be.ok
    expect(gate.balance).to.be.ok
    expect(gate.order).to.be.ok
    expect(gate.specs).to.be.ok
    expect(gate.settings).to.deep.eq(settings)
    expect(gate.credentials).to.deep.eq(credentials)

  })

})
