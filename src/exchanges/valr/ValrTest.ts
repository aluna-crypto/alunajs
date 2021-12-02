import { Valr } from './Valr'



const executeSymbols = async () => {

  const valrPrivate = new Valr({
    keySecret: {
      key: '',
      secret: '',
    },
  })

  valrPrivate.order.listRaw()


}

executeSymbols()
