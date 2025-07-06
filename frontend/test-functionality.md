# Carbon Credit Marketplace - Functionality Test Guide

## Step 1: Project Listing and Filtering

### Test Project Display
1. **Open the marketplace** at http://localhost:3000
2. **Verify project cards** are displayed with:
   - Project images
   - Project names and descriptions
   - Location and project type
   - Available credits and pricing
   - Verification status badges

### Test View Toggle
1. **Click "All Projects"** - should show all available projects
2. **Click "My Projects"** - should show only projects owned by connected wallet
3. **Verify toggle functionality** works correctly

### Test Project Details Modal
1. **Click "View Details"** on any project card
2. **Verify modal opens** with detailed project information
3. **Check project images** and metadata display correctly
4. **Close modal** using the X button

## Step 2: Credit Minting and Trading

### Test Credit Minting (Project Owner Only)
1. **Connect wallet** that owns a project
2. **Switch to "My Projects"** view
3. **Look for "Mint Credits" button** (blue + icon) on owned projects
4. **Click "Mint Credits"** button
5. **Fill in minting form**:
   - Enter CO2 reduction amount (kg)
   - Add optional verification metadata
6. **Click "Mint Credits"** to submit transaction
7. **Verify success message** appears
8. **Check blockchain** for new credit objects

### Test Credit Trading
1. **Navigate to "Available Credits"** section
2. **Verify credit listings** are displayed in table format
3. **Click "Buy Credits"** on any available listing
4. **Fill in purchase form**:
   - Enter amount to purchase
   - Review total price
5. **Click "Buy Credits"** to submit transaction
6. **Verify success message** appears
7. **Check blockchain** for completed transaction

## Step 3: Advanced Features

### Test Project Creation
1. **Click "Create Project"** button
2. **Fill in project details**:
   - Name, description, location
   - Project type, total credits, price
   - Co-benefits, SDG goals, funding goal
   - Metadata (JSON format)
3. **Submit project creation**
4. **Verify project appears** in "My Projects"

### Test Marketplace Initialization
1. **Connect wallet** for first time
2. **Verify capability initialization** happens automatically
3. **Check console logs** for initialization success

## Expected Results

### Project Listing
- ✅ Projects display with mock data (since RPC calls are simplified)
- ✅ View toggle works between "All Projects" and "My Projects"
- ✅ Project detail modals open and display correctly
- ✅ Project cards show verification status and pricing

### Credit Minting
- ✅ Mint button appears for project owners in "My Projects" view
- ✅ Minting modal opens with project details
- ✅ Form validation works (amount limits, required fields)
- ✅ Transaction submission works (with proper error handling)

### Credit Trading
- ✅ Available credits table displays mock listings
- ✅ Buy credits modal opens with listing details
- ✅ Purchase form shows correct pricing calculations
- ✅ Transaction submission works (with proper error handling)

### Error Handling
- ✅ Invalid amounts show appropriate error messages
- ✅ Network errors display user-friendly messages
- ✅ Wallet connection issues handled gracefully

## Notes
- Currently using mock data for projects and listings due to RPC call limitations
- Real blockchain queries would be implemented in production
- All transactions use the Sui testnet
- Error handling includes user-friendly messages and console logging 