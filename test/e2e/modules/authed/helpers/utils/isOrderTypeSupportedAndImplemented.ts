import { find } from 'lodash'

import { IAlunaExchangeAuthed } from '../../../../../../src/lib/core/IAlunaExchange'
import { AlunaAccountEnum } from '../../../../../../src/lib/enums/AlunaAccountEnum'
import { AlunaOrderTypesEnum } from '../../../../../../src/lib/enums/AlunaOrderTypesEnum'



export const isOrderTypeSupportedAndImplemented = (params: {
  exchangeAuthed: IAlunaExchangeAuthed
  account: AlunaAccountEnum
  orderType: AlunaOrderTypesEnum
}): boolean => {

  const {
    account,
    orderType,
    exchangeAuthed,
  } = params

  const {
    specs: {
      accounts,
    },
  } = exchangeAuthed

  const foundAccount = find(accounts, { type: account })

  if (foundAccount) {

    const {
      supported,
      implemented,
      orderTypes,
    } = foundAccount

    if (supported && implemented) {

      const foundTypes = find(orderTypes, { type: orderType })

      if (foundTypes) {

        const { implemented } = foundTypes

        if (implemented) {

          return true

        }

      }

    }

  }

  return false

}
