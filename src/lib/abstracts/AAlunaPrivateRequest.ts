import {
  IAlunaExchange,
} from './IAlunaExchange'



export abstract class AAlunaPrivateRequest {
  constructor (public exchange: IAlunaExchange) {
    this.exchange = exchange
  }
}
