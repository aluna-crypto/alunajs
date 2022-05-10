import { find } from 'lodash'

import { IAlunaExchangeAuthed } from '../../../../../../src/lib/core/IAlunaExchange'
import { AlunaAccountEnum } from '../../../../../../src/lib/enums/AlunaAccountEnum'
import { AlunaFeaturesModeEnum } from '../../../../../../src/lib/enums/AlunaFeaturesModeEnum'
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

        const { implemented, supported, mode } = foundTypes

        const writeMode = mode === AlunaFeaturesModeEnum.WRITE

        if (implemented && supported && writeMode) {

          return true

        }

      }

    }

  }

  return false

}
