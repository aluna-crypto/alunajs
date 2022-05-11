export interface IBitmexKeySchema {
  id: string
  secret?: string
  name: string
  nonce: number
  cidr: string
  permissions: string[] // 'withdraw', ('order' || 'orderCancel')
  enabled: boolean
  userId: number
  created: string
}

