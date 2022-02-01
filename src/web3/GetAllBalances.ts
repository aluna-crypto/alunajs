import { getTokenList } from './GetTokenList'
import { getTotalBalance } from './GetTotalBalance'
import { IChainSchema } from './schemas/IChainSchema'



export async function getAllBalances (
  address: string,
) {

  let response: any = {}

  const totalBalances = await getTotalBalance(address)

  // response has all the total balances
  response = { ...totalBalances }

  const promises = totalBalances.chain_list.map(
    async (chain:IChainSchema, index:number) => {

      response.chain_list[index].tokens = await getTokenList(address, chain.id)

    },
  )

  await Promise.all(promises)

  return response

}
