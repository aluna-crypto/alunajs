import { readFileSync } from 'fs'
import { join } from 'path'

import { replaceSync } from '../utils/replaceSync'
import { IBoostrapMethodParams } from './IBoostrapMethodParams'



export const patchAlunaSpec = (
  params: IBoostrapMethodParams,
) => {

  const {
    log,
    paths: { SRC },
  } = params

  log('patching `src/aluna.spec.ts` file')

  const specFilepath = join(SRC, 'aluna.spec.ts')
  const exchangesFilepath = join(SRC, 'lib', 'exchanges.ts')

  const contents = readFileSync(exchangesFilepath, 'utf8')
  const matches = contents.match(/\:/g) || []

  const exchangesNum = matches.length

  const specSearch = new RegExp(
    `expect\\(exchangeIds\\.length\\)\\.to\\.eq\\(${exchangesNum - 1}\\)`,
    'g',
  )

  const specReplace = `expect(exchangeIds.length).to.eq(${exchangesNum})`

  replaceSync({
    filepath: specFilepath,
    search: specSearch,
    replace: specReplace,
    condition: (contents: string) => contents.indexOf(specReplace) === -1
  })

}
