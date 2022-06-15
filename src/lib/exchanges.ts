import { okx } from '../exchanges/okx'
import { okxBaseSpecs } from '../exchanges/okx/okxSpecs'
import { binance } from '../exchanges/binance'
import { binanceBaseSpecs } from '../exchanges/binance/binanceSpecs'
import { bitfinex } from '../exchanges/bitfinex'
import { bitfinexBaseSpecs } from '../exchanges/bitfinex/bitfinexSpecs'
import { bitmex } from '../exchanges/bitmex'
import { bitmexBaseSpecs } from '../exchanges/bitmex/bitmexSpecs'
import { bittrex } from '../exchanges/bittrex'
import { bittrexBaseSpecs } from '../exchanges/bittrex/bittrexSpecs'
import { ftx } from '../exchanges/ftx'
import { ftxBaseSpecs } from '../exchanges/ftx/ftxSpecs'
import { gate } from '../exchanges/gate'
import { gateBaseSpecs } from '../exchanges/gate/gateSpecs'
import { poloniex } from '../exchanges/poloniex'
import { poloniexBaseSpecs } from '../exchanges/poloniex/poloniexSpecs'
import { valr } from '../exchanges/valr'
import { valrBaseSpecs } from '../exchanges/valr/valrSpecs'



export const exchanges = {
  [okxBaseSpecs.id]: okx,
  [ftxBaseSpecs.id]: ftx,
  [poloniexBaseSpecs.id]: poloniex,
  [binanceBaseSpecs.id]: binance,
  [bitmexBaseSpecs.id]: bitmex,
  [bitfinexBaseSpecs.id]: bitfinex,
  [bittrexBaseSpecs.id]: bittrex,
  [valrBaseSpecs.id]: valr,
  [gateBaseSpecs.id]: gate,
}
