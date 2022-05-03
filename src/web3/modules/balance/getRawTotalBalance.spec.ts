import { expect } from 'chai'

import { mockHttp } from '../../../../test/mocks/exchange/Http'
import { AlunaError } from '../../../lib/core/AlunaError'
import { AlunaHttpErrorCodes } from '../../../lib/errors/AlunaHttpErrorCodes'
import { executeAndCatch } from '../../../utils/executeAndCatch'
import { WEB3_DEBANK_TOTAL_BALANCE } from '../../test/fixtures/totalBalance'
import { Web3 } from '../../Web3'
import { Web3Http } from '../../Web3Http'
import { DEBANK_API_URL } from '../../webSpecs'



describe(__filename, () => {

  it('should get Web3 rawTotalBalance just fine', async () => {

    // preparing data
    const address = '0x0000000000000000000000000000000000000000'


    // mocking
    const {
      publicRequest,
    } = mockHttp({ classPrototype: Web3Http.prototype })

    publicRequest.returns(Promise.resolve(WEB3_DEBANK_TOTAL_BALANCE))


    // executing
    const web3 = new Web3()

    const { rawTotalBalance } = await web3.balance.getRawTotalBalance({
      address,
    })


    // validating
    expect(publicRequest.callCount).to.eq(1)
    expect(publicRequest.firstCall.args[0]).to.deep.eq({
      url: `${DEBANK_API_URL}/user/total_balance?id=${address}`,
    })

    expect(rawTotalBalance.chain_list).to.exist
    expect(rawTotalBalance.total_usd_value).to.exist

  })


  it('should handle error', async () => {

    // preparing data
    const address = '0x0000000000000000000000000000000000000000'
    const requestError = new Error('Something')


    // mocking
    const {
      publicRequest,
    } = mockHttp({ classPrototype: Web3Http.prototype })

    publicRequest.returns(Promise.reject(requestError))


    // executing
    const web3 = new Web3()

    const {
      error,
      result,
    } = await executeAndCatch(() => {
      return web3.balance.getRawTotalBalance({ address })
    })


    // validating
    expect(error).to.exist
    expect(result).not.to.exist

    expect(error).to.deep.eq(new AlunaError({
      code: AlunaHttpErrorCodes.REQUEST_ERROR,
      message: 'Error when getting Web3 raw total balance.',
      metadata: requestError,
    }))

  })

})
