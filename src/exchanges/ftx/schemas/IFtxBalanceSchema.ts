export interface IFtxBalanceSchema {
  coin: string
  free: number
  spotBorrow: number
  total: number
  usdValue: number
  availableWithoutBorrow: number
}
