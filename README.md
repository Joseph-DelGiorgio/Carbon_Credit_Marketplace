# Carbon Credit Marketplace

A decentralized carbon credit marketplace built on the Sui blockchain, enabling transparent and efficient trading of carbon credits with project verification and real-time data.

## 🚀 Current Status

### ✅ Completed Features
- **Smart Contract**: Fully deployed and functional Sui Move contract
- **Frontend**: React/TypeScript application with modern UI
- **Wallet Integration**: Seamless Sui wallet connection
- **Project Management**: Create, list, and manage carbon projects
- **Credit Trading**: Mint and trade carbon credits
- **User Interface**: Responsive design with Tailwind CSS

### 🔧 In Progress
- Project filtering and search functionality
- Real blockchain data integration
- Enhanced UI/UX improvements
- Transaction status tracking

## 🛠️ Tech Stack

- **Blockchain**: Sui Move
- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS
- **Wallet**: @mysten/dapp-kit
- **State Management**: React Query
- **Smart Contract**: Sui Move 2024

## 📁 Project Structure

```
Carbon_Credit_Marketplace/
├── contracts/                 # Sui Move smart contracts
│   ├── sources/
│   │   └── Carbon_Marketplace.move
│   └── Move.toml
├── frontend/                  # React/TypeScript frontend
│   ├── src/
│   │   ├── components/        # React components
│   │   ├── hooks/            # Custom React hooks
│   │   ├── pages/            # Page components
│   │   └── styles/           # CSS and styling
│   ├── package.json
│   └── vite.config.ts
├── backend/                   # Node.js backend (future)
├── docs/                      # Documentation
└── scripts/                   # Deployment scripts
```

## 🚀 Quick Start

### Prerequisites
- Node.js 20.19.0+
- Sui CLI
- Sui wallet (Sui Wallet, Ethos, etc.)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Joseph-DelGiorgio/Carbon_Credit_Marketplace.git
   cd Carbon_Credit_Marketplace
   ```

2. **Install dependencies**
   ```bash
   # Install frontend dependencies
   cd frontend
   yarn install
   ```

3. **Start the development server**
   ```bash
   yarn dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000` (or the port shown in terminal)

## 🔗 Smart Contract

### Contract Address
- **Testnet**: `0x...` (Update with your deployed contract address)
- **Mainnet**: Coming soon

### Key Functions
- `create_project`: Create new carbon projects
- `mint_credits`: Mint carbon credits for verified projects
- `create_listing`: List credits for sale
- `buy_credits`: Purchase carbon credits
- `retire_credits`: Retire credits permanently

## 🎯 Features

### Project Management
- ✅ Create carbon projects with detailed information
- ✅ View all projects and filter by various criteria
- ✅ Project verification workflow
- ✅ Funding goal tracking

### Credit Trading
- ✅ Mint carbon credits for verified projects
- ✅ List credits for sale with pricing
- ✅ Purchase credits with SUI tokens
- ✅ Credit retirement functionality

### User Experience
- ✅ Connect Sui wallet seamlessly
- ✅ Real-time transaction status
- ✅ Responsive design for all devices
- ✅ Intuitive project creation forms

## 📊 Testing

### Smart Contract Testing
```bash
cd contracts
sui move test
```

### Frontend Testing
```bash
cd frontend
yarn test
```

### Manual Testing Guide
See [test-functionality.md](test-functionality.md) for detailed testing instructions.

## 🚀 Deployment

### Smart Contract Deployment
```bash
cd contracts
sui client publish --gas-budget 100000000
```

### Frontend Deployment
```bash
cd frontend
yarn build
# Deploy to Vercel, Netlify, or your preferred platform
```

## 📈 Roadmap

For detailed development phases and upcoming features, see [PROJECT_ROADMAP.md](PROJECT_ROADMAP.md).

### Immediate Next Steps
1. **Complete Phase 2**: Fix filtering integration and enhance UI
2. **Real Data Integration**: Replace mock data with blockchain queries
3. **Testing & Quality**: Add comprehensive testing suite
4. **Production Readiness**: Optimize performance and security

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check the [docs/](docs/) folder
- **Issues**: Report bugs via GitHub Issues
- **Discussions**: Join our GitHub Discussions

## 🎉 Acknowledgments

- Sui Foundation for blockchain infrastructure
- React and TypeScript communities
- Carbon credit industry experts and standards

---

**Built with ❤️ for a sustainable future** 
