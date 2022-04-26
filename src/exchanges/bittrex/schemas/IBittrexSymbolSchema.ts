export interface IBittrexSymbolSchema {
  symbol: string
  name: string
  coinType: string
  status: string
  minConfirmations: number
  notice: string
  txFee: string
  logoUrl: string
  prohibitedIn: string[]
  baseAddress: string
  associatedTermsOfService: string[]
  tags: string[]
}
