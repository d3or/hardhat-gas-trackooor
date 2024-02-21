import { HardhatUserConfig } from 'hardhat/config';
import '@nomicfoundation/hardhat-ethers';

import '../../src/index';

const config: HardhatUserConfig = {
  solidity: '0.8.24',
};

export default config;
