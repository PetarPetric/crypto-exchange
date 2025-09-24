export interface CryptoRate {
  usd: number
}

export interface CryptoRates {
  bitcoin: CryptoRate
  ethereum: CryptoRate
  tether: CryptoRate
  solana: CryptoRate
}
