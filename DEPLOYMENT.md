# Carbon Credit Marketplace - Deployment Summary

## Smart Contract Deployment

### ✅ Successfully Deployed to Sui Testnet

**Transaction Details:**
- **Transaction Digest**: `584u7gR5tR8WYVR9QCV8XzkN84E7Vb2i6Y5kaKSip3gU`
- **Deployer Address**: `0xde5043879bb960b742bd9963bbbb72cf7c46e0c24c54f5859ae2008eced4b997`
- **Gas Used**: ~31.8 SUI
- **Status**: Success ✅

### Contract Addresses

**Package ID**: `0x39cd874b2aa262082baaaab414c049b0dcfcef75f7770c20a576f0c976f66a34`
- This is the main contract package containing all the carbon credit marketplace functionality

**Upgrade Cap ID**: `0x5bc2be0185e8274511f8229bb5d05d3eab8aa3b13e6069e8fb1c8235d4cb8133`
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
- **Explorer**: https://suiexplorer.com/txblock/584u7gR5tR8WYVR9QCV8XzkN84E7Vb2i6Y5kaKSip3gU?network=testnet

### Security Notes

- The upgrade cap is owned by the deployer address
- Keep the private key secure for future upgrades
- Consider transferring ownership to a multisig wallet for production

---

**Deployment Date**: July 1, 2025  
**Deployer**: `0xde5043879bb960b742bd9963bbbb72cf7c46e0c24c54f5859ae2008eced4b997` 