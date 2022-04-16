export interface IHuobiBalanceListSchema {
  currency: string
  type: string
  balance: string
  'seq-num': string
}

export interface IHuobiBalanceSchema {
  id: number
  type: string
  state: string
  list: IHuobiBalanceListSchema[]
}

export enum HuobiAccountTypeEnum {
  SPOT = 'spot',
  MARGIN = 'margin',
  OTC = 'otc',
  POINT = 'point',
  SUPER_MARGIN = 'super-margin',
  INVESTMENT = 'investment',
  BORROW = 'borrow'
}

export interface IHuobiUserAccountSchema {
  id: number
  type: HuobiAccountTypeEnum
  subtype: string
  state: string
}
