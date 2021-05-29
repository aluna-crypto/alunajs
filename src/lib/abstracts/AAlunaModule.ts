import { IAlunaExchange } from './IAlunaExchange'



export abstract class AAlunaModule {

  public readonly exchange: IAlunaExchange



  constructor (params: {
    exchange: IAlunaExchange,
  }) {
    this.exchange = params.exchange
  }

}
