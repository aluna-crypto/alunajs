export interface IBitmexKeysSchema extends Array<IBitmexKeySchema> {}



export interface IBitmexKeySchema {
  id: string
  secret: string
  name: string
  nonce: number
  cidr: string
  permissions: string[]
  enabled: boolean
  userId: number
  created: string
}

