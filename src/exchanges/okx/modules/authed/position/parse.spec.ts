import { expect } from 'chai'

import { IAlunaCredentialsSchema } from '../../../../../lib/schemas/IAlunaCredentialsSchema'
import { OkxAuthed } from '../../../OkxAuthed'
import { OKX_RAW_POSITIONS } from '../../../test/fixtures/okxPositions'



describe(__filename, () => {

  const credentials: IAlunaCredentialsSchema = {
    key: 'key',
    secret: 'secret',
  }

  it('should parse a Okx raw position just fine', async () => {

    // preparing data
    const rawPosition = OKX_RAW_POSITIONS[0]

    const exchange = new OkxAuthed({ credentials })

    const { position } = exchange.position!.parse({ rawPosition })


    // validating
    expect(position).to.exist

    // TODO: add expectations for everything
    // expect(position).to.deep.eq(...)

  })
})
