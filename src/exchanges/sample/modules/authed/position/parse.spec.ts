import { expect } from 'chai'

import { IAlunaCredentialsSchema } from '../../../../../lib/schemas/IAlunaCredentialsSchema'
import { SampleAuthed } from '../../../SampleAuthed'
import { SAMPLE_RAW_POSITIONS } from '../../../test/fixtures/samplePositions'



describe(__filename, () => {

  const credentials: IAlunaCredentialsSchema = {
    key: 'key',
    secret: 'secret',
  }

  it('should parse a Sample raw position just fine', async () => {

    // preparing data
    const rawPosition = SAMPLE_RAW_POSITIONS[0]

    const exchange = new SampleAuthed({ credentials })

    const { position } = exchange.position!.parse({ rawPosition })


    // validating
    expect(position).to.exist

    // TODO: add expectations for everything
    // expect(position).to.deep.eq(...)

  })
})
