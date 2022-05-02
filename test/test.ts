import { Bittrex } from '../src/exchanges/bittrex/Bittrex'
import { BittrexHttp } from '../src/exchanges/bittrex/BittrexHttp'



const runMethod = async () => {

  const bittrex = new Bittrex({
    settings: {},
  })

  const auth = await bittrex.auth({
    key: '2f0a0fdedb5f4e7589f65772c35d6c4a',
    secret: '1de1719115ca4e29a4eb2770aaa7ab88',
  })

  try {

    const res = await auth.key.fetchDetails({ http: new BittrexHttp() })

    console.log(res)

  } catch (err) {

    console.log(err)

  }

}



runMethod()
