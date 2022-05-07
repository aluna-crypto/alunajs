import { expect } from 'chai'

import { getRaw } from './getRaw'



describe(__filename, () => {

  it('should list raw positions just fine', async () => {
    expect(getRaw).to.exist
  })

})
