import {
  each,
  filter,
  map,
} from 'lodash'

import { AlunaOrderTypesEnum } from '../../src/lib/enums/AlunaOrderTypesEnum'
import { IAlunaExchangeSchema } from '../../src/lib/schemas/IAlunaExchangeSchema'



export const getImplementedOrderTypes = (params: {
  exchangeSpecs: IAlunaExchangeSchema
}) => {

  const { exchangeSpecs } = params

  const orderTypesDict: Record<string, AlunaOrderTypesEnum[]> = {}

  const accounts = filter(exchangeSpecs.accounts, { implemented: true })

  each(accounts, ({ orderTypes, type: account }) => {

    const types = map(filter(orderTypes, { implemented: true }), 'type')

    orderTypesDict[account] = types

  })

  return { orderTypesDict }

}

