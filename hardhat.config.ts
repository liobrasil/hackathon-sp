import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "hardhat-gas-report";
// import "@nomicfoundation/hardhat-verify"
import dotenv from "dotenv";
dotenv.config();

const PRIVATE_KEY = process.env.PRIVATE_KEY
const POLYGON_API_KEY = process.env.POLYGON_API_KEY
const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY

const config: HardhatUserConfig = {
  solidity: "0.8.18",
  networks: {
    mumbai: {
      url: "https://rpc.ankr.com/polygon_mumbai",
      accounts: [PRIVATE_KEY!],
      chainId: 80001,
    }
  },
  etherscan: {
    apiKey: POLYGON_API_KEY,
  },
  gasReporter: {
    enabled: true,
    // outputFile: "gas-report.txt",
    noColors: false,
    currency: "USD",
    coinmarketcap: COINMARKETCAP_API_KEY,
    token: "MATIC",
    gasPriceApi: "https://api.polygonscan.com/api?module=proxy&action=eth_gasPrice"
  },
  paths: {
    tests: "tests",
  },
};

export default config;
