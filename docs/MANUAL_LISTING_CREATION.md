# Manual On-Chain Listing Creation Guide

Due to CLI version mismatch (client 1.35.0 vs server 1.51.1), we need to create real on-chain listings manually using Sui Explorer or Sui Wallet.

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

# Check package deployment
sui client object 0x864b5341edda1e1e71485e4f0fedf59079a66ee65cfb77acf38843da0c884cae
```

## 🚀 Step 2: Mint Credits (Sui Explorer)

1. **Open Sui Explorer**: https://suiexplorer.com/txblock?network=testnet
2. **Connect your wallet**
3. **Go to "Move Call" tab**
4. **Fill in the transaction details**:

```
Package ID: 0x864b5341edda1e1e71485e4f0fedf59079a66ee65cfb77acf38843da0c884cae
Module: carbon_credit
Function: mint_credits
Arguments:
  - 0x2680f9f98247dcab1f4214bff86ac50cd76f017240cb872dfcf85d5c8001817e (Developer Cap)
  - 0x4a9304a9fdbc7b25cb47bd82beacac56e4a83d773b213b8228e3b346b471ccfe (Project Object)
  - 1000 (CO2 kg)
  - "test_metadata_v2" (Metadata string)
```

5. **Set gas budget**: 100,000,000 MIST
6. **Execute transaction**
7. **Note the created Credit ID** from the transaction result

## 🏪 Step 3: Create Listing (Sui Explorer)

1. **Use the Credit ID from Step 2**
2. **Fill in the transaction details**:

```
Package ID: 0x864b5341edda1e1e71485e4f0fedf59079a66ee65cfb77acf38843da0c884cae
Module: carbon_credit
Function: create_listing
Arguments:
  - <CREDIT_ID_FROM_STEP_2> (Carbon Credit Object)
  - 1000000000 (Price in MIST = 1 SUI)
```

3. **Set gas budget**: 100,000,000 MIST
4. **Execute transaction**
5. **Note the created Listing ID** from the transaction result

## 🔄 Step 4: Update Frontend Configuration

After creating the listings, update `frontend/src/onchain-config.json`:

```json
{
  "packageId": "0x864b5341edda1e1e71485e4f0fedf59079a66ee65cfb77acf38843da0c884cae",
  "developerCapId": "0x2680f9f98247dcab1f4214bff86ac50cd76f017240cb872dfcf85d5c8001817e",
  "projects": [
    {
      "id": "0x4a9304a9fdbc7b25cb47bd82beacac56e4a83d773b213b8228e3b346b471ccfe",
      "name": "Sample Project",
      "location": "Sample Location",
      "project_type": "reforestation",
      "description": "Sample project description",
      "total_credits": 10000,
      "credits_issued": 1000,
      "price_per_credit": 1,
      "verification_status": 1,
      "funding_goal": 10000,
      "funding_raised": 0
    }
  ],
  "realListings": [
    {
      "id": "<LISTING_ID_FROM_STEP_3>",
      "credit_id": "<CREDIT_ID_FROM_STEP_2>",
      "project_id": "0x4a9304a9fdbc7b25cb47bd82beacac56e4a83d773b213b8228e3b346b471ccfe",
      "amount": 1000,
      "price": 1,
      "seller": "<YOUR_WALLET_ADDRESS>",
      "status": "available",
      "created_at": 1234567890
    }
  ]
}
```

## 🧪 Step 5: Test the Frontend

1. **Start the frontend**: `cd frontend && yarn dev`
2. **Connect your wallet**
3. **Browse to the marketplace**
4. **Try to buy credits** using the real listing IDs
5. **Verify the transaction works**

## 🔍 Alternative: Sui Wallet Method

If Sui Explorer doesn't work, you can also use Sui Wallet directly:

1. **Open Sui Wallet**
2. **Go to "Send" tab**
3. **Select "Move Call"**
4. **Fill in the same details as above**
5. **Execute the transaction**

## 🐛 Troubleshooting

### Common Issues

1. **"Object not found"**: Make sure the object IDs are correct
2. **"Insufficient gas"**: Add more SUI to your wallet
3. **"Function not found"**: Check the module and function names
4. **"Invalid arguments"**: Verify argument types and order

### Debug Commands

```bash
# Check transaction status
sui client tx <TRANSACTION_DIGEST>

# List your objects
sui client objects

# Check specific object
sui client object <OBJECT_ID>
```

## 📝 Expected Results

After successful execution, you should have:

1. **Carbon Credit Object**: Represents 1000 kg of CO2 credits
2. **Credit Listing Object**: Available for purchase at 1 SUI
3. **Updated frontend**: Using real on-chain data
4. **Working buy functionality**: Users can purchase credits

## 🎉 Success Criteria

- ✅ Credits minted successfully
- ✅ Listing created successfully  
- ✅ Frontend shows real listing data
- ✅ Buy transaction executes without errors
- ✅ Credits transferred to buyer
- ✅ Payment transferred to seller

## 🔗 Useful Links

- [Sui Explorer](https://suiexplorer.com/txblock?network=testnet)
- [Sui Wallet](https://chrome.google.com/webstore/detail/sui-wallet/opcgpfmipidbgpenhmajoajpbobppdil)
- [Sui Testnet Faucet](https://suiexplorer.com/faucet?network=testnet)
- [Sui Documentation](https://docs.sui.io/)

---

**Note**: This manual approach bypasses the CLI version mismatch issue and allows us to test the full functionality with real on-chain data, just like we did successfully in the Flight Insurance v2 project. 