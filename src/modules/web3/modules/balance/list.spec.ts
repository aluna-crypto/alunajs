import { expect } from 'chai'

import { mockHttp } from '../../../../../test/mocks/exchange/Http'
import { WEB3_BALANCES } from '../../test/fixtures/web3Balances'
import { Web3 } from '../../Web3'
import { Web3Http } from '../../Web3Http'



describe(__filename, () => {



  it('should list Web3 raw balances just fine', async () => {

    // preparing data
    // ...


    // mocking
    const {
      publicRequest,
      authedRequest,
    } = mockHttp({ classPrototype: Web3Http.prototype })

    publicRequest.returns(Promise.resolve({
      balances: WEB3_BALANCES,
    }))


    // executing
    const web3 = new Web3()

    const {
      balances,
      requestCount,
    } = await web3.balance.list()


    // validating
    expect(balances).to.deep.eq({ balances: WEB3_BALANCES })
    expect(requestCount).to.exist

    expect(publicRequest.callCount).to.be.eq(1)
    expect(publicRequest.firstCall.args[0]).to.be.deep.eq({
      url: '/balances/list',
    })

    expect(authedRequest.callCount).to.be.eq(0)

  })

})
