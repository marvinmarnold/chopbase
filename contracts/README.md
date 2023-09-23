

- FallbackHandler: Set as fallback handler and module for Safe.
- SomeNft: The smart contract that the dev team is ultimately trying to deploy.


## Quickstart

1. Install pre-requisites: node and foundry installed
2. Install dependencies: `pnpm i`
3. Build: `forge build`
4. Deploy fallback handler: Replace private key and RPC.
```
forge create src/FallbackHandler.sol:FallbackHandler \
    --private-key 0x \
    --rpc-url RPC_URL \
    --constructor-args 0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789
```