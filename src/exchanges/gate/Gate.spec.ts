import { expect } from 'chai'

import { IAlunaSettingsSchema } from '../../lib/schemas/IAlunaSettingsSchema'
import { Gate } from './Gate'



describe(__filename, () => {

  it('should contain public modules', async () => {

    const settings: IAlunaSettingsSchema = {
      referralCode: '123',
    }

    const gate = new Gate({ settings })

    expect(gate.id).to.eq('gate')

    expect(gate.symbol).to.be.ok
    expect(gate.market).to.be.ok

    expect(gate.specs).to.be.ok
    expect(gate.settings).to.deep.eq(settings)

  })

})
