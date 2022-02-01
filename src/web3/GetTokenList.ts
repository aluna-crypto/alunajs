import axios from 'axios'

import { AlunaHttpVerbEnum } from '..'

import { AlunaChainsEnum } from './enums/AlunaChainsEnum'


// QUESTION: where to save this const? it's supposed to be shared by
// multiple files i believe?

const API_URL = 'https://openapi.debank.com/'

/**
 * Returns all non-zero balances for a certain address in the specified chain
 * @param address
 * @param chain_id
 * @returns
 */
export async function getTokenList (
  address: string,
  chain_id: AlunaChainsEnum,
) {

  let url = `${API_URL}v1/user/token_list?`
  url += `id=${address}`
  url += `&chain_id=${chain_id}`
  url += '&is_all=false'
  url += '&has_balance=true'

  const requestConfig = {
    url,
    method: AlunaHttpVerbEnum.GET,
  }

  try {

    const response = await axios.create().request(requestConfig)

    return response.data

  } catch (error) {

    console.log('error getting list of tokens for user')
    console.log(error)
    // throw handleRequestError(error);

  }

}
