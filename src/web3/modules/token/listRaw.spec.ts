import { expect } from 'chai'

import { mockHttp } from '../../../../test/mocks/exchange/Http'
import { AlunaError } from '../../../lib/core/AlunaError'
import { AlunaHttpErrorCodes } from '../../../lib/errors/AlunaHttpErrorCodes'
import { executeAndCatch } from '../../../utils/executeAndCatch'
import { Web3DebankChainsEnum } from '../../enums/Web3DebankChainsEnum'
import { WEB3_DEBANK_TOKEN_LIST } from '../../test/fixtures/tokens'
import { Web3 } from '../../Web3'
import { Web3Http } from '../../Web3Http'
import { DEBANK_API_URL } from '../../webSpecs'



describe(__filename, () => {

  it('should list Web3 raw tokens just fine', async () => {

    // preparing data
    const address = '0x0000000000000000000000000000000000000000'
    const chainId = Web3DebankChainsEnum.ETHEREUM
    const tokens = WEB3_DEBANK_TOKEN_LIST


    // mocking
    const {
      publicRequest,
    } = mockHttp({ classPrototype: Web3Http.prototype })

    publicRequest.returns(Promise.resolve(tokens))


    // executing
    const web3 = new Web3()

    const { rawTokens } = await web3.token.listRaw({
      chainId,
      address,
    })


    // validating
    expect(publicRequest.callCount).to.eq(1)
    expect(publicRequest.firstCall.args[0]).to.deep.eq({
      url: `${DEBANK_API_URL}/user/token_list?id=${address}&chain_id=${chainId}&is_all=false&has_token=true`,
    })

    expect(rawTokens).to.exist
    expect(rawTokens.length).to.be.greaterThan(0)
    expect(rawTokens[0].amount).to.exist

  })


  it('should handle error', async () => {

    // preparing data
    const address = '0x0000000000000000000000000000000000000000'
    const chainId = Web3DebankChainsEnum.ETHEREUM
    const requestError = new Error('Something')


    // mocking
    const {
      publicRequest,
    } = mockHttp({ classPrototype: Web3Http.prototype })

    publicRequest.returns(Promise.reject(requestError))


    // executing
    const web3 = new Web3()

    const {
      error,
      result,
    } = await executeAndCatch(() => {
      return web3.token.listRaw({ address, chainId })
    })


    // validating
    expect(error).to.exist
    expect(result).not.to.exist

    expect(error).to.deep.eq(new AlunaError({
      code: AlunaHttpErrorCodes.REQUEST_ERROR,
      message: 'Error getting Web3 raw tokens.',
      metadata: requestError,
    }))

  })

})
