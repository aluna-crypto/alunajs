import { expect } from 'chai'
import {
  cloneDeep,
  each,
} from 'lodash'

import { PARSED_BALANCES } from '../../../../../../test/fixtures/parsedBalances'
import { mockParse } from '../../../../../../test/mocks/exchange/modules/mockParse'
import { IAlunaCredentialsSchema } from '../../../../../lib/schemas/IAlunaCredentialsSchema'
import { BitmexAuthed } from '../../../BitmexAuthed'
import {
  BITMEX_ASSETS,
  BITMEX_RAW_BALANCES,
} from '../../../test/fixtures/bitmexBalances'
import * as parseMod from './parse'



describe(__filename, () => {

  const credentials: IAlunaCredentialsSchema = {
    key: 'key',
    secret: 'secret',
  }

  it('should parse many Bitmex raw balances just fine', async () => {

    // preparing data
    const rawBalances = cloneDeep(BITMEX_RAW_BALANCES)

    const bitmexAssets = cloneDeep(BITMEX_ASSETS.slice(0, 2))
    bitmexAssets[0].walletBalance = 0

    rawBalances.assets = bitmexAssets


    // mocking
    const { parse } = mockParse({ module: parseMod })

    each(PARSED_BALANCES, (balance, i) => {
      parse.onCall(i).returns({ balance })
    })


    // executing
    const exchange = new BitmexAuthed({ credentials })

    const { balances } = exchange.balance.parseMany({ rawBalances })


    // validating
    expect(balances).to.deep.eq(PARSED_BALANCES)

    expect(parse.callCount).to.be.eq(PARSED_BALANCES.length)

  })

})
