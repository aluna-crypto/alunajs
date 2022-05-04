import { expect } from 'chai'

/** scaffold:delete-line
import { AlunaError } from '../../../../../lib/core/AlunaError'
import { AlunaGenericErrorCodes } from '../../../../../lib/errors/AlunaGenericErrorCodes'
scaffold:delete-line */
import { IAlunaCredentialsSchema } from '../../../../../lib/schemas/IAlunaCredentialsSchema'
import { SampleAuthed } from '../../../SampleAuthed'
import { SAMPLE_RAW_ORDERS } from '../../../test/fixtures/sampleOrders'



describe(__filename, () => {

  const credentials: IAlunaCredentialsSchema = {
    key: 'key',
    secret: 'secret',
  }

  it('should parse a Sample raw order just fine', async () => {

    // preparing data
    const rawOrder = SAMPLE_RAW_ORDERS[0]

    const exchange = new SampleAuthed({ credentials })

    const { order } = exchange.order.parse({ rawOrder })

    expect(order).to.deep.eq(rawOrder)

    /** scaffold:delete-line
    throw new AlunaError({
      code: AlunaGenericErrorCodes.UNKNOWN,
      message: 'TODO: Implement me',
    })
    scaffold:delete-line */

  })

})
