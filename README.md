# Carbon Credit Marketplace

A decentralized carbon credit marketplace built on Sui blockchain, featuring micro-projects, dMRV verification, and transparent trading of carbon credits.

## 🌱 Overview

This project implements a complete carbon credit marketplace that enables:

- **Project Creation**: Developers can create micro-projects for carbon sequestration ✅
- **Credit Minting**: Verified carbon credits are minted as NFTs on Sui
- **dMRV Verification**: Digital Measurement, Reporting, and Verification system
- **Marketplace Trading**: Transparent buying and selling of carbon credits
- **Project Funding**: Direct funding of carbon projects by corporate buyers
- **Credit Retirement**: Permanent retirement of credits to prevent double-spending

## 🏗️ Architecture

### Smart Contracts (Sui Move)
- **Carbon_Marketplace.move**: Core marketplace contract with all business logic ✅
- **Project Management**: Create, fund, and manage carbon projects ✅
- **Credit System**: Mint, verify, trade, and retire carbon credits
- **Capability-based Access Control**: Developer and verifier capabilities
- **Event System**: Comprehensive event emission for transparency

### Frontend (React + TypeScript)
- **Modern UI**: Built with React, TypeScript, and Tailwind CSS ✅
- **Wallet Integration**: Sui wallet connection via @mysten/dapp-kit ✅
- **Smart Contract Integration**: Complete hook system for blockchain interaction ✅
- **State Management**: React Query for efficient data fetching and caching ✅
- **Responsive Design**: Mobile-first design inspired by KlimaDAO ✅

### Backend (Node.js + Prisma)
- **API Layer**: RESTful API for additional data and analytics
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT-based authentication system

## 🚀 Quick Start

### Prerequisites
- Node.js 20.19.0+
- Yarn or npm
- Sui CLI
- PostgreSQL (for backend)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Joseph-DelGiorgio/Carbon_Credit_Marketplace.git
   cd Carbon_Credit_Marketplace
   ```

2. **Install dependencies**
   ```bash
   # Install root dependencies
   yarn install
   
   # Install frontend dependencies
   cd frontend
   yarn install
   
   # Install backend dependencies
   cd ../backend
   yarn install
   ```

3. **Set up environment variables**
   ```bash
   # Copy environment template
   cp env.example .env
   
   # Edit .env with your configuration
   # Add Sui network URLs, database connection, etc.
   ```

4. **Deploy smart contracts (Optional - already deployed)**
   ```bash
   # Build the Move contract
   cd contracts
   sui move build
   
   # Deploy to Sui testnet
   sui client publish --gas-budget 50000000 --skip-dependency-verification
   ```

5. **Start the development servers**
   ```bash
   # Start both frontend and backend
   yarn dev
   
   # Or start individually
   yarn dev:frontend  # Frontend on http://localhost:3000
   yarn dev:backend   # Backend on http://localhost:4000
   ```

## 📱 Usage

### For Project Developers

1. **Connect Wallet**: Use the "Connect Wallet" button to connect your Sui wallet ✅
2. **Initialize Capabilities**: Click "Setup Capabilities" to initialize developer capability
3. **Create Project**: Use "Create Project" to register a new carbon sequestration project ✅
4. **Mint Credits**: After verification, mint carbon credits for your project
5. **List Credits**: Create marketplace listings to sell your credits

### For Verifiers

1. **Initialize Verifier Cap**: Set up verifier capability in the capabilities modal
2. **Verify Credits**: Use dMRV data to verify carbon credits
3. **Update Project Status**: Approve or reject project verification status

### For Buyers

1. **Browse Projects**: View available carbon projects and their details
2. **Purchase Credits**: Buy verified carbon credits from the marketplace
3. **Fund Projects**: Directly fund projects you want to support
4. **Retire Credits**: Permanently retire credits to offset your carbon footprint

## 🔧 Smart Contract Functions

### Project Management
- `create_project()`: Create a new carbon sequestration project ✅
- `fund_project()`: Fund a project directly
- `update_project_verification()`: Update project verification status

### Credit Operations
- `mint_credits()`: Mint carbon credits for a project
- `verify_credit()`: Verify credits through dMRV system
- `create_listing()`: Create marketplace listing for credits
- `buy_credits()`: Purchase credits from marketplace
- `retire_credit()`: Permanently retire credits

### Capability Management
- `initialize_developer_cap()`: Initialize developer capability
- `initialize_verifier_cap()`: Initialize verifier capability

## 🎨 UI Components

### Core Components
- **Navbar**: Navigation and wallet connection ✅
- **WalletStatus**: Display wallet connection state ✅
- **CreateProjectButton**: Modal for project creation ✅
- **CapabilityInitializer**: Setup developer/verifier capabilities ✅
- **ProjectCard**: Display project information
- **FiltersSidebar**: Filter projects by various criteria
- **StatsBar**: Display marketplace statistics

### Smart Contract Integration
- **useSmartContracts**: Comprehensive hook for all contract operations ✅
- **React Query Integration**: Efficient data fetching and caching ✅
- **Error Handling**: Proper error handling and user feedback ✅
- **Loading States**: Loading indicators for all operations ✅

## 🌐 Networks

### Testnet (Currently Deployed)
- **Sui Testnet**: `https://fullnode.testnet.sui.io:443`
- **Package ID**: `0x56ed4d2202dfa0af48f7fd226f7212a043dad81cde369eb208cff339d5689d9e`
- **Transaction Digest**: `4n58VaXpz1xwwAa7MWMoWHoyYUui4G91RxMpnojhM7Us`
- **Explorer**: https://suiexplorer.com/txblock/4n58VaXpz1xwwAa7MWMoWHoyYUui4G91RxMpnojhM7Us?network=testnet

### Mainnet
- **Sui Mainnet**: `https://fullnode.mainnet.sui.io:443`
- **Package ID**: Will be updated after mainnet deployment

## 📊 Features

### Carbon Credit Features
- **Micro-projects**: Small-scale carbon sequestration projects ✅
- **dMRV Integration**: Digital verification with sensor/satellite data
- **Transparent Pricing**: Market-driven pricing in SUI ✅
- **Co-benefits Tracking**: Additional environmental and social benefits ✅
- **SDG Alignment**: United Nations Sustainable Development Goals tracking ✅

### Marketplace Features
- **Real-time Trading**: Instant credit trading on blockchain
- **Project Funding**: Direct funding of carbon projects
- **Credit Retirement**: Permanent retirement with certificates
- **Event Transparency**: All transactions recorded on blockchain ✅
- **Access Control**: Capability-based permission system

### User Experience
- **Wallet Integration**: Seamless Sui wallet connection ✅
- **Responsive Design**: Works on desktop and mobile ✅
- **Real-time Updates**: Live data from blockchain ✅
- **Error Handling**: User-friendly error messages ✅
- **Loading States**: Clear feedback during operations ✅

## 🔒 Security

### Smart Contract Security
- **Capability-based Access Control**: Secure permission system
- **Input Validation**: Comprehensive parameter validation ✅
- **Error Handling**: Proper error codes and messages ✅
- **Event Emission**: Transparent transaction logging ✅
- **Double-spending Prevention**: Credit retirement system

### Frontend Security
- **Wallet Integration**: Secure wallet connection via @mysten/dapp-kit ✅
- **Input Sanitization**: Proper form validation ✅
- **Error Boundaries**: Graceful error handling ✅
- **HTTPS**: Secure communication protocols

## 🧪 Testing

### Smart Contract Testing
```bash
# Run Move tests
cd contracts
sui move test
```

### Frontend Testing
```bash
# Run frontend tests
cd frontend
yarn test
```

### Integration Testing
```bash
# Run integration tests
yarn test:integration
```

## 📈 Roadmap

### Phase 1: Core Marketplace ✅
- [x] Smart contract development
- [x] Basic frontend UI
- [x] Wallet integration
- [x] Project creation and management
- [x] Contract deployment to testnet
- [x] Successful project creation functionality

### Phase 2: Enhanced Features 🚧
- [ ] Advanced filtering and search
- [ ] Project analytics dashboard
- [ ] Credit verification workflow
- [ ] Mobile app development
- [ ] Credit minting and trading

### Phase 3: Advanced Features 📋
- [ ] Carbon credit derivatives
- [ ] Automated verification systems
- [ ] Cross-chain integration
- [ ] Advanced analytics and reporting

### Phase 4: Ecosystem Expansion 📋
- [ ] Partner integrations
- [ ] API marketplace
- [ ] Governance system
- [ ] DAO structure

## 🎉 Recent Achievements

### ✅ Successfully Deployed
- **Smart Contract**: Deployed to Sui testnet with package ID `0x56ed4d2202dfa0af48f7fd226f7212a043dad81cde369eb208cff339d5689d9e`
- **Frontend**: Fully functional React application with wallet integration
- **Project Creation**: Successfully tested project creation with real blockchain transactions

### ✅ Working Features
- **Wallet Connection**: Seamless Sui wallet integration
- **Project Creation**: Complete form with all required fields (name, location, description, project type, total credits, price per credit, co-benefits, SDG goals, funding goal, metadata)
- **Smart Contract Integration**: Proper SUI to MIST conversion and transaction handling
- **Form Validation**: Comprehensive input validation and error handling
- **UI/UX**: Modern, responsive design inspired by KlimaDAO

### ✅ Technical Milestones
- **Move Contract**: Successfully built and deployed with Sui Move 2024 compatibility
- **Frontend**: React + TypeScript + Tailwind CSS with @mysten/dapp-kit integration
- **Transaction Handling**: Proper BigInt conversion and transaction serialization
- **Error Resolution**: Fixed ArityMismatch, NaN form values, and BigInt conversion issues

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Setup
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

### Code Style
- **Frontend**: ESLint + Prettier
- **Smart Contracts**: Sui Move standards
- **Backend**: Standard Node.js practices

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Sui Foundation**: For the excellent blockchain platform
- **KlimaDAO**: For inspiration in carbon market design
- **OpenZeppelin**: For security best practices
- **Tailwind CSS**: For the beautiful UI framework

## 📞 Support

- **Documentation**: [docs/](docs/)
- **Issues**: [GitHub Issues](https://github.com/Joseph-DelGiorgio/Carbon_Credit_Marketplace/issues)
- **Discussions**: [GitHub Discussions](https://github.com/Joseph-DelGiorgio/Carbon_Credit_Marketplace/discussions)

## 🌍 Impact

This marketplace aims to:
- **Accelerate Climate Action**: Make carbon credits more accessible
- **Support Small Projects**: Enable micro-projects to participate
- **Increase Transparency**: Blockchain-based verification and trading
- **Reduce Costs**: Eliminate intermediaries and reduce transaction costs
- **Enable Innovation**: Foster new carbon sequestration technologies

---

**Built with ❤️ for a sustainable future** 
