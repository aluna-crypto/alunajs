import { AlunaAccountEnum } from './enums/AlunaChainsEnum'
import { getTokenList } from './GettokenList'



describe('Web3', () => {

  it.only('should get user balances', async () => {

    const address = '0xA8950F8C30595bE20A279b4F2ca54d140128AB1D'
    const chain_id = AlunaAccountEnum.ETHEREUM

    const data = await getTokenList(address, chain_id)

    console.log('data ->', data)

    // expect(Exchanges.Valr).to.be.ok

  })

})
