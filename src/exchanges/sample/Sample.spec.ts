import { expect } from 'chai'

import { IAlunaSettingsSchema } from '../../lib/schemas/IAlunaSettingsSchema'
import { Sample } from './Sample'



describe(__filename, () => {

  it('should contain public modules', async () => {

    const settings: IAlunaSettingsSchema = {
      referralCode: '123',
    }

    const sample = new Sample({ settings })

    expect(sample.id).to.eq('sample')

    expect(sample.symbol).to.be.ok
    expect(sample.market).to.be.ok

    expect(sample.specs).to.be.ok
    expect(sample.settings).to.deep.eq(sample.settings)

  })

})
