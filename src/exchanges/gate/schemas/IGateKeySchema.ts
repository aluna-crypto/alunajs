// TODO: Describe key interface for Gate exchange
export interface IGateKeySchema {
  read: boolean
  trade: boolean
  withdraw: boolean
  accountId?: string
}

export interface IGateKeyAccountResponseSchema {

  /* eslint-disable camelcase */
  user_id: number
  /* eslint-disable camelcase */

}
