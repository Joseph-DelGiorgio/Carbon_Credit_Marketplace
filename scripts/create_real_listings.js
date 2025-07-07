#!/usr/bin/env node

/**
 * Script to create real on-chain credit listings for testing
 * Similar to the Flight Insurance v2 approach
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Load onchain config
const onchainConfig = JSON.parse(fs.readFileSync(path.join(__dirname, '../frontend/src/onchain-config.json'), 'utf8'));

const PACKAGE_ID = onchainConfig.packageId;
const DEVELOPER_CAP_ID = onchainConfig.developerCapId;
const SAMPLE_PROJECT_ID = onchainConfig.testData.sampleProjectId;

console.log('🚀 Creating Real On-Chain Credit Listings for Testing');
console.log('==================================================');
console.log(`Package ID: ${PACKAGE_ID}`);
console.log(`Developer Cap ID: ${DEVELOPER_CAP_ID}`);
console.log(`Sample Project ID: ${SAMPLE_PROJECT_ID}`);
console.log('');

async function runCommand(command) {
  try {
    console.log(`Running: ${command}`);
    const output = execSync(command, { encoding: 'utf8' });
    console.log('✅ Success:', output.trim());
    return output;
  } catch (error) {
    console.error('❌ Error:', error.message);
    throw error;
  }
}

async function createRealListings() {
  console.log('📋 Step 1: Minting credits for testing...');
  
  // Mint credits for the sample project
  const mintCommand = `sui client call --package ${PACKAGE_ID} --module carbon_credit --function mint_credits --args ${DEVELOPER_CAP_ID} ${SAMPLE_PROJECT_ID} 1000 '{"test": "true"}' --gas-budget 100000000`;
  
  try {
    const mintOutput = await runCommand(mintCommand);
    
    // Extract the credit ID from the output
    const creditIdMatch = mintOutput.match(/Created: (0x[a-fA-F0-9]{64})/);
    if (creditIdMatch) {
      const creditId = creditIdMatch[1];
      console.log(`🎯 Minted Credit ID: ${creditId}`);
      
      console.log('\n📋 Step 2: Creating listing for the minted credits...');
      
      // Create a listing for the minted credits
      const listingCommand = `sui client call --package ${PACKAGE_ID} --module carbon_credit --function create_listing --args ${creditId} 1000000000 500 --gas-budget 100000000`;
      
      const listingOutput = await runCommand(listingCommand);
      
      // Extract the listing ID from the output
      const listingIdMatch = listingOutput.match(/Created: (0x[a-fA-F0-9]{64})/);
      if (listingIdMatch) {
        const listingId = listingIdMatch[1];
        console.log(`🎯 Created Listing ID: ${listingId}`);
        
        // Update the onchain config with the real IDs
        const updatedConfig = {
          ...onchainConfig,
          testData: {
            ...onchainConfig.testData,
            sampleCreditId: creditId,
            sampleListingId: listingId
          }
        };
        
        fs.writeFileSync(
          path.join(__dirname, '../frontend/src/onchain-config.json'),
          JSON.stringify(updatedConfig, null, 2)
        );
        
        console.log('\n✅ Successfully created real on-chain listings!');
        console.log('📝 Updated onchain-config.json with real IDs');
        console.log('');
        console.log('🎯 Real IDs for testing:');
        console.log(`   Credit ID: ${creditId}`);
        console.log(`   Listing ID: ${listingId}`);
        console.log('');
        console.log('💡 You can now test the buy functionality with these real on-chain IDs!');
        
      } else {
        console.error('❌ Could not extract listing ID from output');
      }
    } else {
      console.error('❌ Could not extract credit ID from output');
    }
    
  } catch (error) {
    console.error('❌ Failed to create real listings:', error.message);
    console.log('');
    console.log('💡 Manual steps to create listings:');
    console.log('1. Mint credits: sui client call --package <PACKAGE_ID> --module carbon_credit --function mint_credits --args <DEVELOPER_CAP_ID> <PROJECT_ID> <AMOUNT> <METADATA> --gas-budget 100000000');
    console.log('2. Create listing: sui client call --package <PACKAGE_ID> --module carbon_credit --function create_listing --args <CREDIT_ID> <PRICE> <QUANTITY> --gas-budget 100000000');
    console.log('3. Update onchain-config.json with the real IDs');
  }
}

// Check if Sui CLI is available
try {
  execSync('sui --version', { encoding: 'utf8' });
  createRealListings();
} catch (error) {
  console.error('❌ Sui CLI not found. Please install it first:');
  console.log('   https://docs.sui.io/build/install');
} 