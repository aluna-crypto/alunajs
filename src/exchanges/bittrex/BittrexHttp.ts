import {
  IAlunaHttp,
  IAlunaHttpPrivateParams,
  IAlunaHttpPublicParams,
  IAlunaHttpResponse,
} from '../../lib/core/IAlunaHttp'



export class BittrexHttp implements IAlunaHttp {

  public requestCount: number



  constructor () {

    this.requestCount = 0

  }



  public async publicRequest <T> (
    params: IAlunaHttpPublicParams,
  ): Promise<IAlunaHttpResponse<T>> {

    this.requestCount += 1

    const data: any = {
      ...params,
    }

    return {
      data,
      requestCount: this.requestCount,
    }

  }



  public async privateRequest <T> (
    params: IAlunaHttpPrivateParams,
  ): Promise<IAlunaHttpResponse<T>> {

    this.requestCount += 1

    const data: any = {
      ...params,
    }

    return {
      data,
      requestCount: this.requestCount,
    }

  }

}
