# Quest Contract Project

This is the web3 part of the open-source quest platform.

Follow these steps to get started:

1. I recommend using `pnpm` (just another node package manager but with some caching superpowers) so you better stick to that or otherwise to do as you wish and fall into thousands or error you may use `npm` or `yarn`.

   - Download `pnpm` from their [installation docs](https://pnpm.io/installation) here.

2. Start a local HardHat network and connect your wallet with it do the following:

   - Start a local network by:
     ```bash
     npx harhat node
     ```
     Just installation has to be done with `pnpm` you can run the scripts with npm or npx doesn't matter.
   - This will output some account signatures and their private keys with 1000ETH (money!!!), go to your MetaMask wallet and import that account using any of the given private key just remember which one did you take, store it in the .env or something.

3. Now that you've setup your local hardhat network we can deploy our smart contracts to that, just by using the following command in our hardhat project:

   ```bash
   npx hardhat deploy --network localhost
   ```

   - If you're so over the top and want to deploy with the command `npx hardhat run scripts/deploy.ts`, go help yourself with changing that deploy script, I'm not gonna help you with that, at least for now.

4. For testing you may run your tests as:

   ```bash
   npx hardhat test
   // or
   npx hardhat test --network localhost
   ```

   - I've already setup the deployment thing before every test in the `beforeEach` function, you may not touch that and for accessing the contract just use the `quest` variable.
   - If you're worried about the typeerror in the `Quest` type, don't worry it'll just work fine.

5. If you're writing test and want type bindings and don't want anymore typeerrors just compile the Contracts using
   ```bash
   npx hardhat compile
   ```
   this will generate type-bindings for the project.
