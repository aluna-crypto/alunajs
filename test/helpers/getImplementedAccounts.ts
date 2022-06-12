import {
  filter,
  map,
} from 'lodash'

import { AlunaAccountEnum } from '../../src/lib/enums/AlunaAccountEnum'
import { IAlunaExchangeSchema } from '../../src/lib/schemas/IAlunaExchangeSchema'



export const getImplementedAccounts = (params: {
  exchangeSpecs: IAlunaExchangeSchema
}): { accounts: AlunaAccountEnum[] } => {

  const { exchangeSpecs } = params

  const accounts = map(filter(exchangeSpecs.accounts, { implemented: true }), 'type')

  return { accounts }

}
