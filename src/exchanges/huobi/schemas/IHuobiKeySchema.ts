export interface IHuobiKeySchema {
  accessKey: string
  status: string
  note: string
  permission: string
  ipAddresses: string
  validDays: number
  createTime: number
  updateTime: number
}

export interface IHuobiRawKeySchema extends IHuobiKeySchema {
  accountId: number
  userId: number
}
