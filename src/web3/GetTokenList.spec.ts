import { expect } from 'chai'

import { AlunaChainsEnum } from './enums/AlunaChainsEnum'
import { getTokenList } from './GetTokenList'



describe('Get Token Balances', () => {

  it('get balances on a given chain', async () => {

    const address = '0xA8950F8C30595bE20A279b4F2ca54d140128AB1D'
    const chain_id = AlunaChainsEnum.ETHEREUM

    const data = await getTokenList(address, chain_id)

    console.log('data ->', data)

    expect(data).to.be.ok

  })

})
