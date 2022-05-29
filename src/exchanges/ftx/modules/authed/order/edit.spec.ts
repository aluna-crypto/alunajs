import { expect } from 'chai'

import { testEditOrder } from '../../../../../../test/macros/testEditOrder'
import { AlunaOrderTypesEnum } from '../../../../../lib/enums/AlunaOrderTypesEnum'
import { IAlunaCredentialsSchema } from '../../../../../lib/schemas/IAlunaCredentialsSchema'
import { FtxAuthed } from '../../../FtxAuthed'
import { FtxHttp } from '../../../FtxHttp'
import { getFtxEndpoints } from '../../../ftxSpecs'
import { FTX_RAW_ORDERS } from '../../../test/fixtures/ftxOrders'
import * as parseMod from './parse'



describe(__filename, () => {

  const credentials: IAlunaCredentialsSchema = {
    key: 'key',
    secret: 'secret',
  }

  testEditOrder({
    ExchangeAuthed: FtxAuthed,
    HttpClass: FtxHttp,
    parseImportPath: parseMod,
    mockedOrders: [FTX_RAW_ORDERS[0]],
    credentials,
    validationCallback: (params) => {

      const {
        editParams,
        authedRequestStub,
      } = params

      const {
        type,
        amount,
        rate,
        limitRate,
        stopRate,
        id,
      } = editParams

      const body: Record<string, any> = {}

      let url: string

      switch (type) {

        case AlunaOrderTypesEnum.STOP_LIMIT:
          url = getFtxEndpoints({}).order.editTrigger(id)
          body.triggerPrice = stopRate
          body.orderPrice = limitRate
          body.size = amount
          break

        case AlunaOrderTypesEnum.STOP_MARKET:
          url = getFtxEndpoints({}).order.editTrigger(id)
          body.triggerPrice = stopRate
          body.size = amount
          break

        // Limit orders
        default:
          url = getFtxEndpoints({}).order.edit(id)
          body.price = rate
          body.size = amount

      }

      expect(authedRequestStub.firstCall.args[0]).to.deep.eq({
        url,
        credentials,
        body,
      })

    },
  })

})
