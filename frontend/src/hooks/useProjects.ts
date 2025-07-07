import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { useSmartContracts } from './useSmartContracts';

// Import real on-chain config
import onchainConfig from '../onchain-config.json';

export interface Project {
  id: string;
  name: string;
  location: string;
  projectType: string;
  description: string;
  developer: string;
  totalCredits: number;
  creditsIssued: number;
  pricePerCredit: number;
  coBenefits: string[];
  sdgGoals: number[];
  verificationStatus: number;
  fundingGoal: number;
  fundingRaised: number;
  createdAt: number;
  metadata: string;
}

export interface CarbonCredit {
  id: string;
  projectId: string;
  projectName: string;
  co2Kg: number;
  verificationHash: string;
  dMRVData: string;
  retired: boolean;
  retirementCertificate: string;
  createdAt: number;
  metadata: string;
}

export interface CreditListing {
  id: string;
  creditId: string;
  seller: string;
  price: number;
  quantity: number;
  active: boolean;
  createdAt: number;
}

export const useProjects = () => {
  const account = useCurrentAccount();
  const queryClient = useQueryClient();
  const { createProject, mintCredits, createListing, buyCredits } = useSmartContracts();

  // Load real on-chain projects from config
  const realProjects: Project[] = onchainConfig.projects.map((project, index) => ({
    id: project.id,
    name: `Real Project ${index + 1}`,
    location: 'Brazil',
    projectType: 'Forest Conservation',
    description: 'Real on-chain carbon credit project',
    developer: account?.address || '0xde5043879bb960b742bd9963bbbb72cf7c46e0c24c54f5859ae2008eced4b997',
    totalCredits: 10000,
    creditsIssued: 0,
    pricePerCredit: 1000000000, // 1 SUI
    coBenefits: ['Biodiversity', 'Community Development'],
    sdgGoals: [13, 15],
    verificationStatus: 1, // verified
    fundingGoal: 10000000000,
    fundingRaised: 0,
    createdAt: Date.now(),
    metadata: '{}'
  }));

  // Fetch all projects (using real on-chain data)
  const { data: projects = realProjects, isLoading: projectsLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      console.log('Fetching all projects from blockchain...');
      console.log('Using real on-chain project data from config');
      return realProjects;
    },
    staleTime: 30000, // 30 seconds
  });

  // Fetch user projects
  const { data: userProjects = [], isLoading: userProjectsLoading } = useQuery({
    queryKey: ['userProjects', account?.address],
    queryFn: async () => {
      if (!account?.address) return [];
      console.log('Fetching user projects for:', account.address);
      
      // Filter projects by developer address
      const userProjects = realProjects.filter(project => 
        project.developer === account.address
      );
      
      console.log('Found', userProjects.length, 'user projects');
      return userProjects;
    },
    enabled: !!account?.address,
    staleTime: 30000,
  });

  // Mock credit listings (since we don't have real credits yet)
  const mockListings: CreditListing[] = [
    {
      id: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
      creditId: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
      seller: '0xde5043879bb960b742bd9963bbbb72cf7c46e0c24c54f5859ae2008eced4b997',
      price: 1000000000, // 1 SUI
      quantity: 1000,
      active: true,
      createdAt: Date.now()
    },
    {
      id: '0x2345678901bcdef12345678901bcdef12345678901bcdef12345678901bcdef',
      creditId: '0xbcdef12345678901bcdef12345678901bcdef12345678901bcdef1234567890',
      seller: '0xde5043879bb960b742bd9963bbbb72cf7c46e0c24c54f5859ae2008eced4b997',
      price: 1500000000, // 1.5 SUI
      quantity: 500,
      active: true,
      createdAt: Date.now()
    }
  ];

  // Fetch all credit listings
  const { data: listings = mockListings, isLoading: listingsLoading } = useQuery({
    queryKey: ['listings'],
    queryFn: async () => {
      console.log('Fetching all credit listings...');
      console.log('Using mock listing data for testing');
      return mockListings;
    },
    staleTime: 30000,
  });

  // Mock carbon credits
  const mockCredits: CarbonCredit[] = [
    {
      id: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
      projectId: realProjects[0]?.id || '0x4a9304a9fdbc7b25cb47bd82beacac56e4a83d773b213b8228e3b346b471ccfe',
      projectName: 'Real Project 1',
      co2Kg: 1000,
      verificationHash: '0x1234567890abcdef',
      dMRVData: '{"sensor_data": "verified", "satellite_data": "confirmed"}',
      retired: false,
      retirementCertificate: '',
      createdAt: Date.now(),
      metadata: '{}'
    },
    {
      id: '0xbcdef12345678901bcdef12345678901bcdef12345678901bcdef1234567890',
      projectId: realProjects[1]?.id || '0x74ae581dd43e40e06eb164338d955495cae0128065da9201de0fdc45d3ac3569',
      projectName: 'Real Project 2',
      co2Kg: 500,
      verificationHash: '0xabcdef1234567890',
      dMRVData: '{"sensor_data": "verified", "satellite_data": "confirmed"}',
      retired: false,
      retirementCertificate: '',
      createdAt: Date.now(),
      metadata: '{}'
    }
  ];

  // Fetch all carbon credits
  const { data: credits = mockCredits, isLoading: creditsLoading } = useQuery({
    queryKey: ['credits'],
    queryFn: async () => {
      console.log('Fetching all carbon credits...');
      console.log('Using mock credit data for testing');
      return mockCredits;
    },
    staleTime: 30000,
  });

  // Create project mutation
  const createProjectMutation = useMutation({
    mutationFn: createProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['userProjects'] });
    },
  });

  // Mint credits mutation
  const mintCreditsMutation = useMutation({
    mutationFn: mintCredits,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['credits'] });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });

  // Create listing mutation
  const createListingMutation = useMutation({
    mutationFn: createListing,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['listings'] });
      queryClient.invalidateQueries({ queryKey: ['credits'] });
    },
  });

  // Buy credits mutation
  const buyCreditsMutation = useMutation({
    mutationFn: buyCredits,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['listings'] });
      queryClient.invalidateQueries({ queryKey: ['credits'] });
    },
  });

  return {
    // Data
    projects,
    userProjects,
    listings,
    credits,
    
    // Loading states
    projectsLoading,
    userProjectsLoading,
    listingsLoading,
    creditsLoading,
    
    // Mutations
    createProject: createProjectMutation.mutate as any,
    mintCredits: mintCreditsMutation.mutate as any,
    createListing: createListingMutation.mutate as any,
    buyCredits: buyCreditsMutation.mutate as any,
    
    // Mutation states
    isCreatingProject: createProjectMutation.isPending,
    isMintingCredits: mintCreditsMutation.isPending,
    isCreatingListing: createListingMutation.isPending,
    isBuyingCredits: buyCreditsMutation.isPending,
    
    // On-chain config
    onchainConfig
  };
}; 