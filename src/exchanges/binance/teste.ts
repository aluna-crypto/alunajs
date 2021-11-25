import { BinanceMarketModule } from './modules/BinanceMarketModule'



async function ka() {
  const kk = await BinanceMarketModule.listRaw();

  console.log(kk);
}

ka()