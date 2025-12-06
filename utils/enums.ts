// export enum Chain {
//   solana = 'SOLANA',
//   base = 'BASE',
//   sui = 'SUI',
// }

export enum TransactionStatus {
  INIT = "INIT",
  PAID = "PAID",
  COMPLETED = "COMPLETED",
}

export enum TransactionType {
  onRamp = "ON_RAMP",
  offRamp = "OFF_RAMP",
}

export enum Currency {
  NGN = "NGN",
  GHS = "GHS",
  TZS = "TZS",
  KES = "KES",
  ZAR = "ZAR",
  USD = "USD",
}
export enum RateType {
  onRamp = "onRamp",
  offRamp = "offRamp",
}

export enum Environment {
  Staging = "staging",
  Production = "production",
  Local = "local",
}
