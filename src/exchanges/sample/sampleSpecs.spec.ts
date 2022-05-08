import { expect } from 'chai'

import { executeAndCatch } from '../../utils/executeAndCatch'
import { getSampleEndpoints } from './sampleSpecs'



describe(__filename, () => {

  it('should get production endpoints', async () => {

    // executing
    const {
      error,
      result,
    } = await executeAndCatch(() => {
      getSampleEndpoints({ useTestNet: false })
    })

    // validating
    expect(error).not.to.be.ok
    expect(result).to.be.ok

  })

  it('should get testnet endpoints', async () => {

    // executing
    const {
      error,
      result,
    } = await executeAndCatch(() => {
      getSampleEndpoints({ useTestNet: true })
    })

    // validating
    expect(error).not.to.be.ok
    expect(result).to.be.ok

  })

})
