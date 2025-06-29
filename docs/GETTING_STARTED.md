# Getting Started Guide - Carbon Credit Marketplace

This guide will walk you through setting up and running the Carbon Credit Marketplace for micro-projects.

## Prerequisites

Before you begin, ensure you have the following installed on your system:

### Required Software
- **Node.js** (v18 or higher)
- **npm** (v9 or higher)
- **Docker** (v20 or higher)
- **Docker Compose** (v2 or higher)
- **Git** (v2 or higher)

### Optional Software
- **Sui CLI** (for smart contract development)
- **PostgreSQL** (for local development without Docker)
- **Redis** (for local development without Docker)

## Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/carbon-marketplace/carbon-credit-marketplace.git
cd carbon_credit_marketplace
```

### 2. Environment Setup

Copy the example environment file and configure it:

```bash
cp env.example .env
```

Edit the `.env` file with your configuration:

```bash
# Application
NODE_ENV=development
PORT=3001
FRONTEND_URL=http://localhost:3000

# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/carbon_marketplace"

# Redis
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d

# Sui Blockchain
SUI_NETWORK=testnet
SUI_RPC_URL=https://fullnode.testnet.sui.io:443
SUI_FAUCET_URL=https://faucet.testnet.sui.io/gas
```

### 3. Deploy with Docker (Recommended)

The easiest way to get started is using Docker Compose:

```bash
# Make the deployment script executable
chmod +x scripts/deploy.sh

# Deploy in development mode
./scripts/deploy.sh development
```

This will:
- Start all required services (PostgreSQL, Redis, Backend, Frontend)
- Run database migrations
- Set up monitoring (Prometheus, Grafana)
- Start IPFS node for decentralized storage

### 4. Access the Application

Once deployment is complete, you can access:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **API Health Check**: http://localhost:3001/health
- **Grafana**: http://localhost:3002 (admin/admin)
- **Prometheus**: http://localhost:9090
- **IPFS Gateway**: http://localhost:8080

## Manual Setup (Alternative)

If you prefer to run services locally without Docker:

### 1. Install Dependencies

```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install

# Install mobile dependencies (optional)
cd ../mobile
npm install
```

### 2. Database Setup

```bash
# Start PostgreSQL (if not already running)
# On macOS with Homebrew:
brew services start postgresql

# On Ubuntu:
sudo systemctl start postgresql

# Create database
createdb carbon_marketplace

# Run migrations
cd backend
npm run migrate
```

### 3. Redis Setup

```bash
# Start Redis (if not already running)
# On macOS with Homebrew:
brew services start redis

# On Ubuntu:
sudo systemctl start redis
```

### 4. Start Services

```bash
# Terminal 1: Start backend
cd backend
npm run dev

# Terminal 2: Start frontend
cd frontend
npm run dev
```

## Smart Contract Development

### 1. Install Sui CLI

```bash
# Install Sui CLI
curl -fsSL https://raw.githubusercontent.com/MystenLabs/sui/main/docs/scripts/install-sui.sh | sh

# Add to PATH (add to your shell profile)
export PATH="$HOME/.sui/bin:$PATH"
```

### 2. Configure Sui

```bash
# Initialize Sui configuration
sui client

# Switch to testnet
sui client switch --env testnet

# Get test tokens
sui client faucet
```

### 3. Deploy Contracts

```bash
# Navigate to contracts directory
cd contracts

# Build contracts
sui move build

# Deploy contracts
sui move publish --gas-budget 10000000
```

### 4. Update Environment

After deployment, update your `.env` file with the package ID:

```bash
SUI_PACKAGE_ID=your-package-id-here
```

## Development Workflow

### 1. Code Structure

```
carbon_credit_marketplace/
├── contracts/           # Sui Move smart contracts
├── backend/            # Node.js API server
├── frontend/           # React web application
├── mobile/             # React Native mobile app
├── docs/              # Documentation
├── scripts/           # Deployment and utility scripts
└── tests/             # Test suites
```

### 2. Development Commands

```bash
# Root level commands
npm run dev              # Start all services
npm run build           # Build all applications
npm run test            # Run all tests
npm run lint            # Lint all code
npm run format          # Format all code

# Backend commands
cd backend
npm run dev             # Start development server
npm run build           # Build for production
npm run test            # Run tests
npm run migrate         # Run database migrations
npm run seed            # Seed database with sample data

# Frontend commands
cd frontend
npm run dev             # Start development server
npm run build           # Build for production
npm run test            # Run tests
npm run preview         # Preview production build

# Smart contract commands
cd contracts
sui move build          # Build contracts
sui move test           # Run contract tests
sui move publish        # Deploy contracts
```

### 3. Testing

```bash
# Run all tests
npm run test

# Run specific test suites
npm run test:contracts  # Smart contract tests
npm run test:backend    # Backend API tests
npm run test:frontend   # Frontend tests

# Run tests in watch mode
npm run test:watch
```

### 4. Code Quality

```bash
# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format

# Type checking
npm run type-check
```

## API Documentation

### Authentication

The API uses JWT tokens for authentication. Include the token in the Authorization header:

```bash
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     http://localhost:3001/api/projects
```

### Key Endpoints

#### Projects
- `GET /api/projects` - List all projects
- `POST /api/projects` - Create a new project
- `GET /api/projects/:id` - Get project details
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

#### Carbon Credits
- `GET /api/credits` - List all credits
- `POST /api/credits` - Generate new credits
- `GET /api/credits/:id` - Get credit details
- `PUT /api/credits/:id` - Update credit

#### Marketplace
- `GET /api/marketplace/listings` - List available credits
- `POST /api/marketplace/buy` - Purchase credits
- `POST /api/marketplace/auctions` - Create auction
- `POST /api/marketplace/bid` - Place bid

#### Verification
- `POST /api/verification/submit` - Submit verification data
- `GET /api/verification/:id` - Get verification status
- `PUT /api/verification/:id` - Update verification

## Troubleshooting

### Common Issues

#### 1. Database Connection Issues

```bash
# Check if PostgreSQL is running
pg_isready -h localhost -p 5432

# Check database connection
psql -h localhost -U postgres -d carbon_marketplace

# Reset database
cd backend
npm run migrate:reset
```

#### 2. Docker Issues

```bash
# Check Docker status
docker --version
docker-compose --version

# Clean up Docker
docker system prune -a
docker volume prune

# Restart Docker services
docker-compose down
docker-compose up -d
```

#### 3. Port Conflicts

If ports are already in use:

```bash
# Check what's using the port
lsof -i :3000
lsof -i :3001
lsof -i :5432

# Kill the process
kill -9 PID
```

#### 4. Node.js Version Issues

```bash
# Check Node.js version
node --version

# Use nvm to switch versions
nvm use 18
nvm install 18
```

### Getting Help

1. **Check the logs**:
   ```bash
   docker-compose logs -f
   ```

2. **Check the documentation**:
   - [Architecture Guide](ARCHITECTURE.md)
   - [API Reference](API.md)
   - [Deployment Guide](DEPLOYMENT.md)

3. **Create an issue**:
   - GitHub Issues: [Create Issue](https://github.com/carbon-marketplace/carbon-credit-marketplace/issues)

4. **Join the community**:
   - Discord: [Join Server](https://discord.gg/carbonmarketplace)
   - Twitter: [@CarbonMarketplace](https://twitter.com/CarbonMarketplace)

## Next Steps

### 1. Explore the Application

- Create a test project
- Generate sample carbon credits
- Test the marketplace functionality
- Explore the verification process

### 2. Customize for Your Needs

- Modify the smart contracts
- Customize the UI/UX
- Add new features
- Integrate with external services

### 3. Deploy to Production

- Set up production environment
- Configure monitoring and logging
- Set up CI/CD pipelines
- Deploy to cloud infrastructure

### 4. Contribute

- Fork the repository
- Create a feature branch
- Make your changes
- Submit a pull request

## Support

For additional support and resources:

- **Documentation**: [docs/](docs/)
- **API Reference**: [docs/API.md](docs/API.md)
- **Architecture**: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)
- **Deployment**: [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)
- **Contributing**: [CONTRIBUTING.md](CONTRIBUTING.md)

---

**Happy coding! 🌱**

Building the future of climate finance, one micro-project at a time. 