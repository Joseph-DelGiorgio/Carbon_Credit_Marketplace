import React, { useState } from 'react';
import { 
  Filter, 
  Search, 
  Grid, 
  List, 
  MapPin, 
  Calendar,
  Leaf,
  TrendingUp,
  Users,
  Globe
} from 'lucide-react';

interface CarbonCredit {
  id: string;
  projectName: string;
  location: string;
  amount: number;
  pricePerTon: number;
  vintageYear: number;
  methodology: string;
  verificationStatus: 'pending' | 'verified' | 'rejected';
  coBenefits: string[];
  image: string;
}

const MarketplacePage: React.FC = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('price');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data - replace with API call
  const credits: CarbonCredit[] = [
    {
      id: '1',
      projectName: 'Amazon Reforestation Project',
      location: 'Brazil',
      amount: 5000,
      pricePerTon: 25,
      vintageYear: 2024,
      methodology: 'AR-ACM0003',
      verificationStatus: 'verified',
      coBenefits: ['Biodiversity', 'Community Development'],
      image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400'
    },
    {
      id: '2',
      projectName: 'Solar Energy Initiative',
      location: 'India',
      amount: 3000,
      pricePerTon: 30,
      vintageYear: 2024,
      methodology: 'AMS-I.C',
      verificationStatus: 'verified',
      coBenefits: ['Clean Energy', 'Job Creation'],
      image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400'
    },
    {
      id: '3',
      projectName: 'Community Forest Management',
      location: 'Kenya',
      amount: 2000,
      pricePerTon: 35,
      vintageYear: 2024,
      methodology: 'AR-ACM0002',
      verificationStatus: 'verified',
      coBenefits: ['Poverty Reduction', 'Ecosystem Services'],
      image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400'
    }
  ];

  const filteredCredits = credits.filter(credit => {
    const matchesSearch = credit.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         credit.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || credit.verificationStatus === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const sortedCredits = [...filteredCredits].sort((a, b) => {
    switch (sortBy) {
      case 'price':
        return a.pricePerTon - b.pricePerTon;
      case 'amount':
        return b.amount - a.amount;
      case 'vintage':
        return b.vintageYear - a.vintageYear;
      default:
        return 0;
    }
  });

  const CreditCard: React.FC<{ credit: CarbonCredit }> = ({ credit }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      <div className="relative">
        <img 
          src={credit.image} 
          alt={credit.projectName}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-3 right-3">
          <span className={`
            px-2 py-1 text-xs font-medium rounded-full
            ${credit.verificationStatus === 'verified' 
              ? 'bg-green-100 text-green-800' 
              : credit.verificationStatus === 'pending'
              ? 'bg-yellow-100 text-yellow-800'
              : 'bg-red-100 text-red-800'
            }
          `}>
            {credit.verificationStatus.charAt(0).toUpperCase() + credit.verificationStatus.slice(1)}
          </span>
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{credit.projectName}</h3>
        
        <div className="flex items-center text-sm text-gray-500 mb-3">
          <MapPin className="w-4 h-4 mr-1" />
          {credit.location}
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-sm text-gray-500">Amount</p>
            <p className="font-semibold text-gray-900">{credit.amount.toLocaleString()} kg CO2</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Price</p>
            <p className="font-semibold text-green-600">{credit.pricePerTon} SUI/ton</p>
          </div>
        </div>
        
        <div className="mb-4">
          <p className="text-sm text-gray-500 mb-2">Co-benefits:</p>
          <div className="flex flex-wrap gap-1">
            {credit.coBenefits.map((benefit, index) => (
              <span 
                key={index}
                className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full"
              >
                {benefit}
              </span>
            ))}
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            <Calendar className="w-4 h-4 inline mr-1" />
            {credit.vintageYear}
          </div>
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            Purchase
          </button>
        </div>
      </div>
    </div>
  );

  const CreditListItem: React.FC<{ credit: CarbonCredit }> = ({ credit }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center space-x-6">
        <img 
          src={credit.image} 
          alt={credit.projectName}
          className="w-24 h-24 object-cover rounded-lg"
        />
        
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-900">{credit.projectName}</h3>
            <span className={`
              px-2 py-1 text-xs font-medium rounded-full
              ${credit.verificationStatus === 'verified' 
                ? 'bg-green-100 text-green-800' 
                : credit.verificationStatus === 'pending'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-red-100 text-red-800'
              }
            `}>
              {credit.verificationStatus.charAt(0).toUpperCase() + credit.verificationStatus.slice(1)}
            </span>
          </div>
          
          <div className="flex items-center text-sm text-gray-500 mb-3">
            <MapPin className="w-4 h-4 mr-1" />
            {credit.location}
          </div>
          
          <div className="grid grid-cols-4 gap-4 mb-3">
            <div>
              <p className="text-sm text-gray-500">Amount</p>
              <p className="font-semibold text-gray-900">{credit.amount.toLocaleString()} kg CO2</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Price</p>
              <p className="font-semibold text-green-600">{credit.pricePerTon} SUI/ton</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Value</p>
              <p className="font-semibold text-gray-900">{(credit.amount * credit.pricePerTon / 1000).toFixed(2)} SUI</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Vintage</p>
              <p className="font-semibold text-gray-900">{credit.vintageYear}</p>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex flex-wrap gap-1">
              {credit.coBenefits.map((benefit, index) => (
                <span 
                  key={index}
                  className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full"
                >
                  {benefit}
                </span>
              ))}
            </div>
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              Purchase
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Carbon Credit Marketplace</h1>
          <p className="text-gray-600 mt-1">Browse and purchase verified carbon credits from micro-projects</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-green-100 text-green-600' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <Grid className="w-5 h-5" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-green-100 text-green-600' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <List className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Leaf className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Credits</p>
              <p className="text-2xl font-bold text-gray-900">10,000</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Average Price</p>
              <p className="text-2xl font-bold text-gray-900">30 SUI</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Active Projects</p>
              <p className="text-2xl font-bold text-gray-900">25</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Globe className="w-6 h-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Countries</p>
              <p className="text-2xl font-bold text-gray-900">12</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search projects or locations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="verified">Verified</option>
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
            </select>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="price">Price: Low to High</option>
              <option value="amount">Amount: High to Low</option>
              <option value="vintage">Vintage: Newest</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-gray-600">
            Showing {sortedCredits.length} of {credits.length} credits
          </p>
        </div>
        
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedCredits.map((credit) => (
              <CreditCard key={credit.id} credit={credit} />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {sortedCredits.map((credit) => (
              <CreditListItem key={credit.id} credit={credit} />
            ))}
          </div>
        )}
        
        {sortedCredits.length === 0 && (
          <div className="text-center py-12">
            <Leaf className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No credits found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MarketplacePage; 