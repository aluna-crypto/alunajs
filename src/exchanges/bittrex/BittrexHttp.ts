import {
  IAlunaHttp,
  IAlunaHttpAuthedParams,
  IAlunaHttpPublicParams,
  IAlunaHttpRequestCount,
  IAlunaHttpResponse,
} from '../../lib/core/IAlunaHttp'



export class BittrexHttp implements IAlunaHttp {

  public requestCount: IAlunaHttpRequestCount



  constructor () {

    this.requestCount = {
      authed: 0,
      public: 0,
    }

  }



  public async publicRequest <T> (
    params: IAlunaHttpPublicParams,
  ): Promise<IAlunaHttpResponse<T>> {

    const {
      weight = 1,
    } = params

    this.requestCount.public += weight

    const data: any = {
      ...params,
    }

    return {
      data,
      requestCount: this.requestCount,
    }

  }



  public async authedRequest <T> (
    params: IAlunaHttpAuthedParams,
  ): Promise<IAlunaHttpResponse<T>> {

    const {
      weight = 1,
    } = params

    this.requestCount.authed += weight

    const data: any = {
      ...params,
    }

    return {
      data,
      requestCount: this.requestCount,
    }

  }

}
