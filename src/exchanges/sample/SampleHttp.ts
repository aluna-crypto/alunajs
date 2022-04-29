import {
  IAlunaHttp,
  IAlunaHttpAuthedParams,
  IAlunaHttpPublicParams,
  IAlunaHttpRequestCount,
} from '../../lib/core/IAlunaHttp'



export class SampleHttp implements IAlunaHttp {

  public requestCount: IAlunaHttpRequestCount



  constructor() {

    this.requestCount = {
      authed: 0,
      public: 0,
    }

  }



  public async publicRequest <T>(
    params: IAlunaHttpPublicParams,
  ): Promise<T> {

    const {
      weight = 1,
    } = params

    this.requestCount.public += weight

    const data: T = {
      ...params,
    } as any

    return data

  }



  public async authedRequest <T>(
    params: IAlunaHttpAuthedParams,
  ): Promise<T> {

    const {
      weight = 1,
    } = params

    this.requestCount.authed += weight

    const data: T = {
      ...params,
    } as any

    return data

  }

}
