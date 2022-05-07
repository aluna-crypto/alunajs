import { expect } from 'chai'

import { getLeverage } from './getLeverage'



describe(__filename, () => {

  it('should get leverage just fine', async () => {
    expect(getLeverage).to.exist
  })

})
