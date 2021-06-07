import { Valr } from './Valr'



describe('Valr modules', () => {

  const key = ''

  const secret = ''

  const valrInstance = new Valr({
    keySecret: {
      key,
      secret,
    },
  })



  it.skip('should fetch Valr symbols', async () => {

    const symbols = await Valr.Symbol.list()

    console.log(symbols)

  })



  it.skip('should fetch Valr markets', async () => {

    const markets = await Valr.Market.list()

    console.log(markets)

  })



  it.skip('should fetch Valr key permissions', async () => {

    const permissions = await valrInstance.key.getPermissions()

    console.log(permissions)

  })



  it.skip('should fetch Valr balance', async () => {

    const balance = await valrInstance.balance.list()

    console.log(balance)

  })



  it.skip('should fetch Valr open orders', async () => {

    const orders = await valrInstance.order.list()


    console.log(orders)

  })

  // it.skip('should place and cancel orders for Valr', async () => {

  //   const placedOrder = await valrInstance.Order.place({
  //     amount: '',
  //     rate: '',
  //     side: '',
  //     symbolPair: '',
  //     type: '',
  //   })


  //   console.log(placedOrder)

  //   await valrInstance.Order.cancel({
  //     id: placedOrder.id,
  //     symbolPair: placedOrder.symbolPair,
  //   })

  // })

})
