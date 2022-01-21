import axios from 'axios'

import {
  IAlunaHttp,
  IAlunaHttpPrivateParams,
  IAlunaHttpPublicParams,
} from '../../lib/core/IAlunaHttp'
import { AlunaHttpVerbEnum } from '../../lib/enums/AlunaHtttpVerbEnum'



export const BitfinexHttp: IAlunaHttp = class {



  static async publicRequest<T> (params: IAlunaHttpPublicParams): Promise<T> {

    const {
      url,
      body,
      verb = AlunaHttpVerbEnum.GET,
    } = params

    const requestConfig = {
      url,
      method: verb,
      data: body,
    }

    try {

      const response = await axios.create().request<T>(requestConfig)

      return response.data

    } catch (error) {

      // TODO: Handle errors here
      throw Error(error)

    }

  }

  static async privateRequest<T> (params: IAlunaHttpPrivateParams): Promise<T> {

    // TODO: Implement private request

    throw Error(`Not implemented ${JSON.stringify(params)}`)

  }

}
