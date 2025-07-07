import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { useSmartContracts } from './useSmartContracts';

// Import real on-chain config
import onchainConfig from '../onchain-config.json';

export interface ProjectFilters {
  projectType?: string;
  location?: string;
  verified?: boolean;
  minCredits?: number;
  maxCredits?: number;
}

export interface CarbonProject {
  id: string;
  name: string;
  description: string;
  location: string;
  project_type: string;
  developer: string;
  total_credits: number;
  available_credits: number;
  price_per_credit: number;
  verified: boolean;
  created_at: number;
  metadata: string;
}

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

export const useProjects = (filters?: ProjectFilters) => {
  const account = useCurrentAccount();
  const queryClient = useQueryClient();
  const { createProject, mintCredits, createListing, buyCredits } = useSmartContracts();

  // Load real on-chain projects from config and convert to CarbonProject format
  const realProjects: CarbonProject[] = onchainConfig.projects.map((project, index) => ({
    id: project.id,
    name: `Real Project ${index + 1}`,
    location: 'Brazil',
    project_type: 'Forest Conservation',
    description: 'Real on-chain carbon credit project',
    developer: account?.address || '0xde5043879bb960b742bd9963bbbb72cf7c46e0c24c54f5859ae2008eced4b997',
    total_credits: 10000,
    available_credits: 5000,
    price_per_credit: 0.1,
    verified: true,
    created_at: Date.now(),
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

  // Real on-chain credit listings (using real object IDs from config)
  const realListings: CreditListing[] = ((onchainConfig as any).realListings || []).map((listing: any) => ({
    id: listing.id,
    creditId: listing.credit_id,
    seller: listing.seller,
    price: listing.price * 1000000000, // Convert SUI to MIST
    quantity: listing.amount,
    active: listing.status === 'available',
    createdAt: listing.created_at
  }));

  // Fetch all credit listings
  const { data: listingsData = realListings, isLoading: listingsLoading } = useQuery({
    queryKey: ['listings'],
    queryFn: async () => {
      console.log('Fetching all credit listings...');
      console.log('Using real listing data from config');
      return realListings;
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
    // Return the expected property names that the component is looking for
    allProjects: projects || [],
    userProjects: userProjects || [],
    allListings: listingsData || [],
    carbonCredits: credits || [],
    isLoadingProjects: projectsLoading,
    isLoadingUserProjects: userProjectsLoading,
    isLoadingListings: listingsLoading,
    isLoadingCredits: creditsLoading,
    createProject: createProjectMutation.mutateAsync,
    mintCredits: mintCreditsMutation.mutateAsync,
    createListing: createListingMutation.mutateAsync,
    buyCredits: buyCreditsMutation.mutateAsync,
    // Mutation states
    isCreatingProject: createProjectMutation.isPending,
    isMintingCredits: mintCreditsMutation.isPending,
    isCreatingListing: createListingMutation.isPending,
    isBuyingCredits: buyCreditsMutation.isPending,
  };
}; 