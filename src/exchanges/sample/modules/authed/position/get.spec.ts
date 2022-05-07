import { expect } from 'chai'

import { get } from './get'



describe(__filename, () => {

  it('should get position just fine', async () => {
    expect(get).to.exist
  })

})
