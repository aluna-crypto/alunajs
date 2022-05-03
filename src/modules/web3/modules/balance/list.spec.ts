import { expect } from 'chai'

import { IAlunaBalanceSchema } from '../../../../lib/schemas/IAlunaBalanceSchema'
import { Web3 } from '../../Web3'
import { Web3Http } from '../../Web3Http'
import { mockTokenList } from '../token/list.mock'
import { IWeb3GetTotalBalanceReturns } from './getTotalBalance'
import { mockGetTotalBalance } from './getTotalBalance.mock'
import { mockBalanceParse } from './list.mock'



describe(__filename, () => {

  it('should list Web3 balances just fine', async () => {

    // preparing data
    const http = new Web3Http()
    const address = '0xA8950F8C30595bE20A279b4F2ca54d140128AB1D'
    const parsedBalances: IAlunaBalanceSchema[] = [
      { itWorked: true } as any, // TODO: use fixtures with proper typing
    ]


    // mocking
    const { getTotalBalance } = mockGetTotalBalance()
    const { list: tokenList } = mockTokenList()
    const { parseBalances } = mockBalanceParse()

    const totalBalance: IWeb3GetTotalBalanceReturns = {
      requestCount: {
        authed: 0,
        public: 0,
      },
      totalBalance: {
        chains: [{ id: 'eth' } as any], // TODO: use fixtures with proper typing
        totalUsdValue: 1,
      },
    }

    tokenList.returns(Promise.resolve({ tokens: tokenList }))
    getTotalBalance.returns(Promise.resolve(totalBalance))
    parseBalances.returns(Promise.resolve({ parsedBalances }))

    // executing
    const web3 = new Web3()

    const {
      balances,
      requestCount,
    } = await web3.balance.list({
      address,
    })


    // validating
    expect(getTotalBalance.callCount).to.eq(1)
    expect(tokenList.callCount).to.eq(1)
    expect(parseBalances.callCount).to.eq(1)

    expect(getTotalBalance.firstCall.args[0]).to.deep.eq({
      address,
      http, // <— http always present down the chain
    })

    expect(tokenList.firstCall.args[0]).to.deep.eq({
      address,
      http, // <— http always present down the chain
      chainId: 'eth',
    })

    expect(requestCount.authed).to.exist
    expect(requestCount.public).to.exist

    expect(balances).to.deep.eq(parsedBalances)

  })

})
