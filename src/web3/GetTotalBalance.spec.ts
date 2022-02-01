import { expect } from 'chai'

import { getTotalBalance } from './GetTotalBalance'



describe('Get Total balance', () => {

  it('get user total balances in "all" chains', async function test () {

    // could not make timeout work in any other way
    // so i'm adding this ts-ignore for now
    // @ts-ignore
    this.timeout(3000)

    const address = '0xA8950F8C30595bE20A279b4F2ca54d140128AB1D'

    const data = await getTotalBalance(address)

    expect(data).to.be.ok

  })

})
