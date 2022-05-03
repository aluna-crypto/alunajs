import { expect } from 'chai'

import { IAlunaSettingsSchema } from '../../lib/schemas/IAlunaSettingsSchema'
import { Sample } from './Sample'



describe(__filename, () => {

  it('should ensure exchangehave all properties and methods', async () => {

    const settings: IAlunaSettingsSchema = {
      referralCode: '666',
    }

    const sample = new Sample({ settings })

    expect(sample.id).to.eq('sample')
    expect(sample.symbol).to.be.ok
    expect(sample.market).to.be.ok
    expect(sample.specs).to.be.ok
    expect(sample.settings).to.deep.eq(settings)

  })

})
