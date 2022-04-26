/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import Sinon from 'sinon'
import { ImportMock } from 'ts-mock-imports'



export const mochaHooks = {
  beforeEach () {

    ImportMock.restore()
    Sinon.restore()

  },
}
