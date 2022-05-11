import { expect } from 'chai'

import { IAlunaCredentialsSchema } from '../../../../../lib/schemas/IAlunaCredentialsSchema'
import { BitmexAuthed } from '../../../BitmexAuthed'
import { BITMEX_RAW_POSITIONS } from '../../../test/fixtures/bitmexPositions'



describe(__filename, () => {

  const credentials: IAlunaCredentialsSchema = {
    key: 'key',
    secret: 'secret',
  }

  it('should parse a Bitmex raw position just fine', async () => {

    // preparing data
    const rawPosition = BITMEX_RAW_POSITIONS[0]

    const exchange = new BitmexAuthed({ credentials })

    const { position } = exchange.position!.parse({ rawPosition })


    // validating
    expect(position).to.exist

    // TODO: add expectations for everything
    // expect(position).to.deep.eq(...)

  })
})
