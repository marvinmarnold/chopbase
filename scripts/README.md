
```
# 1. Install dependencies
pnpm i

# 2. Deploy safe
npx ts-node --esm ./src/01_deploy_safe.ts

# 3. Deploy handler
forge create src/FallbackHandler.sol:FallbackHandler \
    --private-key 0x \
    --rpc-url RPC_URL \
    --constructor-args 0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789

# 4. Copy Safe and handler addresses to .env.

# 5. Connect handler to safe
npx ts-node --esm ./src/02_attach_handler_safe.ts

# 6. Manually fund the safe

# 7. Send no-op userop
npx ts-node --esm ./src/03_simple_userop.ts
```