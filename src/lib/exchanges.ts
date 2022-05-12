import { poloniex } from '../exchanges/poloniex'
import { poloniexBaseSpecs } from '../exchanges/poloniex/poloniexSpecs'
import { bitmex } from '../exchanges/bitmex'
import { bitmexBaseSpecs } from '../exchanges/bitmex/bitmexSpecs'
import { bitfinex } from '../exchanges/bitfinex'
import { bitfinexBaseSpecs } from '../exchanges/bitfinex/bitfinexSpecs'
import { bittrex } from '../exchanges/bittrex'
import { bittrexBaseSpecs } from '../exchanges/bittrex/bittrexSpecs'
import { gate } from '../exchanges/gate'
import { gateBaseSpecs } from '../exchanges/gate/gateSpecs'
import { valr } from '../exchanges/valr'
import { valrBaseSpecs } from '../exchanges/valr/valrSpecs'



export const exchanges = {
  [poloniexBaseSpecs.id]: poloniex,
  [bitmexBaseSpecs.id]: bitmex,
  [bitfinexBaseSpecs.id]: bitfinex,
  [bittrexBaseSpecs.id]: bittrex,
  [valrBaseSpecs.id]: valr,
  [gateBaseSpecs.id]: gate,
}
