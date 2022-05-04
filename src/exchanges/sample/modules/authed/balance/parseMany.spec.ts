import { expect } from 'chai'

import { IAlunaCredentialsSchema } from '../../../../../lib/schemas/IAlunaCredentialsSchema'
import { SampleAuthed } from '../../../SampleAuthed'
import { SAMPLE_RAW_BALANCES } from '../../../test/fixtures/sampleBalances'



describe(__filename, () => {

  const credentials: IAlunaCredentialsSchema = {
    key: 'key',
    secret: 'secret',
  }

  it('should parse many Sample raw balances just fine', async () => {

    // preparing data
    const rawBalances = SAMPLE_RAW_BALANCES


    // executing
    const exchange = new SampleAuthed({ credentials })

    const { balances } = exchange.balance.parseMany({ rawBalances })


    // validating
    expect(balances).to.deep.eq([])

  })

})
