import { expect } from 'chai'

import { executeAndCatch } from '../../utils/executeAndCatch'
import { getHuobiEndpoints } from './huobiSpecs'



describe(__filename, () => {

  it('should get production endpoints', async () => {

    // executing
    const {
      error,
      result,
    } = await executeAndCatch(() => getHuobiEndpoints({ useTestNet: false }))

    // validating
    expect(error).not.to.be.ok
    expect(result).to.be.ok

  })

  it('should get testnet endpoints', async () => {

    // executing
    const {
      error,
      result,
    } = await executeAndCatch(() => getHuobiEndpoints({ useTestNet: true }))

    // validating
    expect(error).to.be.ok
    expect(result).not.to.be.ok

  })

})
