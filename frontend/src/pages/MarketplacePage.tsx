import React, { useState, useEffect } from 'react';
import { useSmartContracts } from '../hooks/useSmartContracts';
import { useProjects } from '../hooks/useProjects';
import type { ProjectFilters } from '../hooks/useProjects';
import { useCurrentAccount, useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import CreateProjectButton from '../components/CreateProjectButton';
import CapabilityInitializer from '../components/CapabilityInitializer';
import BuyCreditsModal from '../components/BuyCreditsModal';
import MintCreditsModal from '../components/MintCreditsModal';
import type { CarbonProject } from '../hooks/useProjects';

interface MockListing {
  id: string;
  credit_id: string;
  project_id: string;
  amount: number;
  price: number;
  seller: string;
  status: 'available' | 'sold' | 'retired';
  created_at: number;
}

// Mock data for demonstration - in production this would come from blockchain queries
const mockProjects: CarbonProject[] = [
  {
    id: '1',
    name: 'Amazon Rainforest Conservation',
    description: 'Protecting 10,000 hectares of primary rainforest in the Brazilian Amazon through sustainable land management and community engagement.',
    location: 'Brazil',
    project_type: 'reforestation',
    total_credits: 50000,
    available_credits: 25000,
    price_per_credit: 25.50,
    developer: '0x1234...5678',
    verified: true,
    created_at: Date.now() - 86400000 * 30,
    co_benefits: ['Biodiversity protection', 'Community development'],
    sdg_goals: [13, 15],
    funding_goal: 1000000,
    funding_raised: 750000,
    metadata: '{"image": "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop"}'
  },
  {
    id: '2',
    name: 'Solar Farm Development',
    description: 'Large-scale solar energy project providing clean electricity to 50,000 households while reducing carbon emissions.',
    location: 'India',
    project_type: 'renewable_energy',
    total_credits: 75000,
    available_credits: 40000,
    price_per_credit: 18.75,
    developer: '0x8765...4321',
    verified: false,
    created_at: Date.now() - 86400000 * 15,
    co_benefits: ['Energy access', 'Job creation'],
    sdg_goals: [7, 8],
    funding_goal: 2000000,
    funding_raised: 1200000,
    metadata: '{"image": "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400&h=300&fit=crop"}'
  },
  {
    id: '3',
    name: 'Ocean Plastic Cleanup',
    description: 'Innovative ocean cleanup technology removing plastic waste and preventing marine ecosystem damage.',
    location: 'Pacific Ocean',
    project_type: 'ocean_conservation',
    total_credits: 30000,
    available_credits: 15000,
    price_per_credit: 32.00,
    developer: '0xabcd...efgh',
    verified: true,
    created_at: Date.now() - 86400000 * 7,
    co_benefits: ['Marine life protection', 'Water quality improvement'],
    sdg_goals: [14, 6],
    funding_goal: 800000,
    funding_raised: 600000,
    metadata: '{"image": "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop"}'
  }
];

// Mock listings (these would be created by sellers listing their credits)
const mockListings = [
  {
    id: 'listing_1',
    credit_id: 'credit_1',
    project_id: '1',
    amount: 1000,
    price: 1.00,
    seller: '0x1234...5678',
    status: 'available' as const,
    created_at: Date.now() - 86400000 * 5
  },
  {
    id: 'listing_2',
    credit_id: 'credit_2',
    project_id: '2',
    amount: 500,
    price: 1.00,
    seller: '0x8765...4321',
    status: 'available' as const,
    created_at: Date.now() - 86400000 * 2
  }
];

const mockCredits = [
  {
    id: '1',
    project_id: '1',
    amount: 1000,
    price: 1.00,
    seller: '0x1234...5678',
    status: 'available' as const,
    created_at: Date.now() - 86400000 * 5
  },
  {
    id: '2',
    project_id: '2',
    amount: 500,
    price: 1.00,
    seller: '0x8765...4321',
    status: 'available' as const,
    created_at: Date.now() - 86400000 * 2
  }
];

const MarketplacePage: React.FC = () => {
  const account = useCurrentAccount();
  const { mutateAsync: signAndExecute } = useSignAndExecuteTransaction();
  const {
    initializeDeveloperCap,
    createProject,
    createListing,
    buyCredits,
    projects: contractProjects,
    listings: contractListings,
    PACKAGE_ID
  } = useSmartContracts();

  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [selectedCredit, setSelectedCredit] = useState<MockListing | null>(null);
  const [selectedProjectForMinting, setSelectedProjectForMinting] = useState<CarbonProject | null>(null);
  const [isInitializing, setIsInitializing] = useState(false);
  const [projects, setProjects] = useState(mockProjects);
  const [listings, setListings] = useState(mockListings);
  const [viewMode, setViewMode] = useState<'all' | 'my'>('all');
  const [filters, setFilters] = useState<ProjectFilters>({});

  // Use the new projects hook with filters
  const {
    allProjects,
    userProjects,
    allListings,
    carbonCredits,
    isLoadingProjects,
    isLoadingUserProjects,
    isLoadingListings,
    isLoadingCredits,
  } = useProjects(filters);

  // Use real data when available, fallback to mock data
  const displayProjects = viewMode === 'my' 
    ? ((userProjects?.length || 0) > 0 ? userProjects : mockProjects.filter(p => p.developer === account?.address))
    : ((allProjects?.length || 0) > 0 ? allProjects : mockProjects);

  // Initialize marketplace on first load
  useEffect(() => {
    if (account?.address && !isInitializing) {
      setIsInitializing(true);
      initializeDeveloperCap.mutateAsync()
        .then(() => {
          console.log('Marketplace initialized successfully');
        })
        .catch((error: any) => {
          console.error('Failed to initialize marketplace:', error);
        })
        .finally(() => {
          setIsInitializing(false);
        });
    }
  }, [account?.address]);

  const handleBuyCredits = (credit: MockListing) => {
    setSelectedCredit(credit);
  };

  const handleMintCredits = (project: CarbonProject) => {
    setSelectedProjectForMinting(project);
  };

  const handleFiltersChange = (newFilters: ProjectFilters) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({});
  };

  const getProjectTypeColor = (type: string) => {
    const colors = {
      reforestation: 'bg-green-100 text-green-800',
      renewable_energy: 'bg-blue-100 text-blue-800',
      energy_efficiency: 'bg-purple-100 text-purple-800',
      methane_capture: 'bg-orange-100 text-orange-800',
      ocean_conservation: 'bg-cyan-100 text-cyan-800'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getVerificationBadge = (verified: boolean) => {
    if (verified) {
      return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
        Verified
      </span>;
    }
    return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
      <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
      </svg>
      Pending
    </span>;
  };

  const getProjectImage = (project: CarbonProject) => {
    try {
      const metadata = JSON.parse(project.metadata);
      return metadata.image || 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop';
    } catch {
      return 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      {/* Header Section */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Carbon Credit Marketplace</h1>
              <p className="text-gray-600 mt-1">Trade verified carbon credits on Sui blockchain</p>
            </div>
            <div className="flex items-center space-x-4">
              <CapabilityInitializer />
              <CreateProjectButton />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{displayProjects.length}</div>
              <div className="text-sm text-gray-600">Active Projects</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {displayProjects.reduce((sum, p) => sum + p.total_credits, 0).toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Total Credits</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {listings.length}
              </div>
              <div className="text-sm text-gray-600">Available Listings</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {displayProjects.filter(p => p.verified).length}
              </div>
              <div className="text-sm text-gray-600">Verified Projects</div>
            </div>
          </div>
        </div>
      </div>

      {/* View Toggle */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-center">
            <div className="bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('all')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'all'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                All Projects
              </button>
              <button
                onClick={() => setViewMode('my')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'my'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                My Projects
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Projects Section */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Carbon Credit Projects</h2>
            <div className="flex space-x-2">
              {/* Filter component will be added here */}
              <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                Sort
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayProjects.map((project) => (
              <div key={project.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="relative h-48 bg-gray-200">
                  <img 
                    src={getProjectImage(project)} 
                    alt={project.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 right-3">
                    {getVerificationBadge(project.verified)}
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getProjectTypeColor(project.project_type)}`}>
                      {project.project_type.replace('_', ' ').toUpperCase()}
                    </span>
                    <span className="text-sm text-gray-500">
                      {new Date(project.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{project.name}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{project.description}</p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Location:</span>
                      <span className="font-medium">{project.location}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Available Credits:</span>
                      <span className="font-medium">{project.available_credits.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Price per Credit:</span>
                      <span className="font-medium text-green-600">{project.price_per_credit} SUI</span>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => setSelectedProject(project.id)}
                      className="flex-1 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 transition-colors"
                    >
                      View Details
                    </button>
                    {viewMode === 'my' && project.developer === account?.address && (
                      <button 
                        onClick={() => handleMintCredits(project)}
                        className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
                        title="Mint Credits"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      </button>
                    )}
                    <button className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-50 transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Available Credits Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Available Credits</h2>
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Project
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Seller
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {listings.map((listing) => {
                    const project = displayProjects.find(p => p.id === listing.project_id);
                    return (
                        <tr key={listing.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{project?.name}</div>
                            <div className="text-sm text-gray-500">{project?.location}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {listing.amount.toLocaleString()} credits
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <span className="font-medium text-green-600">{listing.price} SUI</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {listing.seller}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => handleBuyCredits(listing)}
                              className="text-green-600 hover:text-green-900 bg-green-50 hover:bg-green-100 px-3 py-1 rounded-md transition-colors"
                            >
                              Buy Credits
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Contract Information */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Contract Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Package ID:</span>
                              <div className="font-mono text-gray-900 break-all">{PACKAGE_ID}</div>
            </div>
            <div>
              <span className="text-gray-500">Network:</span>
              <div className="text-gray-900">Sui Testnet</div>
            </div>
          </div>
        </div>
      </div>

      {/* Project Detail Modal */}
      {selectedProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold text-gray-900">Project Details</h2>
                <button
                  onClick={() => setSelectedProject(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {(() => {
                const project = displayProjects.find(p => p.id === selectedProject);
                if (!project) return null;
                
                return (
                  <div className="space-y-4">
                    <img 
                      src={getProjectImage(project)} 
                      alt={project.name}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{project.name}</h3>
                      <p className="text-gray-600 mt-1">{project.description}</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-sm text-gray-500">Location</span>
                        <div className="font-medium">{project.location}</div>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Project Type</span>
                        <div className="font-medium">{project.project_type.replace('_', ' ')}</div>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Total Credits</span>
                        <div className="font-medium">{project.total_credits.toLocaleString()}</div>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Price per Credit</span>
                        <div className="font-medium text-green-600">{project.price_per_credit} SUI</div>
                      </div>
                    </div>
                    
                    <div className="flex space-x-3 pt-4">
                      <button className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
                        Buy Credits
                      </button>
                      <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50">
                        View on Explorer
                      </button>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
                 </div>
       )}

       {/* Buy Credits Modal */}
       {selectedCredit && (() => {
         const project = displayProjects.find(p => p.id === selectedCredit.project_id);
         if (!project) {
           return null;
         }
         return (
           <BuyCreditsModal
             isOpen={!!selectedCredit}
             onClose={() => setSelectedCredit(null)}
             credit={selectedCredit}
             project={project}
           />
         );
       })()}

       {/* Mint Credits Modal */}
       {selectedProjectForMinting && (
         <MintCreditsModal
           isOpen={!!selectedProjectForMinting}
           onClose={() => setSelectedProjectForMinting(null)}
           project={selectedProjectForMinting}
         />
       )}
     </div>
   );
 };

export default MarketplacePage; 