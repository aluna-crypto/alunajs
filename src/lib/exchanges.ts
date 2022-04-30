import { bittrex } from '../exchanges/bittrex'
import { bittrexBaseSpecs } from '../exchanges/bittrex/bittrexSpecs'



export const exchanges = {
  [bittrexBaseSpecs.id]: bittrex,
}
