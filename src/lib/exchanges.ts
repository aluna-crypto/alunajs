import { valr } from '../exchanges/valr'
import { valrBaseSpecs } from '../exchanges/valr/valrSpecs'
import { bittrex } from '../exchanges/bittrex'
import { bittrexBaseSpecs } from '../exchanges/bittrex/bittrexSpecs'



export const exchanges = {
  [valrBaseSpecs.id]: valr,
  [bittrexBaseSpecs.id]: bittrex,
}
