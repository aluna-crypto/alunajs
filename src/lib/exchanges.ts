import { Bittrex } from '../exchanges/bittrex/Bittrex'
import { bittrexBaseSpecs } from '../exchanges/bittrex/bittrexSpecs'



export const exchanges = {
  [bittrexBaseSpecs.id]: Bittrex,
}
