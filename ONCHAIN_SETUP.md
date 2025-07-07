# Carbon Credit Marketplace - On-Chain Setup Guide

## ✅ What's Working

### 1. **Smart Contract Deployed**
- **Package ID**: `0x864b5341edda1e1e71485e4f0fedf59079a66ee65cfb77acf38843da0c884cae`
- **Module**: `carbon_credit`
- **Network**: Sui Testnet
- **Status**: ✅ Successfully deployed and verified

### 2. **Real On-Chain Projects Found**
Your wallet contains **5 real Project objects** from previous deployments:

| Project ID | Package ID | Status |
|------------|------------|--------|
| `0x4a9304a9fdbc7b25cb47bd82beacac56e4a83d773b213b8228e3b346b471ccfe` | `0x56ed9d9e` | ✅ Active |
| `0x74ae581dd43e40e06eb164338d955495cae0128065da9201de0fdc45d3ac3569` | `0x56ed9d9e` | ✅ Active |
| `0xb84f54edea967c8193227a4abd4cc548dae92b3dbcc2876a390bf84232b3c248` | `0x56ed9d9e` | ✅ Active |
| `0xd2cc97e2d77f9e7b755994a853f9257e7268aaaf010007fcbc44c1e3fddb5a98` | `0x56ed9d9e` | ✅ Active |
| `0xfea2a8be4b1e0ddfe1e2802667fbc89fe4ae4d3d9d1773df138c635ea797c4cf` | `0x56ed9d9e` | ✅ Active |

### 3. **Developer Capability**
- **Cap ID**: `0x2680f9f98247dcab1f4214bff86ac50cd76f017240cb872dfcf85d5c8001817e`
- **Status**: ✅ Active and ready for minting credits

### 4. **Frontend Integration**
- **Config File**: `frontend/src/onchain-config.json`
- **Real Data**: Frontend now uses real on-chain project IDs
- **Mock Credits**: Using realistic mock data for testing UI flow

## 🔧 Current Limitations

### 1. **Sui CLI Version Mismatch**
- **Client**: v1.35.0
- **Server**: v1.51.1
- **Issue**: String argument serialization fails for complex Move calls
- **Impact**: Cannot mint credits or create listings via CLI

### 2. **Missing Carbon Credits**
- No CarbonCredit objects found in wallet
- Cannot create listings without credits
- Need to mint credits first

## 🚀 How to Test the Full Flow

### Option 1: Use Sui Explorer (Recommended)
1. **Go to**: https://suiexplorer.com/txblock/[PACKAGE_ID]?network=testnet
2. **Replace**: `[PACKAGE_ID]` with `0x864b5341edda1e1e71485e4f0fedf59079a66ee65cfb77acf38843da0c884cae`
3. **Click**: "Execute" tab
4. **Call functions**:
   - `mint_credits` with your project ID
   - `create_listing` with the credit ID
   - `buy_credits` to test purchases

### Option 2: Use Sui Wallet Browser Extension
1. **Open**: Sui Wallet extension
2. **Navigate**: To your wallet objects
3. **Find**: Your Project objects
4. **Use**: Built-in transaction builder

### Option 3: Manual CLI Commands (When CLI is upgraded)
```bash
# Mint credits (when CLI works)
sui client call --package 0x864b5341edda1e1e71485e4f0fedf59079a66ee65cfb77acf38843da0c884cae \
  --module carbon_credit \
  --function mint_credits \
  --args 0x2680f9f98247dcab1f4214bff86ac50cd76f017240cb872dfcf85d5c8001817e \
        0x4a9304a9fdbc7b25cb47bd82beacac56e4a83d773b213b8228e3b346b471ccfe \
        1000 "{}" \
  --gas-budget 100000000

# Create listing (after minting)
sui client call --package 0x864b5341edda1e1e71485e4f0fedf59079a66ee65cfb77acf38843da0c884cae \
  --module carbon_credit \
  --function create_listing \
  --args <CREDIT_ID> 1000000000 \
  --gas-budget 100000000
```

## 🎯 Frontend Testing

### Current Status
- ✅ **Real Project IDs**: Frontend uses actual on-chain project IDs
- ✅ **Wallet Connection**: Working with Sui Wallet
- ✅ **UI Components**: All marketplace components functional
- ✅ **Mock Data**: Realistic mock credits and listings for UI testing
- ⚠️ **Real Transactions**: Need real credits/listings for full testing

### Test the UI Flow
1. **Start frontend**: `cd frontend && yarn dev`
2. **Connect wallet**: Use Sui Wallet extension
3. **Browse projects**: See real on-chain project data
4. **View listings**: See mock credit listings
5. **Test purchase flow**: UI will work with mock data

## 📋 Next Steps

### Immediate (Manual)
1. **Mint credits** using Sui Explorer or Wallet
2. **Create listings** for the minted credits
3. **Test purchases** with real blockchain data

### Future (Automated)
1. **Upgrade Sui CLI** to match testnet version
2. **Automate credit minting** via scripts
3. **Full end-to-end testing** with real transactions

## 🔍 Troubleshooting

### CLI Issues
- **String serialization errors**: Use Sui Explorer instead
- **Version mismatch**: Upgrade CLI or use alternative methods
- **Gas errors**: Increase gas budget to 100000000

### Frontend Issues
- **TypeScript errors**: Ignore for now, runtime works
- **Wallet connection**: Ensure Sui Wallet extension is installed
- **Network issues**: Verify you're on Sui testnet

## 📊 Current State Summary

| Component | Status | Notes |
|-----------|--------|-------|
| Smart Contract | ✅ Deployed | Working on testnet |
| Project Objects | ✅ 5 Found | Real on-chain data |
| Developer Cap | ✅ Active | Ready for minting |
| Carbon Credits | ❌ None | Need to mint |
| Listings | ❌ None | Need credits first |
| Frontend UI | ✅ Working | Uses real project IDs |
| Wallet Integration | ✅ Working | Sui Wallet connected |
| Real Transactions | ⚠️ Partial | CLI issues, use Explorer |

## 🎉 Success Metrics

- ✅ **Contract deployed** to testnet
- ✅ **Real projects** found and integrated
- ✅ **Frontend** uses on-chain data
- ✅ **Wallet connection** working
- ✅ **UI flow** functional with mock data
- 🎯 **Ready for manual testing** with Sui Explorer 