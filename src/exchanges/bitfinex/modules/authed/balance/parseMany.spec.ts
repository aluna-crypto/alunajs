import { expect } from 'chai'
import {
  each,
  filter,
} from 'lodash'

import { PARSED_BALANCES } from '../../../../../../test/fixtures/parsedBalances'
import { mockParse } from '../../../../../../test/mocks/exchange/modules/mockParse'
import { IAlunaCredentialsSchema } from '../../../../../lib/schemas/IAlunaCredentialsSchema'
import { BitfinexAuthed } from '../../../BitfinexAuthed'
import { BitfinexAccountsEnum } from '../../../enums/BitfinexAccountsEnum'
import { BITFINEX_RAW_BALANCES } from '../../../test/fixtures/bitfinexBalances'
import * as parseMod from './parse'



describe(__filename, () => {

  const credentials: IAlunaCredentialsSchema = {
    key: 'key',
    secret: 'secret',
  }

  it('should parse many Bitfinex raw balances just fine', async () => {

    // preparing data
    const rawBalances = BITFINEX_RAW_BALANCES

    const validRawBalances = filter(BITFINEX_RAW_BALANCES, ([wallet]) => {

      return wallet !== BitfinexAccountsEnum.FUNDING

    })


    // mocking
    const { parse } = mockParse({ module: parseMod })

    each(PARSED_BALANCES, (balance, i) => {
      parse.onCall(i).returns({ balance })
    })


    // executing
    const exchange = new BitfinexAuthed({ credentials })

    const { balances } = exchange.balance.parseMany({ rawBalances })


    // validating
    const expectedBalances = PARSED_BALANCES.slice(0, validRawBalances.length)
    expect(balances).to.deep.eq(expectedBalances)

    expect(parse.callCount).to.be.eq(validRawBalances.length)

  })

})
