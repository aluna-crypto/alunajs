import { ImportMock } from 'ts-mock-imports'

import { Log } from '../src/lib/Log'



Log.setSettings({
  minLevel: 'fatal',
})

beforeEach(() => {

  ImportMock.restore()

})

