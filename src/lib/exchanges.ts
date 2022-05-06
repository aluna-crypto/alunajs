import { bitfinex } from '../exchanges/bitfinex'
import { bitfinexBaseSpecs } from '../exchanges/bitfinex/bitfinexSpecs'
import { bittrex } from '../exchanges/bittrex'
import { bittrexBaseSpecs } from '../exchanges/bittrex/bittrexSpecs'
import { gate } from '../exchanges/gate'
import { gateBaseSpecs } from '../exchanges/gate/gateSpecs'
import { valr } from '../exchanges/valr'
import { valrBaseSpecs } from '../exchanges/valr/valrSpecs'



export const exchanges = {
  [bitfinexBaseSpecs.id]: bitfinex,
  [bittrexBaseSpecs.id]: bittrex,
  [valrBaseSpecs.id]: valr,
  [gateBaseSpecs.id]: gate,
}
