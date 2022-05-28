import { FtxMarketTypeEnum } from '../enums/FtxMarketTypeEnum'



export interface IFtxMarketSchema {
  name: string
  baseCurrency: string
  quoteCurrency: string
  quoteVolume24h: number
  change1h: number
  change24h: number
  changeBod: number
  highLeverageFeeExempt: boolean
  minProvideSize: number
  type: FtxMarketTypeEnum
  underlying: string
  enabled: boolean
  ask: number
  bid: number
  last: number
  postOnly: boolean
  price: number
  priceIncrement: number
  sizeIncrement: number
  restricted: boolean
  volumeUsd24h: number
}
