import { expect } from 'chai'

import { IAlunaCredentialsSchema } from '../../src/lib/schemas/IAlunaCredentialsSchema'
import { mockListRaw } from '../mocks/exchange/modules/mockListRaw'
import { mockParseMany } from '../mocks/exchange/modules/mockParseMany'



export const testList = (params: {
  AuthedClass: any
  exchangeId: string
  rawList: any
  parsedList: any
  listModule: any
  parseManyModule: any
  methodModuleName: string
}) => {

  const {
    AuthedClass,
    listModule,
    parseManyModule,
    methodModuleName,
    exchangeId,
    rawList,
    parsedList,
  } = params

  const credentials: IAlunaCredentialsSchema = {
    key: 'key',
    secret: 'secret',
  }

  const listType = methodModuleName

  it(`should list ${exchangeId} ${listType} raw list just fine`, async () => {

    // preparing data


    // mocking
    const { listRaw } = mockListRaw({ module: listModule })
    const { parseMany } = mockParseMany({ module: parseManyModule })

    listRaw.returns(Promise.resolve(rawList))
    parseMany.returns(parsedList)


    // executing
    const exchange = new AuthedClass({ credentials })

    const responseData = await exchange[methodModuleName].list()


    // validating
    const propertiesNum = Object.keys(responseData).length

    expect(propertiesNum).to.be.greaterThanOrEqual(2)

    expect(listRaw.callCount).to.be.eq(1)
    expect(listRaw.firstCall.args[0]).to.be.ok

    expect(parseMany.callCount).to.be.eq(1)
    expect(parseMany.firstCall.args[0]).to.be.ok

  })

}
