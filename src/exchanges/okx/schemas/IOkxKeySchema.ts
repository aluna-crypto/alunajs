export interface IOkxKeyAccountSchema {
  acctLv: string
  autoLoan: boolean
  ctIsoMode: string
  greeksType: string
  level: string
  levelTmp: string
  mgnIsoMode: string
  posMode: string
  uid: string
}

export interface IOkxKeySchema {
  read: boolean
  trade: boolean
  withdraw: boolean
  accountId: string | undefined
}
