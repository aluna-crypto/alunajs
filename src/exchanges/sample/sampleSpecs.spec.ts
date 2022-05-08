import { expect } from 'chai'

import { getSampleEndpoints } from './sampleSpecs'



describe(__filename, () => {

  it('should differ between producton and testnet urls', () => {

    // executing
    const prod = getSampleEndpoints({ useTestNet: false })
    const test = getSampleEndpoints({ useTestNet: true })

    // validating
    expect(prod.order.list).not.to.eq(test.order.list)

  })

})
