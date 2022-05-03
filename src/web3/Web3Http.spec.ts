import { expect } from 'chai'

import { IAlunaCredentialsSchema } from '../lib/schemas/IAlunaCredentialsSchema'
import * as Web3HttpMod from './Web3Http'



describe(__filename, () => {

  const { Web3Http } = Web3HttpMod


  it('should execute public request just fine', async () => {

    // preparing data
    const url = '/some/public/address'


    // mocking
    // ...

    // executing
    const web3Http = await new Web3Http()

    const response = web3Http.publicRequest({ url })


    // validating
    expect(response).to.be.eq(response)

    expect(web3Http.requestCount.public).to.be.eq(1)
    expect(web3Http.requestCount.authed).to.be.eq(0)

  })



  it('should execute private request just fine', async () => {

    // preparing data
    const url = '/some/private/address?'

    // TODO: refactor credentials
    const credentials: IAlunaCredentialsSchema = {
      key: 'some-key',
      secret: 'some-secret',
      passphrase: 'some-passphrase',
    }


    // mocking
    // ...

    // executing
    const web3Http = await new Web3Http()

    const response = web3Http.authedRequest({ url, credentials })


    // validating
    expect(response).to.be.eq(response)

    expect(web3Http.requestCount.public).to.be.eq(0)
    expect(web3Http.requestCount.authed).to.be.eq(1)

  })



})
