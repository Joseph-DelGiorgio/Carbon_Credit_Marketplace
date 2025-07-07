# Manual On-Chain Listing Creation Guide

Due to CLI version mismatch (client 1.35.0 vs server 1.51.1), we need to create real on-chain listings manually using Sui Explorer or Sui Wallet, just like we did in the Flight Insurance v2 project.

## 🎯 Goal
Create real carbon credit listings on-chain that the frontend can use for testing the buy functionality.

## 📋 Prerequisites
- Sui Wallet connected to testnet
- Developer capability initialized
- At least one project created
- Some testnet SUI for gas fees

## 🔧 Step 1: Verify Current State

### Check Your Objects
```bash
# Check your developer capability
sui client object 0x2680f9f98247dcab1f4214bff86ac50cd76f017240cb872dfcf85d5c8001817e

# Check your projects
sui client object 0x4a9304a9fdbc7b25cb47bd82beacac56e4a83d773b213b8228e3b346b471ccfe
sui client object 0x74ae581dd43e40e06eb164338d955495cae0128065da9201de0fdc45d3ac3569
```

## 🚀 Step 2: Manual Creation via Sui Explorer

### Option A: Using Sui Explorer (Recommended)

1. **Go to Sui Explorer Testnet**
   - Visit: https://suiexplorer.com/txblock?network=testnet
   - Connect your wallet

2. **Mint Carbon Credits**
   - **Package ID**: `0x864b5341edda1e1e71485e4f0fedf59079a66ee65cfb77acf38843da0c884cae`
   - **Module**: `carbon_marketplace`
   - **Function**: `mint_credits`
   - **Arguments**:
     - `0x2680f9f98247dcab1f4214bff86ac50cd76f017240cb872dfcf85d5c8001817e` (Developer Cap)
     - `0x4a9304a9fdbc7b25cb47bd82beacac56e4a83d773b213b8228e3b346b471ccfe` (Project ID)
     - `1000` (CO2 kg)
     - `"Sample carbon credits"` (Metadata)
   - **Gas Budget**: `10000000`

3. **Create Credit Listing**
   - **Package ID**: `0x864b5341edda1e1e71485e4f0fedf59079a66ee65cfb77acf38843da0c884cae`
   - **Module**: `carbon_marketplace`
   - **Function**: `create_listing`
   - **Arguments**:
     - `[CREDIT_ID_FROM_STEP_2]` (Credit ID from mint transaction)
     - `1000000000` (1 SUI in MIST)
     - `500` (Quantity)
   - **Gas Budget**: `10000000`

### Option B: Using Sui Wallet

1. **Open Sui Wallet**
2. **Go to "Send & Receive"**
3. **Click "Move Call"**
4. **Enter the same details as above**

## 📊 Step 3: Update Configuration

After creating the listings, update `frontend/src/onchain-config.json`:

```json
{
  "packageId": "0x864b5341edda1e1e71485e4f0fedf59079a66ee65cfb77acf38843da0c884cae",
  "developerCapId": "0x2680f9f98247dcab1f4214bff86ac50cd76f017240cb872dfcf85d5c8001817e",
  "projects": [
    {
      "id": "0x4a9304a9fdbc7b25cb47bd82beacac56e4a83d773b213b8228e3b346b471ccfe",
      "name": "Real Project 1"
    },
    {
      "id": "0x74ae581dd43e40e06eb164338d955495cae0128065da9201de0fdc45d3ac3569", 
      "name": "Real Project 2"
    }
  ],
  "realListings": [
    {
      "id": "[LISTING_ID_FROM_TRANSACTION]",
      "credit_id": "[CREDIT_ID_FROM_TRANSACTION]",
      "seller": "0xde5043879bb960b742bd9963bbbb72cf7c46e0c24c54f5859ae2008eced4b997",
      "price": 1.0,
      "amount": 500,
      "status": "available",
      "created_at": 1704067200000
    }
  ]
}
```

## 🧪 Step 4: Test the Frontend

1. **Start the frontend server** (if not already running):
   ```bash
   cd frontend && yarn dev
   ```

2. **Open the application**: http://localhost:3000

3. **Connect your wallet**

4. **Test the buy functionality**:
   - Browse the marketplace
   - Click "Buy Credits" on a listing
   - Complete the transaction

## 🔍 Troubleshooting

### CLI Version Mismatch
If you see this error:
```
[warn] Client/Server api version mismatch, client api version : 1.35.0, server api version : 1.51.1
```

**Solution**: Use Sui Explorer or Sui Wallet instead of CLI commands.

### Transaction Failures
If transactions fail:
1. Check you have enough SUI for gas fees
2. Verify object IDs are correct
3. Ensure you're on testnet
4. Check the transaction details in Sui Explorer

### Frontend Issues
If the frontend shows errors:
1. Check browser console for errors
2. Verify the config file is updated with real IDs
3. Restart the frontend server

## 📈 Expected Results

After successful creation, you should see:
- Real on-chain credit listings in the frontend
- Working "Buy Credits" functionality
- Successful transactions in your wallet
- Updated balances and listings

## 🎉 Success Criteria

✅ Real on-chain listings created  
✅ Frontend displays real data  
✅ Buy functionality works  
✅ Transactions complete successfully  
✅ No CLI version mismatch errors  

## 🔗 Useful Links

- **Sui Explorer Testnet**: https://suiexplorer.com/txblock?network=testnet
- **Sui Wallet**: https://chrome.google.com/webstore/detail/sui-wallet/opcgpfmipidbgpenhmajoajpbobppdil
- **Package Details**: https://suiexplorer.com/object/0x864b5341edda1e1e71485e4f0fedf59079a66ee65cfb77acf38843da0c884cae?network=testnet

---

**Note**: This approach mirrors exactly how we successfully handled the Flight Insurance v2 project, bypassing CLI version issues by using manual creation via Sui Explorer. 