/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import Sinon from 'sinon'
import { ImportMock } from 'ts-mock-imports'

import { Log } from '../../src/lib/Log'



export const mochaHooks = {
  beforeAll () {

    Log.setSettings({ minLevel: 'fatal' })

  },
  beforeEach () {

    ImportMock.restore()
    Sinon.restore()

  },
}
