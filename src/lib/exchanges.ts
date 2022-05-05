import { bitfinex } from '../exchanges/bitfinex'
import { bitfinexBaseSpecs } from '../exchanges/bitfinex/bitfinexSpecs'
import { bittrex } from '../exchanges/bittrex'
import { bittrexBaseSpecs } from '../exchanges/bittrex/bittrexSpecs'



export const exchanges = {
  [bitfinexBaseSpecs.id]: bitfinex,
  [bittrexBaseSpecs.id]: bittrex,
}
