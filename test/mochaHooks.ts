import Sinon from 'sinon'
import { ImportMock } from 'ts-mock-imports'



export const mochaHooks = {
  beforeEach() {

    ImportMock.restore()
    Sinon.restore()

  },
}
