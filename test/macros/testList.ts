import { expect } from 'chai'
import { IModule } from 'ts-mock-imports/lib/types'

import { IAlunaCredentialsSchema } from '../../src/lib/schemas/IAlunaCredentialsSchema'
import { mockListRaw } from '../mocks/exchange/modules/mockListRaw'
import { mockParseMany } from '../mocks/exchange/modules/mockParseMany'
import { TExchangeAuthedConstructor } from './testPlaceOrder'



export const testList = (params: {
  AuthedClass: TExchangeAuthedConstructor
  exchangeId: string
  rawList: any
  parsedList: any
  listRawModule: IModule
  parseManyModule: IModule
  methodModuleName: string
}) => {

  const {
    AuthedClass,
    listRawModule,
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

    // mocking
    const { listRaw } = mockListRaw({ module: listRawModule })
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
