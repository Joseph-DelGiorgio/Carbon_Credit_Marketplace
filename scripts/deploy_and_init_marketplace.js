// scripts/deploy_and_init_marketplace.js

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function runCmd(cmd, cwd) {
  try {
    const out = execSync(cmd, { cwd, stdio: ['pipe', 'pipe', 'pipe'] });
    return out.toString();
  } catch (e) {
    console.error(`Error running: ${cmd}`);
    if (e.stdout) console.error(e.stdout.toString());
    if (e.stderr) console.error(e.stderr.toString());
    throw e;
  }
}

const CONTRACTS_DIR = path.join(__dirname, '../contracts');
const FRONTEND_CONFIG = path.join(__dirname, '../frontend/src/onchain-config.json');
const MODULE = 'carbon_marketplace'; // Update if your module name is different
const MODULE_NAME = 'carbon_credit';

// --- CONFIG ---
// Use the already published package ID
const PACKAGE_ID = '0x864b5341edda1e1e71485e4f0fedf59079a66ee65cfb77acf38843da0c884cae';
const SENDER = '0xde5043879bb960b742bd9963bbbb72cf7c46e0c24c54f5859ae2008eced4b997';

console.log('--- Initializing Carbon Credit Marketplace on Sui Testnet ---');

// Skipping publish step, using existing package
console.log('Using existing package ID:', PACKAGE_ID);

function suiString(str) {
  return `{"bytes":"${Buffer.from(str).toString('base64')}"}`;
}

// 1. Create a project
const createProjectOut = runCmd(
  `sui client call --json --package ${PACKAGE_ID} --module ${MODULE_NAME} --function create_project --args ${suiString("Amazon Rainforest")} ${suiString("Brazil")} ${suiString("Forest Conservation")} ${suiString("Protecting 10,000 hectares of Amazon rainforest from deforestation")} 100000 15500000000 [] [] 1000000000 {} --gas-budget 100000000`,
  undefined
);
const createProjectResult = JSON.parse(createProjectOut);
const PROJECT_ID = (createProjectResult.objectChanges.find(obj => obj.objectType && obj.objectType.includes('Project')) || {}).objectId;
if (!PROJECT_ID) throw new Error('Failed to get PROJECT_ID from create_project output');
console.log('Created project:', PROJECT_ID);

// 2. Mint credits
const mintCreditsOut = runCmd(
  `sui client call --json --package ${PACKAGE_ID} --module ${MODULE_NAME} --function mint_credits --args ${PROJECT_ID} 1000 "{}" --gas-budget 100000000`,
  undefined
);
const mintCreditsResult = JSON.parse(mintCreditsOut);
const CREDIT_ID = (mintCreditsResult.objectChanges.find(obj => obj.objectType && obj.objectType.includes('Credit')) || {}).objectId;
if (!CREDIT_ID) throw new Error('Failed to get CREDIT_ID from mint_credits output');
console.log('Minted credits:', CREDIT_ID);

// 3. Create a listing
const createListingOut = runCmd(
  `sui client call --json --package ${PACKAGE_ID} --module ${MODULE_NAME} --function create_listing --args ${CREDIT_ID} 16000000000 1000 --gas-budget 100000000`,
  undefined
);
const createListingResult = JSON.parse(createListingOut);
const LISTING_ID = (createListingResult.objectChanges.find(obj => obj.objectType && obj.objectType.includes('Listing')) || {}).objectId;
if (!LISTING_ID) throw new Error('Failed to get LISTING_ID from create_listing output');
console.log('Created listing:', LISTING_ID);

// 4. Output to frontend config
const config = { PACKAGE_ID, PROJECT_ID, CREDIT_ID, LISTING_ID };
fs.writeFileSync(FRONTEND_CONFIG, JSON.stringify(config, null, 2));
console.log('Wrote onchain config for frontend:', config);

function echoAndRun(msg, fn) {
  console.log(msg);
  return fn();
}

function main() {
  console.log('--- Initializing Carbon Credit Marketplace on Sui Testnet ---');

  // Skipping publish step, using existing package
  console.log('Using existing package ID:', PACKAGE_ID);

  // TODO: Add calls to create project, mint credits, create listing, and output IDs
  // Example (pseudo):
  // const projectId = createProject(...);
  // const creditId = mintCredits(...);
  // const listingId = createListing(...);
  // fs.writeFileSync('frontend/src/onchain-config.json', JSON.stringify({ projectId, creditId, listingId }, null, 2));

  // For now, just output the package ID
  console.log('Initialization script needs to be completed with actual Move calls.');
}

main(); 