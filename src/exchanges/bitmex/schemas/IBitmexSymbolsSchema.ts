import { BitmexInstrumentStateEnum } from '../enums/BitmexInstrumentStateEnum'



export interface IBitmexSymbolsSchema {
  symbol: string
  rootSymbol: string
  state: BitmexInstrumentStateEnum
  typ: string
  listing: string
  front: string
  expiry: string | null
  settle: string | null
  listedSettle: string | null
  relistInterval: string | null
  inverseLeg: string
  sellLeg: string
  buyLeg: string
  optionStrikePcnt: number | null
  optionStrikeRound: number | null
  optionStrikePrice: number | null
  optionMultiplier: number | null
  positionCurrency: string
  underlying: string
  quoteCurrency: string
  underlyingSymbol: string
  reference: string
  referenceSymbol: string
  calcInterval: string | null
  publishInterval: string | null
  publishTime: string | null
  maxOrderQty: number
  maxPrice: number
  lotSize: number
  tickSize: number
  multiplier: number
  settlCurrency: string
  underlyingToPositionMultiplier: number | null
  underlyingToSettleMultiplier: number | null
  quoteToSettleMultiplier: number
  isQuanto: boolean
  isInverse: boolean
  initMargin: number
  maintMargin: number
  riskLimit: number
  riskStep: number
  limit: number | null
  capped: boolean
  taxed: boolean
  deleverage: boolean
  makerFee: number
  takerFee: number
  settlementFee: number
  insuranceFee: number
  fundingBaseSymbol: string
  fundingQuoteSymbol: string
  fundingPremiumSymbol: string
  fundingTimestamp: string
  fundingInterval: string
  fundingRate: number
  indicativeFundingRate: number
  rebalanceTimestamp: string | null
  rebalanceInterval: string | null
  openingTimestamp: string
  closingTimestamp: string
  sessionInterval: string
  prevClosePrice: number
  limitDownPrice: number | null
  limitUpPrice: number | null
  bankruptLimitDownPrice: number | null
  bankruptLimitUpPrice: number | null
  prevTotalVolume: number
  totalVolume: number
  volume: number
  volume24h: number
  prevTotalTurnover: number
  totalTurnover: number
  turnover: number
  turnover24h: number
  homeNotional24h: number
  foreignNotional24h: number
  prevPrice24h: number
  vwap: number
  highPrice: number
  lowPrice: number
  lastPrice: number
  lastPriceProtected: number
  lastTickDirection: string
  lastChangePcnt: number
  bidPrice: number
  midPrice: number
  askPrice: number
  impactBidPrice: number
  impactMidPrice: number
  impactAskPrice: number
  hasLiquidity: boolean
  openInterest: number
  openValue: number
  fairMethod: string
  fairBasisRate: number
  fairBasis: number
  fairPrice: number
  markMethod: string
  markPrice: number
  indicativeTaxRate: number | null
  indicativeSettlePrice: number
  optionUnderlyingPrice: number | null
  settledPriceAdjustmentRate: number | null
  settledPrice: number | null
  timestamp: string
}
