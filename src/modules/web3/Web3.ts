import {
  balance,
  IWeb3BalanceModule,
} from './modules/balance'



export class Web3 {

  public balance: IWeb3BalanceModule



  constructor() {

    this.balance = balance(this)

    return this

  }

}
