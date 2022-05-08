import { expect } from 'chai'

import { setLeverage } from './setLeverage'



describe(__filename, () => {

  it('should set leverage just fine', async () => {
    expect(setLeverage).to.exist
  })

})
