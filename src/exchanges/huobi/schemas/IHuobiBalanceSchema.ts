export interface IHuobiBalanceSchema {
  currency: string
  type: string
  balance: string
  'seq-num': string
}

export interface IHuobiBalanceListSchema {
  id: number
  type: string
  state: string
  list: IHuobiBalanceSchema[]
}
