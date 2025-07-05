# Carbon Credit Marketplace - Deployment Summary

## Smart Contract Deployment

### ✅ Successfully Deployed to Sui Testnet

**Transaction Details:**
- **Transaction Digest**: `4n58VaXpz1xwwAa7MWMoWHoyYUui4G91RxMpnojhM7Us`
- **Deployer Address**: `0xde5043879bb960b742bd9963bbbb72cf7c46e0c24c54f5859ae2008eced4b997`
- **Gas Used**: ~31.8 SUI
- **Status**: Success ✅

### Contract Addresses

**Package ID**: `0x56ed4d2202dfa0af48f7fd226f7212a043dad81cde369eb208cff339d5689d9e`
- This is the main contract package containing all the carbon credit marketplace functionality

**Upgrade Cap ID**: `0x01f74f60208491d9a88b80fce878f959048fbc01033a1fe0124a41332d05606a`
- This object allows the deployer to upgrade the contract in the future

### Module Information

**Module Name**: `carbon_credit`
- Contains all the carbon credit marketplace functions

### Frontend Integration

The frontend has been updated with the deployed contract addresses in:
- `frontend/src/hooks/useSmartContracts.ts`

### Available Functions

The deployed contract includes the following functions:

1. **initialize_marketplace** - Initialize the marketplace
2. **create_project** - Create a new carbon credit project
3. **list_credits** - List carbon credits for sale
4. **buy_credits** - Purchase carbon credits
5. **retire_credits** - Retire carbon credits
6. **verify_project** - Verify a project with sensor data

### Next Steps

1. **Initialize Marketplace**: Call `initialize_marketplace` with the upgrade cap
2. **Create Projects**: Use the frontend to create carbon credit projects
3. **List Credits**: Project developers can list their credits for sale
4. **Buy Credits**: Users can purchase carbon credits
5. **Verify Projects**: Verifiers can add verification data to projects

### Network Information

- **Network**: Sui Testnet
- **RPC URL**: `https://fullnode.testnet.sui.io:443`
- **Explorer**: https://suiexplorer.com/txblock/4n58VaXpz1xwwAa7MWMoWHoyYUui4G91RxMpnojhM7Us?network=testnet

### Security Notes

- The upgrade cap is owned by the deployer address
- Keep the private key secure for future upgrades
- Consider transferring ownership to a multisig wallet for production

---

**Deployment Date**: July 1, 2025 (Updated)  
**Deployer**: `0xde5043879bb960b742bd9963bbbb72cf7c46e0c24c54f5859ae2008eced4b997` 