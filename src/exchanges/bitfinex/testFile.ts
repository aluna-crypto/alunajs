// const bitfinex = new Bitfinex({
//   keySecret: {
//     key: 'gS6MQquBBeZQTUXrV2o778pTfFsfoWQ8ngEDr1vDnSs',
//     secret: 'rtWmjckxAZKCWMjxOJivpVW6M002OdiDHvv6GjHDTgL',
//   },



import {
  AlunaAccountEnum,
  AlunaOrderTypesEnum,
  AlunaSideEnum,
} from '../..'
import { Bittrex } from '../bittrex/Bittrex'



// })
const bitfinex = new Bittrex({
  keySecret: {
    key: '335d74291a1245799a17ecd8d3a32cec',
    secret: '13d5b302dad742159add4b8c4ce9b6fc',
  },
})


// const listRaw = async () => {

//   try {

//     const rawGetPosition = await bitfinex.position!.listRaw({
//       openPositionsOnly: true,
//     })

//     console.log(rawGetPosition)

//   } catch (error) {

//     console.log(error)

//   }

// }

// const list = async () => {

//   try {

//     const rawGetPosition = await bitfinex.position!.list({
//       openPositionsOnly: true,
//       // end: 1644267532466,
//       // start: 1638360732,
//     })

//     console.log(rawGetPosition)

//   } catch (error) {

//     console.log(error)

//   }

// }

// const getRaw = async () => {

//   try {

//     const rawGetPosition = await bitfinex.position!.getRaw({
//       id: '151858360',
//       // end: 1644267532466,
//       // start: 1638360732,
//     })

//     console.log(rawGetPosition)

//   } catch (error) {

//     console.log(error)

//   }

// }

// const get = async () => {

//   try {

//     const rawGetPosition = await bitfinex.position!.get({
//       id: '151970561',
//       // end: 1644267532466,
//       // start: 1638360732,
//     })

//     console.log(rawGetPosition)

//   } catch (error) {

//     console.log(error)

//   }

// }

// const close = async () => {

//   try {

//     const rawGetPosition = await bitfinex.position!.close({
//       id: '151970561',
//     })

//     console.log(rawGetPosition)

//   } catch (error) {

//     console.log(error)

//   }

// }

// const parse = async () => {

//   try {

//     const rawGetPosition = await bitfinex.position!.parseMany({
//       rawPositions: BITFINEX_RAW_POSITIONS,
//     })

//     console.log(rawGetPosition)

//   } catch (error) {

//     console.log(error)

//   }

// }


const doSometing = async () => {

  try {

    // const res = await bitfinex.order.list()
    // const res = await bitfinex.order.cancel({
    //   id: 'cd2c151f-6c7e-4328-98cc-a93c8658454f',
    //   symbolPair: 'ETH-USD',
    // })

    // const res = await bitfinex.order.cancel({
    //   id: '092ffa33-7003-4d8b-8177-31a759a301ec',
    //   symbolPair: 'ETH-USD',
    // })

    const res = await bitfinex.order.place({
      account: AlunaAccountEnum.EXCHANGE,
      type: AlunaOrderTypesEnum.MARKET,
      side: AlunaSideEnum.SHORT,
      amount: 3,
      symbolPair: 'ADA-USD',
    })

    console.log(res)


    // const res = await bittrex.key.fetchDetails()

  } catch (e) {

    console.log(e)

  }

}

doSometing()

