import { expect } from 'chai'

import { list } from './list'



describe(__filename, () => {

  it('should get list positions just fine', async () => {
    expect(list).to.exist
  })

})
