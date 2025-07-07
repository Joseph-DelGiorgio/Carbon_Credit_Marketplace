#!/usr/bin/env node

const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Creating Real On-Chain Credit Listings (v3 - Sui CLI 1.51.x Compatible)');
console.log('==========================================================================');

// Load configuration
const configPath = path.join(__dirname, '../frontend/src/onchain-config.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

const PACKAGE_ID = config.packageId;
const DEVELOPER_CAP_ID = config.developerCapId;
const PROJECTS = config.projects;

if (!PACKAGE_ID || !DEVELOPER_CAP_ID || !PROJECTS || PROJECTS.length === 0) {
  console.error('❌ Missing on-chain config. Please check your onchain-config.json.');
  process.exit(1);
}

const SUI_BIN = 'sui';
const MODULE = 'carbon_credit';

// Use real on-chain object IDs for ProjectDeveloperCap and Project
const PROJECT_DEVELOPER_CAP_IDS = [
  '0x2680f9f98247dcab1f4214bff86ac50cd76f017240cb872dfcf85d5c8001817e',
];
const PROJECT_OBJECT_IDS = [
  '0x2680f9f98247dcab1f4214bff86ac50cd76f017240cb872dfcf85d5c8001817e',
];

function callSui(args) {
  try {
    return execFileSync('sui', args, { stdio: 'pipe' }).toString();
  } catch (e) {
    console.error('❌ Sui CLI call failed:', e.stdout?.toString() || e.message);
    process.exit(1);
  }
}

function mintCredits(developerCapId, projectObjectId, amount, metadata) {
  const args = [
    'client',
    'call',
    '--package', PACKAGE_ID,
    '--module', MODULE,
    '--function', 'mint_credits',
    '--args', developerCapId, projectObjectId, `${amount}`, metadata,
    '--gas-budget', '100000000',
    '--json',
  ];
  console.log(`Minting credits for project object ${projectObjectId}...`);
  const output = callSui(args);
  const parsed = JSON.parse(output);
  const created = parsed.effects.created || [];
  const creditObj = created.find(obj => obj.owner?.AddressOwner);
  if (!creditObj) {
    throw new Error('No credit object created!');
  }
  return creditObj.reference.objectId;
}

function createListing(creditId, price) {
  // The user must own the credit object
  const args = [
    'client',
    'call',
    '--package', PACKAGE_ID,
    '--module', MODULE,
    '--function', 'create_listing',
    '--args', creditId, `${price}`,
    '--gas-budget', '100000000',
    '--json',
  ];
  console.log(`Creating listing for credit ${creditId}...`);
  const output = callSui(args);
  const parsed = JSON.parse(output);
  // Find the new Listing object ID
  const created = parsed.effects.created || [];
  const listingObj = created.find(obj => obj.owner?.AddressOwner);
  if (!listingObj) {
    throw new Error('No listing object created!');
  }
  return listingObj.reference.objectId;
}

function createProject({ name, location, project_type, description, total_credits, price_per_credit, co_benefits, sdg_goals, funding_goal, metadata }) {
  const args = [
    'client',
    'call',
    '--package', PACKAGE_ID,
    '--module', MODULE,
    '--function', 'create_project',
    '--args',
    name,
    location,
    project_type,
    description,
    `${total_credits}`,
    `${price_per_credit}`,
    JSON.stringify(co_benefits),
    JSON.stringify(sdg_goals),
    `${funding_goal}`,
    metadata,
    '--gas-budget', '100000000',
    '--json',
  ];
  console.log(`Creating project: ${name}...`);
  const output = callSui(args);
  console.log('Raw CLI output:', output);
  const parsed = JSON.parse(output);
  const created = parsed.effects.created || [];
  let projectObj = created.find(obj => obj.type && obj.type.includes('Project'));
  if (!projectObj) {
    // Try objectChanges as fallback
    if (parsed.objectChanges) {
      const objChange = parsed.objectChanges.find(
        (c) => c.type === 'created' && c.objectType && c.objectType.includes('Project')
      );
      if (objChange) {
        return objChange.objectId;
      }
    }
    throw new Error('No Project object created!');
  }
  return projectObj.reference.objectId;
}

// Main logic
const listings = [];
for (let i = 0; i < 1; i++) {
  const project = PROJECTS[i];
  // Create a new project on-chain
  const projectInput = {
    name: project.name || `Project ${i + 1}`,
    location: project.location || 'Unknown',
    project_type: project.project_type || 'Reforestation',
    description: project.description || 'Automated project creation',
    total_credits: project.total_credits || 1000,
    price_per_credit: project.price_per_credit || 100_000_000, // 0.1 SUI in MIST
    co_benefits: project.co_benefits || ['Biodiversity'],
    sdg_goals: project.sdg_goals || [13],
    funding_goal: project.funding_goal || 1000000000,
    metadata: typeof project.metadata === 'string' ? project.metadata : '',
  };
  let projectObjectId;
  try {
    projectObjectId = createProject(projectInput);
    // Save new project to config
    project.id = projectObjectId;
    config.projects[i].id = projectObjectId;
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
    console.log(`✅ Created project: ${projectObjectId}`);
  } catch (e) {
    console.error('❌ Error creating project:', e.message);
    if (e.stdout) {
      console.error('Raw CLI output:', e.stdout.toString());
    }
    continue;
  }
  const developerCapId = DEVELOPER_CAP_ID;
  const creditAmount = 1000;
  const metadata = `Test Credit ${i + 1}`;
  const price = 100_000_000; // 0.1 SUI in MIST
  try {
    const creditId = mintCredits(developerCapId, projectObjectId, creditAmount, metadata);
    const listingId = createListing(creditId, price);
    listings.push({
      id: listingId,
      credit_id: creditId,
      project_id: projectObjectId,
      price,
      amount: creditAmount,
      status: 'available',
      created_at: Date.now(),
      seller: 'YOUR_ADDRESS_HERE',
    });
    console.log(`✅ Created listing: ${listingId} for credit: ${creditId}`);
  } catch (e) {
    console.error('❌ Error creating listing:', e.message);
  }
}

// Save to config
config.realListings = listings;
fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
console.log('✅ Listings created and saved to onchain-config.json!');

console.log('\n🎉 Success! Real on-chain listings created.');
console.log('\n📊 Summary:');
console.log(`- Total listings: ${listings.length}`);
console.log(`- Total credits minted: ${listings.reduce((total, listing) => total + listing.amount, 0)} kg`);
console.log(`- Total SUI spent: ${listings.reduce((total, listing) => total + listing.price, 0) / 1000000000} SUI`);
console.log('\n🌐 You can now test the buy functionality in the frontend!');
console.log('Frontend URL: http://localhost:3000'); 