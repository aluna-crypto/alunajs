import { expect } from 'chai'

import { getRaw } from './getRaw'



describe(__filename, () => {

  it('should get raw position just fine', async () => {
    expect(getRaw).to.exist
  })

})
