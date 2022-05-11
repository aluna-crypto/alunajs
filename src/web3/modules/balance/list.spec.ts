import { expect } from 'chai'

import { IAlunaBalanceSchema } from '../../../lib/schemas/IAlunaBalanceSchema'
import { WEB3_DEBANK_CHAIN_LIST } from '../../test/fixtures/chains'
import { WEB3_DEBANK_TOKEN_LIST } from '../../test/fixtures/tokens'
import { Web3 } from '../../Web3'
import { Web3Http } from '../../Web3Http'
import { mockTokenListRaw } from '../token/listRaw.mock'
import { IWeb3GetRawTotalBalanceReturns } from './getRawTotalBalance'
import { mockGetRawTotalBalance } from './getRawTotalBalance.mock'
import { mockBalanceParseMany } from './parseMany.mock'



describe(__filename, () => {

  it('should list Web3 balances just fine', async () => {

    // preparing data
    const http = new Web3Http({})

    const address = '0xA8950F8C30595bE20A279b4F2ca54d140128AB1D'

    const parsedBalances: IAlunaBalanceSchema[] = [
      { itWorked: true } as any, // TODO: use fixtures with proper typing
    ]


    // mocking
    const { getRawTotalBalance } = mockGetRawTotalBalance()
    const { listRaw: tokenListRaw } = mockTokenListRaw()
    const { parseMany: balanceParseMany } = mockBalanceParseMany()

    const totalBalance: IWeb3GetRawTotalBalanceReturns = {
      requestWeight: {
        authed: 0,
        public: 0,
      },
      rawTotalBalance: {
        chain_list: WEB3_DEBANK_CHAIN_LIST,
        total_usd_value: 1,
      },
    }

    tokenListRaw.returns(Promise.resolve({ tokens: WEB3_DEBANK_TOKEN_LIST }))
    getRawTotalBalance.returns(Promise.resolve(totalBalance))
    balanceParseMany.returns({ balances: parsedBalances })


    // executing
    const web3 = new Web3()

    const {
      balances,
      requestWeight,
    } = await web3.balance.list({
      address,
    })


    // validating
    expect(getRawTotalBalance.callCount).to.eq(1)
    expect(tokenListRaw.callCount).to.eq(WEB3_DEBANK_CHAIN_LIST.length)
    expect(balanceParseMany.callCount).to.eq(1)

    expect(getRawTotalBalance.firstCall.args[0]).to.deep.eq({
      address,
      http, // <— http always present down the chain
    })

    expect(tokenListRaw.firstCall.args[0]).to.deep.eq({
      address,
      http, // <— http always present down the chain
      chainId: 'eth',
    })

    expect(requestWeight.authed).to.exist
    expect(requestWeight.public).to.exist

    expect(balances).to.deep.eq(parsedBalances)

  })

})
