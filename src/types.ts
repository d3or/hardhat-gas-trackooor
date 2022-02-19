export interface GasTrackerConfig {
  logAfterTx?: boolean;
  enabled?: boolean;
  gasPriceApi?: string;
  gasPrice?: number;
  outputFile?: string;
}

export interface GasData {
  [key: string]: {
    gasUsed: number;
    function: string;
    args: (string | number)[];
  };
}
