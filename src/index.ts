/* eslint-disable */
import { extendEnvironment } from 'hardhat/config';
import { HardhatRuntimeEnvironment } from 'hardhat/types';

import { GasTracker } from './GasTracker';
import { GetGas } from './GetGas';
import './type-extensions';

extendEnvironment((hre: HardhatRuntimeEnvironment) => {
  hre.GasTracker = GasTracker;
  hre.GetGas = GetGas;
});
