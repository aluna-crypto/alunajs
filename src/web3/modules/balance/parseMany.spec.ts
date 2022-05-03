import { expect } from 'chai'

import { WEB3_DEBANK_TOKEN_LIST } from '../../test/fixtures/tokens'
import { WEB3_DEBANK_TOTAL_BALANCE } from '../../test/fixtures/totalBalance'
import { Web3 } from '../../Web3'



describe(__filename, () => {

  it('should parse web3 balances just fine', () => {

    // preparing data
    const rawTotalBalance = WEB3_DEBANK_TOTAL_BALANCE
    const rawTokenList = WEB3_DEBANK_TOKEN_LIST


    // executing
    const web3 = new Web3()

    const { balances } = web3.balance.parseMany({
      rawTotalBalance,
      rawTokenList,
    })


    // validating
    expect(balances).to.exist
    expect(balances.length).to.eq(WEB3_DEBANK_TOKEN_LIST.length)

  })

})
