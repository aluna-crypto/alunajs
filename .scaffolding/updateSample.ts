import debug from 'debug'
import inquirer from 'inquirer'
import { join } from 'path'
import shelljs from 'shelljs'



const log = debug('@aluna.js:scaffold/updateSample')



const ROOT = join(__dirname, '..')
const SRC = join(ROOT, 'src')
const EXCHANGES = join(SRC, 'exchanges')



export async function updateSample () {

  const question = [
    {
      type: 'input',
      name: 'sourceExchangeName',
      message: 'What is the source exchange name? ',
      default: 'Bittrex'
    }
  ]
  
  const answer = await inquirer.prompt(question)
  
  const { sourceExchangeName } = answer

  const exchangeName = sourceExchangeName
  const exchangeUpper = sourceExchangeName.toUpperCase()
  const exchangeLower = sourceExchangeName.toLowerCase()

  const SOURCE_EXCHANGE_DIR = join(EXCHANGES, exchangeLower)

  log('updateSample', {
    exchangeName,
    exchangeUpper,
    exchangeLower,
  })

  const SAMPLE_EXCHANGE_DIR = join(EXCHANGES, 'sample')


  // Resetting folder in advance
  shelljs.rm('-rf', SAMPLE_EXCHANGE_DIR)


  /**
   * Sample files
   */
  log('copying sample files')

  shelljs.cp('-R', SOURCE_EXCHANGE_DIR, SAMPLE_EXCHANGE_DIR)

  const files = shelljs.find(SAMPLE_EXCHANGE_DIR)
    .filter((file) => file.match(/\.ts$/))


  /**
   * Sample strings inside files
   */
  log('replacing strings inside files')

  const exchangeNameRegex = new RegExp(`${exchangeName}`, 'g')
  const exchangeLowerRegex = new RegExp(`${exchangeLower}`, 'g')
  const exchangeUpperRegex = new RegExp(`${exchangeUpper}`, 'g')

  for(const file of files) {
    shelljs.sed('-i', exchangeNameRegex, 'Sample', file)
    shelljs.sed('-i', exchangeLowerRegex, 'sample', file)
    shelljs.sed('-i', exchangeUpperRegex, 'SAMPLE', file)
  }


  /**
   * Sample filenames
   */
  log('renaming files')

  for(const file of files) {

    const regex = new RegExp(`${SAMPLE_EXCHANGE_DIR}.+\\.ts$`, 'mi')

    if (regex.test(file)) {

      let to = file
        .replace(exchangeName, 'Sample')
        .replace(exchangeUpper, 'SAMPLE')
        .replace(exchangeLower, 'sample')

      shelljs.mv(file, to)

      log('mv', { file, to })

    }
  }

}



updateSample()
