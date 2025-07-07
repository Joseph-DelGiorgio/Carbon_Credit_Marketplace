// scripts/create_test_data.js
// Simple script to create test data using basic Sui CLI calls

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configuration
const PACKAGE_ID = '0x864b5341edda1e1e71485e4f0fedf59079a66ee65cfb77acf38843da0c884cae';
const MODULE_NAME = 'carbon_credit';

function runCmd(cmd, cwd = undefined) {
  console.log(`Running: ${cmd}`);
  try {
    const result = execSync(cmd, { 
      cwd: cwd || process.cwd(),
      encoding: 'utf8',
      stdio: 'pipe'
    });
    console.log('Success!');
    return result;
  } catch (error) {
    console.error('Error:', error.message);
    throw error;
  }
}

function parseObjectId(output) {
  // Extract object ID from CLI output
  const match = output.match(/Created Objects:[\s\S]*?ID: (0x[a-fA-F0-9]+)/);
  if (match) {
    return match[1];
  }
  throw new Error('Could not parse object ID from output');
}

function main() {
  console.log('=== Creating Test Data for Carbon Credit Marketplace ===\n');

  try {
    // Step 1: Initialize developer capability (if not already done)
    console.log('1. Initializing developer capability...');
    try {
      runCmd(`sui client call --package ${PACKAGE_ID} --module ${MODULE_NAME} --function initialize_developer_cap --gas-budget 100000000`);
      console.log('✓ Developer capability initialized\n');
    } catch (error) {
      console.log('⚠ Developer capability may already exist\n');
    }

    // Step 2: Create a test project
    console.log('2. Creating test project...');
    const createProjectCmd = `sui client call --package ${PACKAGE_ID} --module ${MODULE_NAME} --function create_project --args "Test Forest Project" "Brazil" "Forest Conservation" "Protecting 1000 hectares of Amazon rainforest" 10000 1000000000 "[]" "[]" 10000000000 "{}" --gas-budget 100000000`;
    
    const projectOutput = runCmd(createProjectCmd);
    const projectId = parseObjectId(projectOutput);
    console.log(`✓ Project created with ID: ${projectId}\n`);

    // Step 3: Mint some credits (we need to do this manually since it requires the project object)
    console.log('3. To mint credits, you need to run this command manually:');
    console.log(`sui client call --package ${PACKAGE_ID} --module ${MODULE_NAME} --function mint_credits --args <YOUR_DEVELOPER_CAP_ID> <PROJECT_OBJECT_ID> 1000 "{}" --gas-budget 100000000`);
    console.log('\nReplace <YOUR_DEVELOPER_CAP_ID> and <PROJECT_OBJECT_ID> with actual IDs from your wallet.\n');

    // Step 4: Create a config file for the frontend
    const config = {
      packageId: PACKAGE_ID,
      moduleName: MODULE_NAME,
      testProjectId: projectId,
      // Add more IDs as you create them manually
      instructions: {
        developerCap: "Run: sui client objects --address <YOUR_ADDRESS> | grep ProjectDeveloperCap",
        projectObject: "Run: sui client objects --address <YOUR_ADDRESS> | grep Project",
        creditObject: "Run: sui client objects --address <YOUR_ADDRESS> | grep CarbonCredit",
        listingObject: "Run: sui client objects --address <YOUR_ADDRESS> | grep CreditListing"
      }
    };

    const configPath = path.join(__dirname, '../frontend/src/onchain-config.json');
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
    console.log(`✓ Config saved to: ${configPath}\n`);

    console.log('=== Next Steps ===');
    console.log('1. Check your wallet for the created project object');
    console.log('2. Manually mint credits using the command above');
    console.log('3. Create listings for the credits');
    console.log('4. Update the frontend to use these real IDs');
    console.log('\nTo find your objects, run: sui client objects --address <YOUR_ADDRESS>');

  } catch (error) {
    console.error('Script failed:', error.message);
    process.exit(1);
  }
}

main(); 