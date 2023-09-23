
```
# Install dependencies
pnpm i

# Deploy safe
npx ts-node --esm ./src/01_deploy_safe.ts

# Deploy handler
forge create src/FallbackHandler.sol:FallbackHandler \
    --private-key 0x \
    --rpc-url RPC_URL \
    --constructor-args 0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789

# Copy Safe and handler addresses to .env.

# Connect handler to safe
npx ts-node --esm ./src/02_attach_handler_safe.ts

```