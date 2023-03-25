const dotenv = require("dotenv");
dotenv.config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.9",
    network: {
      hardhat: {
        chainId: 1337,
      },
      localhost: {
        url: "http://127.0.0.1:8545",
        accounts: [`Ox${process.env.MY_PRIVATE_KEY}`],
      },
    },
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
};
