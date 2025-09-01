export type PricesObject = {
    symbol : String ,
    bid : Number ,
    ask : Number , 
    price : Number
}

export type OpenOrders = {
    orderId : String ,
    userId  : String ,
    type : String, // buy or sell / long or short
    asset : String, // btc or usdt 
    margin : BigInt,
    buy_sell : BigInt,
    qty : Number
}
export let Data : PricesObject[] = [
    {
        symbol : "ETHUSDT",
        bid : 0 ,
        ask : 0 ,
        price : 0 
    },
    {
        symbol : "BTCUSDT",
        bid : 0 ,
        ask : 0 ,
        price : 0 
    },
    {
        symbol : "SOLUSDT",
        bid : 0 ,
        ask : 0 ,
        price : 0
    }
]

export let users : any[] = [];
