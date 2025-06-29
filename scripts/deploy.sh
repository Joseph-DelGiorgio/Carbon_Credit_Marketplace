#!/bin/bash

# Carbon Credit Marketplace Deployment Script
# This script handles the complete deployment process

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
ENVIRONMENT=${1:-development}
DOCKER_COMPOSE_FILE="docker-compose.yml"
PROJECT_NAME="carbon_marketplace"

# Logging function
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

warn() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING: $1${NC}"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR: $1${NC}"
    exit 1
}

# Check prerequisites
check_prerequisites() {
    log "Checking prerequisites..."
    
    # Check if Docker is installed
    if ! command -v docker &> /dev/null; then
        error "Docker is not installed. Please install Docker first."
    fi
    
    # Check if Docker Compose is installed
    if ! command -v docker-compose &> /dev/null; then
        error "Docker Compose is not installed. Please install Docker Compose first."
    fi
    
    # Check if Node.js is installed
    if ! command -v node &> /dev/null; then
        error "Node.js is not installed. Please install Node.js first."
    fi
    
    # Check if npm is installed
    if ! command -v npm &> /dev/null; then
        error "npm is not installed. Please install npm first."
    fi
    
    log "Prerequisites check passed!"
}

# Setup environment
setup_environment() {
    log "Setting up environment for $ENVIRONMENT..."
    
    # Copy environment file if it doesn't exist
    if [ ! -f .env ]; then
        if [ -f env.example ]; then
            cp env.example .env
            warn "Created .env file from env.example. Please update it with your configuration."
        else
            error "No environment file found. Please create a .env file."
        fi
    fi
    
    # Create necessary directories
    mkdir -p logs
    mkdir -p data
    mkdir -p monitoring/grafana/dashboards
    mkdir -p monitoring/grafana/datasources
    mkdir -p nginx/ssl
    
    log "Environment setup completed!"
}

# Build and deploy services
deploy_services() {
    log "Deploying services..."
    
    # Stop existing containers
    log "Stopping existing containers..."
    docker-compose -f $DOCKER_COMPOSE_FILE down --remove-orphans
    
    # Build images
    log "Building Docker images..."
    docker-compose -f $DOCKER_COMPOSE_FILE build --no-cache
    
    # Start services
    log "Starting services..."
    docker-compose -f $DOCKER_COMPOSE_FILE up -d
    
    log "Services deployed successfully!"
}

# Wait for services to be ready
wait_for_services() {
    log "Waiting for services to be ready..."
    
    # Wait for database
    log "Waiting for database..."
    timeout=60
    while ! docker-compose -f $DOCKER_COMPOSE_FILE exec -T postgres pg_isready -U postgres > /dev/null 2>&1; do
        if [ $timeout -le 0 ]; then
            error "Database failed to start within 60 seconds"
        fi
        sleep 1
        timeout=$((timeout - 1))
    done
    
    # Wait for Redis
    log "Waiting for Redis..."
    timeout=30
    while ! docker-compose -f $DOCKER_COMPOSE_FILE exec -T redis redis-cli ping > /dev/null 2>&1; do
        if [ $timeout -le 0 ]; then
            error "Redis failed to start within 30 seconds"
        fi
        sleep 1
        timeout=$((timeout - 1))
    done
    
    log "All services are ready!"
}

# Run database migrations
run_migrations() {
    log "Running database migrations..."
    
    # Wait a bit for the backend to be ready
    sleep 10
    
    # Run migrations
    docker-compose -f $DOCKER_COMPOSE_FILE exec -T backend npm run migrate:deploy
    
    log "Database migrations completed!"
}

# Deploy smart contracts
deploy_contracts() {
    log "Deploying smart contracts..."
    
    # Check if Sui CLI is installed
    if ! command -v sui &> /dev/null; then
        warn "Sui CLI is not installed. Skipping contract deployment."
        return
    fi
    
    # Deploy contracts
    cd contracts
    sui move publish --gas-budget 10000000
    
    log "Smart contracts deployed successfully!"
}

# Health check
health_check() {
    log "Performing health check..."
    
    # Check backend health
    if curl -f http://localhost:3001/health > /dev/null 2>&1; then
        log "Backend is healthy"
    else
        error "Backend health check failed"
    fi
    
    # Check frontend
    if curl -f http://localhost:3000 > /dev/null 2>&1; then
        log "Frontend is healthy"
    else
        error "Frontend health check failed"
    fi
    
    # Check database
    if docker-compose -f $DOCKER_COMPOSE_FILE exec -T postgres pg_isready -U postgres > /dev/null 2>&1; then
        log "Database is healthy"
    else
        error "Database health check failed"
    fi
    
    log "All health checks passed!"
}

# Show deployment info
show_info() {
    log "Deployment completed successfully!"
    echo
    echo -e "${BLUE}=== Carbon Credit Marketplace Deployment Info ===${NC}"
    echo
    echo -e "${GREEN}Frontend:${NC} http://localhost:3000"
    echo -e "${GREEN}Backend API:${NC} http://localhost:3001"
    echo -e "${GREEN}API Health:${NC} http://localhost:3001/health"
    echo -e "${GREEN}Grafana:${NC} http://localhost:3002 (admin/admin)"
    echo -e "${GREEN}Prometheus:${NC} http://localhost:9090"
    echo -e "${GREEN}IPFS Gateway:${NC} http://localhost:8080"
    echo
    echo -e "${YELLOW}Useful commands:${NC}"
    echo -e "  View logs: ${BLUE}docker-compose logs -f${NC}"
    echo -e "  Stop services: ${BLUE}docker-compose down${NC}"
    echo -e "  Restart services: ${BLUE}docker-compose restart${NC}"
    echo -e "  Update services: ${BLUE}./scripts/deploy.sh${NC}"
    echo
}

# Main deployment function
main() {
    log "Starting Carbon Credit Marketplace deployment..."
    log "Environment: $ENVIRONMENT"
    
    check_prerequisites
    setup_environment
    deploy_services
    wait_for_services
    run_migrations
    
    if [ "$ENVIRONMENT" = "production" ]; then
        deploy_contracts
    fi
    
    health_check
    show_info
    
    log "Deployment completed successfully!"
}

# Handle script arguments
case "$1" in
    "development"|"production"|"staging")
        main
        ;;
    "stop")
        log "Stopping services..."
        docker-compose -f $DOCKER_COMPOSE_FILE down
        log "Services stopped!"
        ;;
    "logs")
        docker-compose -f $DOCKER_COMPOSE_FILE logs -f
        ;;
    "restart")
        log "Restarting services..."
        docker-compose -f $DOCKER_COMPOSE_FILE restart
        log "Services restarted!"
        ;;
    "clean")
        log "Cleaning up..."
        docker-compose -f $DOCKER_COMPOSE_FILE down -v --remove-orphans
        docker system prune -f
        log "Cleanup completed!"
        ;;
    *)
        echo "Usage: $0 {development|production|staging|stop|logs|restart|clean}"
        echo
        echo "Commands:"
        echo "  development  - Deploy in development mode"
        echo "  production   - Deploy in production mode"
        echo "  staging      - Deploy in staging mode"
        echo "  stop         - Stop all services"
        echo "  logs         - View service logs"
        echo "  restart      - Restart all services"
        echo "  clean        - Stop and remove all containers and volumes"
        exit 1
        ;;
esac 