import React from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Leaf, 
  Users, 
  Globe,
  Calendar,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

interface Project {
  id: string;
  name: string;
  location: string;
  status: 'active' | 'draft' | 'paused' | 'completed';
  creditsGenerated: number;
  creditsSold: number;
  revenue: number;
  lastUpdated: string;
}

interface RecentTransaction {
  id: string;
  type: 'purchase' | 'sale' | 'generation';
  amount: number;
  price: number;
  projectName: string;
  date: string;
}

const DashboardPage: React.FC = () => {
  // Mock data - replace with API calls
  const projects: Project[] = [
    {
      id: '1',
      name: 'Amazon Reforestation Project',
      location: 'Brazil',
      status: 'active',
      creditsGenerated: 5000,
      creditsSold: 3000,
      revenue: 75000,
      lastUpdated: '2024-01-15'
    },
    {
      id: '2',
      name: 'Solar Energy Initiative',
      location: 'India',
      status: 'active',
      creditsGenerated: 3000,
      creditsSold: 2000,
      revenue: 60000,
      lastUpdated: '2024-01-10'
    },
    {
      id: '3',
      name: 'Community Forest Management',
      location: 'Kenya',
      status: 'draft',
      creditsGenerated: 0,
      creditsSold: 0,
      revenue: 0,
      lastUpdated: '2024-01-05'
    }
  ];

  const recentTransactions: RecentTransaction[] = [
    {
      id: '1',
      type: 'sale',
      amount: 500,
      price: 25,
      projectName: 'Amazon Reforestation Project',
      date: '2024-01-15'
    },
    {
      id: '2',
      type: 'generation',
      amount: 1000,
      price: 0,
      projectName: 'Solar Energy Initiative',
      date: '2024-01-14'
    },
    {
      id: '3',
      type: 'purchase',
      amount: 200,
      price: 30,
      projectName: 'Community Forest Management',
      date: '2024-01-13'
    }
  ];

  const stats = [
    {
      name: 'Total Revenue',
      value: '135,000 SUI',
      change: '+12.5%',
      changeType: 'increase',
      icon: DollarSign
    },
    {
      name: 'Credits Generated',
      value: '8,000 kg CO2',
      change: '+8.2%',
      changeType: 'increase',
      icon: Leaf
    },
    {
      name: 'Credits Sold',
      value: '5,000 kg CO2',
      change: '+15.3%',
      changeType: 'increase',
      icon: TrendingUp
    },
    {
      name: 'Active Projects',
      value: '2',
      change: '+1',
      changeType: 'increase',
      icon: Users
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      case 'paused':
        return 'bg-orange-100 text-orange-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'purchase':
        return <ArrowDownRight className="w-4 h-4 text-red-500" />;
      case 'sale':
        return <ArrowUpRight className="w-4 h-4 text-green-500" />;
      case 'generation':
        return <Leaf className="w-4 h-4 text-blue-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome back! Here's an overview of your carbon credit activities.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </div>
                <div className="p-2 bg-green-100 rounded-lg">
                  <Icon className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <div className="flex items-center mt-4">
                {stat.changeType === 'increase' ? (
                  <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                )}
                <span className={`text-sm font-medium ${
                  stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.change}
                </span>
                <span className="text-sm text-gray-500 ml-1">from last month</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Projects */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Your Projects</h2>
              <button className="text-sm text-green-600 hover:text-green-700 font-medium">
                View All
              </button>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {projects.map((project) => (
                <div key={project.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-gray-900">{project.name}</h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(project.status)}`}>
                        {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500 mb-2">
                      <Globe className="w-4 h-4 mr-1" />
                      {project.location}
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Generated</p>
                        <p className="font-medium text-gray-900">{project.creditsGenerated.toLocaleString()} kg</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Sold</p>
                        <p className="font-medium text-gray-900">{project.creditsSold.toLocaleString()} kg</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Revenue</p>
                        <p className="font-medium text-green-600">{project.revenue.toLocaleString()} SUI</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Recent Transactions</h2>
              <button className="text-sm text-green-600 hover:text-green-700 font-medium">
                View All
              </button>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center">
                    <div className="p-2 bg-gray-100 rounded-lg mr-3">
                      {getTransactionIcon(transaction.type)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{transaction.projectName}</p>
                      <p className="text-sm text-gray-500 capitalize">{transaction.type}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">{transaction.amount.toLocaleString()} kg CO2</p>
                    {transaction.price > 0 && (
                      <p className="text-sm text-green-600">{transaction.price} SUI/ton</p>
                    )}
                    <p className="text-xs text-gray-500">{transaction.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors">
            <Plus className="w-6 h-6 text-gray-400 mr-2" />
            <span className="text-gray-600 font-medium">Create New Project</span>
          </button>
          <button className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors">
            <Leaf className="w-6 h-6 text-gray-400 mr-2" />
            <span className="text-gray-600 font-medium">Generate Credits</span>
          </button>
          <button className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors">
            <ShoppingCart className="w-6 h-6 text-gray-400 mr-2" />
            <span className="text-gray-600 font-medium">Browse Marketplace</span>
          </button>
        </div>
      </div>

      {/* Market Overview */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Market Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">30 SUI</p>
            <p className="text-sm text-gray-500">Average Price</p>
            <p className="text-xs text-green-600 mt-1">+5.2% from last week</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">1,250</p>
            <p className="text-sm text-gray-500">Credits Available</p>
            <p className="text-xs text-green-600 mt-1">+12.3% from last week</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">45</p>
            <p className="text-sm text-gray-500">Active Projects</p>
            <p className="text-xs text-green-600 mt-1">+3 from last week</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">15</p>
            <p className="text-sm text-gray-500">Countries</p>
            <p className="text-xs text-green-600 mt-1">+2 from last week</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage; 