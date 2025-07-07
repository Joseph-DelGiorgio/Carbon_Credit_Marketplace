#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Creating Real On-Chain Credit Listings (v2 - CLI Compatible)');
console.log('============================================================');

// Load configuration
const configPath = path.join(__dirname, '../frontend/src/onchain-config.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

const PACKAGE_ID = config.packageId;
const DEVELOPER_CAP_ID = config.developerCapId;
const SAMPLE_PROJECT_ID = config.projects[0].id;

console.log(`Package ID: ${PACKAGE_ID}`);
console.log(`Developer Cap ID: ${DEVELOPER_CAP_ID}`);
console.log(`Sample Project ID: ${SAMPLE_PROJECT_ID}`);

async function runCommand(command) {
  try {
    console.log(`Running: ${command}`);
    const result = execSync(command, { encoding: 'utf8' });
    console.log('✅ Success:', result.trim());
    return result;
  } catch (error) {
    console.log('❌ Error:', error.message);
    throw error;
  }
}

async function createRealListings() {
  try {
    console.log('\n📋 Step 1: Minting credits for testing...');
    
    // Use simple string metadata instead of JSON to avoid CLI version mismatch
    const metadata = 'test_metadata_v2';
    const co2_kg = 1000; // 1000 kg of CO2
    
    // Note: We need to pass the actual Project object, not just the ID
    // The function signature is: mint_credits(cap, project, co2_kg, metadata, ctx)
    const mintCommand = `sui client call --package ${PACKAGE_ID} --module carbon_credit --function mint_credits --args ${DEVELOPER_CAP_ID} ${SAMPLE_PROJECT_ID} ${co2_kg} "${metadata}" --gas-budget 100000000`;
    
    const mintResult = await runCommand(mintCommand);
    
    // Extract the created credit ID from the output
    const creditIdMatch = mintResult.match(/Created Objects:\s*\n\s*ID:\s*([a-f0-9]{64})/);
    if (!creditIdMatch) {
      throw new Error('Could not extract credit ID from mint result');
    }
    
    const creditId = creditIdMatch[1];
    console.log(`✅ Minted credits with ID: ${creditId}`);
    
    console.log('\n📋 Step 2: Creating listing...');
    
    // Create listing with simple arguments
    // The function signature is: create_listing(credit, price, ctx)
    const price = 1000000000; // 1 SUI in MIST (1 SUI = 1,000,000,000 MIST)
    
    const listingCommand = `sui client call --package ${PACKAGE_ID} --module carbon_credit --function create_listing --args ${creditId} ${price} --gas-budget 100000000`;
    
    const listingResult = await runCommand(listingCommand);
    
    // Extract the created listing ID from the output
    const listingIdMatch = listingResult.match(/Created Objects:\s*\n\s*ID:\s*([a-f0-9]{64})/);
    if (!listingIdMatch) {
      throw new Error('Could not extract listing ID from listing result');
    }
    
    const listingId = listingIdMatch[1];
    console.log(`✅ Created listing with ID: ${listingId}`);
    
    console.log('\n📋 Step 3: Updating configuration...');
    
    // Update the config file with real IDs
    const updatedConfig = {
      ...config,
      realListings: [
        {
          id: listingId,
          credit_id: creditId,
          project_id: SAMPLE_PROJECT_ID,
          amount: co2_kg,
          price: 1, // 1 SUI per credit
          seller: 'current_user', // Will be replaced with actual address
          status: 'available',
          created_at: Date.now()
        }
      ]
    };
    
    fs.writeFileSync(configPath, JSON.stringify(updatedConfig, null, 2));
    console.log('✅ Updated onchain-config.json with real listing data');
    
    console.log('\n🎉 Successfully created real on-chain listings!');
    console.log(`Credit ID: ${creditId}`);
    console.log(`Listing ID: ${listingId}`);
    console.log(`Price: 1 SUI per credit`);
    console.log(`Quantity: ${co2_kg} kg CO2`);
    
    console.log('\n📝 Next steps:');
    console.log('1. Update the frontend to use these real IDs');
    console.log('2. Test the buy functionality with real on-chain data');
    console.log('3. Verify the transaction works in the UI');
    
  } catch (error) {
    console.error('\n❌ Failed to create real listings:', error.message);
    
    console.log('\n💡 Alternative approach:');
    console.log('If CLI version mismatch persists, you can:');
    console.log('1. Use Sui Explorer to manually create listings');
    console.log('2. Use the Sui Wallet to interact with the contract');
    console.log('3. Update the config file manually with the created IDs');
    
    console.log('\n🔧 Manual CLI commands:');
    console.log(`Mint credits: sui client call --package ${PACKAGE_ID} --module carbon_credit --function mint_credits --args ${DEVELOPER_CAP_ID} ${SAMPLE_PROJECT_ID} 1000 "test_metadata" --gas-budget 100000000`);
    console.log(`Create listing: sui client call --package ${PACKAGE_ID} --module carbon_credit --function create_listing --args <CREDIT_ID> 1000000000 --gas-budget 100000000`);
    
    console.log('\n🔍 Debugging tips:');
    console.log('1. Check if the project object exists: sui client object ${SAMPLE_PROJECT_ID}');
    console.log('2. Check if the developer cap exists: sui client object ${DEVELOPER_CAP_ID}');
    console.log('3. Verify the package is deployed: sui client object ${PACKAGE_ID}');
  }
}

// Run the script
createRealListings().catch(console.error); 