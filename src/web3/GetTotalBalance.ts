import axios from 'axios'

import { AlunaHttpVerbEnum } from '..'



const API_URL = 'https://openapi.debank.com/'

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

    return response.data

  } catch (error) {

    console.log('error getting user total balance')
    console.log(error)
    // throw handleRequestError(error);

  }

}
