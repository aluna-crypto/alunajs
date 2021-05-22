import axios from 'axios'

import {
  AAlunaPublicRequest,
} from '../../../../lib/abstracts/AAlunaPublicRequest'
import {
  IAlunaPublicRequest,
  IAlunaPublicRequestParams,
} from '../../../../lib/abstracts/IAlunaPublicRequest'



export type IValrPublicRequestParams = IAlunaPublicRequestParams

export class ValrPublicRequest
  extends AAlunaPublicRequest
  implements IAlunaPublicRequest {

  async get<T> (params: IValrPublicRequestParams): Promise<T> {

    const {
      url,
      options,
    } = params

    try {

      const res = await axios.get<T>(url, options)

      return res.data

    } catch (error) {

      throw new Error(error)

    }

  }

  async post<T> (params: IValrPublicRequestParams): Promise<T> {

    throw new Error('Method not implemented.')

  }

}
