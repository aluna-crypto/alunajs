import axios from 'axios'

import { AlunaHttpVerbEnum } from '..'

import { IChainSchema } from './schemas/IChainSchema'



const API_URL = 'https://openapi.debank.com/'

/**
 * Returns user's total balances ( in usd value ) in all chains
 * @param address
 * @returns
 */
export async function getTotalBalance (
  address: string,
) {

  let url = `${API_URL}v1/user/total_balance?`
  url += `id=${address}`

  const requestConfig = {
    url,
    method: AlunaHttpVerbEnum.GET,
  }

  try {

    const response = await axios.create().request(requestConfig)

    const { chain_list } = response.data

    response.data.chain_list = chain_list.filter((item: IChainSchema) => {

      return item.usd_value !== 0

    })

    return response.data

  } catch (error) {

    console.log('error getting user total balance')
    console.log(error)
    // throw handleRequestError(error);

  }

}
